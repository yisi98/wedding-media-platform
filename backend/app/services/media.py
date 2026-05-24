import mimetypes
import os
from urllib.parse import urlparse

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.media import Media, MediaStatus, MediaType
from app.models.user import User
from app.schemas.media import MediaResponse
from app.services.storage import build_object_key, generate_presigned_download_url


def detect_media_type(mime_type: str) -> MediaType:
    if mime_type.startswith("image/"):
        return MediaType.IMAGE
    if mime_type.startswith("video/"):
        return MediaType.VIDEO
    raise ValueError(f"Unsupported media type: {mime_type}")


def validate_file(mime_type: str, file_size: int, allowed_image_types: list, allowed_video_types: list,
                  max_image_bytes: int, max_video_bytes: int) -> None:
    if mime_type in allowed_image_types:
        if file_size > max_image_bytes:
            raise ValueError(f"Image too large. Max {max_image_bytes // (1024*1024)}MB")
    elif mime_type in allowed_video_types:
        if file_size > max_video_bytes:
            raise ValueError(f"Video too large. Max {max_video_bytes // (1024*1024)}MB")
    else:
        raise ValueError(f"File type not allowed: {mime_type}")


async def create_pending_media(
    db: AsyncSession,
    uploader_id: int,
    filename: str,
    file_hash: str,
    file_size: int,
    mime_type: str,
    media_type: MediaType,
) -> Media:
    safe_filename = os.path.basename(filename)
    unique_filename = f"{file_hash[:16]}_{safe_filename}"

    media = Media(
        uploader_id=uploader_id,
        filename=unique_filename,
        original_filename=filename,
        file_hash=file_hash,
        file_size=file_size,
        mime_type=mime_type,
        media_type=media_type,
        storage_path=build_object_key(0, unique_filename),  # placeholder; updated after flush
        status=MediaStatus.PENDING,
    )
    db.add(media)
    await db.flush()

    # Update storage path now that we have the real id
    media.storage_path = build_object_key(media.id, unique_filename)
    await db.flush()
    return media


async def confirm_upload(db: AsyncSession, media_id: int, uploader_id: int) -> Media | None:
    """Mark a pending upload as processing, triggering the Celery worker."""
    result = await db.execute(
        select(Media).where(
            Media.id == media_id,
            Media.uploader_id == uploader_id,
            Media.status == MediaStatus.PENDING,
        )
    )
    media = result.scalar_one_or_none()
    if media:
        media.status = MediaStatus.PROCESSING
    return media


def build_media_response(media: Media, user: User | None = None) -> MediaResponse:
    thumbnail_url = None
    original_url = None

    if media.thumbnail_path:
        thumbnail_url = generate_presigned_download_url(media.thumbnail_path)
    if media.storage_path:
        original_url = generate_presigned_download_url(media.storage_path)

    return MediaResponse(
        id=media.id,
        filename=media.filename,
        original_filename=media.original_filename,
        media_type=media.media_type,
        status=media.status,
        file_size=media.file_size,
        mime_type=media.mime_type,
        width=media.width,
        height=media.height,
        duration_seconds=media.duration_seconds,
        thumbnail_url=thumbnail_url,
        original_url=original_url,
        uploader_id=media.uploader_id,
        uploader_username=user.username if user else None,
        created_at=media.created_at,
    )


async def get_gallery_page(
    db: AsyncSession,
    page: int = 1,
    page_size: int = 30,
    media_type: MediaType | None = None,
    uploader_id: int | None = None,
) -> tuple[list[Media], int]:
    query = select(Media).where(
        Media.status == MediaStatus.READY,
        Media.is_visible.is_(True),
    )
    if media_type:
        query = query.where(Media.media_type == media_type)
    if uploader_id:
        query = query.where(Media.uploader_id == uploader_id)

    count_query = select(func.count()).select_from(query.subquery())
    count_result = await db.execute(count_query)
    total = count_result.scalar_one()

    query = query.order_by(Media.created_at.desc())
    query = query.offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(query)
    items = list(result.scalars())
    return items, total
