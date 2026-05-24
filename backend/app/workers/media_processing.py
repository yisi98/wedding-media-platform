"""
Celery tasks for post-upload media processing:
- Thumbnail generation (Pillow)
- Image optimization to WebP
- Video transcoding (FFmpeg)
- EXIF metadata extraction
"""
import io
import json
import os
import subprocess
import tempfile

import boto3
from botocore.config import Config
from celery import shared_task
from PIL import Image, ExifTags

from app.config import get_settings
from app.models.media import MediaStatus, MediaType
from app.services.storage import build_object_key

settings = get_settings()

THUMBNAIL_SIZE = (400, 400)


def _get_s3():
    return boto3.client(
        "s3",
        endpoint_url=settings.s3_endpoint_url,
        aws_access_key_id=settings.s3_access_key_id,
        aws_secret_access_key=settings.s3_secret_access_key,
        region_name=settings.s3_region,
        config=Config(signature_version="s3v4"),
    )


def _download_bytes(s3, key: str) -> bytes:
    response = s3.get_object(Bucket=settings.s3_bucket_name, Key=key)
    return response["Body"].read()


def _upload_bytes(s3, key: str, data: bytes, content_type: str) -> None:
    s3.put_object(
        Bucket=settings.s3_bucket_name,
        Key=key,
        Body=data,
        ContentType=content_type,
    )


def _extract_exif(img: Image.Image) -> dict:
    exif_data = {}
    try:
        raw = img._getexif()
        if raw:
            for tag_id, value in raw.items():
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                if isinstance(value, (str, int, float)):
                    exif_data[str(tag)] = value
    except Exception:
        pass
    return exif_data


@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def process_media(self, media_id: int) -> None:
    """Main processing task dispatched after upload confirmation."""
    import asyncio
    from sqlalchemy import select
    from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
    from app.models.media import Media

    async def _run():
        engine = create_async_engine(settings.database_url)
        Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

        async with Session() as db:
            result = await db.execute(select(Media).where(Media.id == media_id))
            media = result.scalar_one_or_none()
            if media is None:
                return

            try:
                s3 = _get_s3()
                original_bytes = _download_bytes(s3, media.storage_path)

                if media.media_type == MediaType.IMAGE:
                    _process_image(s3, media, original_bytes, db)
                elif media.media_type == MediaType.VIDEO:
                    await _process_video_async(s3, media, original_bytes)

                media.status = MediaStatus.READY
                await db.commit()

            except Exception as exc:
                media.status = MediaStatus.FAILED
                await db.commit()
                raise self.retry(exc=exc)

        await engine.dispose()

    asyncio.run(_run())


def _process_image(s3, media, original_bytes: bytes, db) -> None:
    """Generate thumbnail + WebP optimized version, update media record in-place."""
    img = Image.open(io.BytesIO(original_bytes))

    # Correct orientation based on EXIF
    try:
        img = img.convert("RGB")
        exif = _extract_exif(img)
        if exif:
            import asyncio
            media.exif_data = json.dumps(exif)
    except Exception:
        pass

    media.width = img.width
    media.height = img.height

    # Thumbnail
    thumb = img.copy()
    thumb.thumbnail(THUMBNAIL_SIZE, Image.LANCZOS)
    thumb_io = io.BytesIO()
    thumb.save(thumb_io, format="WEBP", quality=85)
    thumb_key = build_object_key(media.id, "thumb.webp", "thumbnail")
    _upload_bytes(s3, thumb_key, thumb_io.getvalue(), "image/webp")
    media.thumbnail_path = thumb_key

    # Optimized WebP (max 1920px wide)
    opt = img.copy()
    if opt.width > 1920:
        ratio = 1920 / opt.width
        opt = opt.resize((1920, int(opt.height * ratio)), Image.LANCZOS)
    opt_io = io.BytesIO()
    opt.save(opt_io, format="WEBP", quality=90)
    opt_key = build_object_key(media.id, "optimized.webp", "optimized")
    _upload_bytes(s3, opt_key, opt_io.getvalue(), "image/webp")
    media.optimized_path = opt_key


async def _process_video_async(s3, media, original_bytes: bytes) -> None:
    """Transcode video to H.264 MP4 and generate poster thumbnail."""
    with tempfile.TemporaryDirectory() as tmpdir:
        in_path = os.path.join(tmpdir, media.original_filename)
        out_path = os.path.join(tmpdir, "transcoded.mp4")
        thumb_path = os.path.join(tmpdir, "thumb.jpg")

        with open(in_path, "wb") as f:
            f.write(original_bytes)

        # Probe duration
        probe = subprocess.run(
            ["ffprobe", "-v", "quiet", "-print_format", "json", "-show_streams", in_path],
            capture_output=True, text=True, timeout=30,
        )
        try:
            stream_info = json.loads(probe.stdout)
            for stream in stream_info.get("streams", []):
                if stream.get("codec_type") == "video":
                    media.width = stream.get("width")
                    media.height = stream.get("height")
                    duration = stream.get("duration")
                    if duration:
                        media.duration_seconds = int(float(duration))
                    break
        except Exception:
            pass

        # Transcode to H.264
        subprocess.run(
            [
                "ffmpeg", "-i", in_path,
                "-c:v", "libx264", "-preset", "fast", "-crf", "23",
                "-c:a", "aac", "-b:a", "128k",
                "-movflags", "+faststart",
                "-y", out_path,
            ],
            capture_output=True, timeout=300,
        )

        # Extract thumbnail at 1 second
        subprocess.run(
            ["ffmpeg", "-i", in_path, "-ss", "1", "-vframes", "1", "-y", thumb_path],
            capture_output=True, timeout=30,
        )

        s3 = _get_s3()

        if os.path.exists(out_path):
            with open(out_path, "rb") as f:
                video_key = build_object_key(media.id, "transcoded.mp4", "optimized")
                _upload_bytes(s3, video_key, f.read(), "video/mp4")
                media.optimized_path = video_key

        if os.path.exists(thumb_path):
            with open(thumb_path, "rb") as f:
                thumb_key = build_object_key(media.id, "thumb.jpg", "thumbnail")
                _upload_bytes(s3, thumb_key, f.read(), "image/jpeg")
                media.thumbnail_path = thumb_key
