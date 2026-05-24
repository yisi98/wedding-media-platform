import asyncio

from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.media import MediaType
from app.models.user import User
from app.schemas.media import (
    DuplicateWarning,
    GalleryResponse,
    MediaResponse,
    PresignedUploadResponse,
    UploadConfirmRequest,
    UploadInitRequest,
)
from app.services import media as media_service
from app.services.deduplication import find_duplicate
from app.services.media import build_media_response
from app.services.storage import build_object_key, generate_presigned_download_url, generate_presigned_upload_url, get_s3_client
from app.workers.media_processing import process_media

router = APIRouter(prefix="/media", tags=["media"])
settings = get_settings()


@router.post("/upload/init", response_model=PresignedUploadResponse | DuplicateWarning)
async def init_upload(
    body: UploadInitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Check for event config: are uploads enabled?
    # (EventConfig check omitted here for brevity; add in admin router)

    # Validate file type and size
    try:
        media_service.validate_file(
            body.mime_type,
            body.file_size,
            settings.allowed_image_types_list,
            settings.allowed_video_types_list,
            settings.max_image_size_bytes,
            settings.max_video_size_bytes,
        )
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc))

    # Duplicate detection
    duplicate = await find_duplicate(db, body.file_hash)
    if duplicate:
        existing_url = generate_presigned_download_url(duplicate.thumbnail_path or duplicate.storage_path)
        return DuplicateWarning(
            is_duplicate=True,
            existing_media_id=duplicate.id,
            existing_media_url=existing_url,
        )

    # Create pending media record
    media_type = media_service.detect_media_type(body.mime_type)
    pending = await media_service.create_pending_media(
        db,
        uploader_id=current_user.id,
        filename=body.filename,
        file_hash=body.file_hash,
        file_size=body.file_size,
        mime_type=body.mime_type,
        media_type=media_type,
    )

    presigned = generate_presigned_upload_url(pending.storage_path, body.mime_type, body.file_size)

    return PresignedUploadResponse(
        upload_url=presigned["url"],
        upload_fields=presigned["fields"],
        media_id=pending.id,
        expires_in=settings.s3_presigned_url_expire_seconds,
    )


@router.post("/upload/file/{media_id}", response_model=MediaResponse)
async def upload_file_proxy(
    media_id: int,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Accept a file upload from the browser and stream it directly to MinIO.
    This avoids any CORS configuration requirements on MinIO itself.
    """
    from sqlalchemy import select
    from app.models.media import Media, MediaStatus

    result = await db.execute(
        select(Media).where(Media.id == media_id, Media.uploader_id == current_user.id)
    )
    media = result.scalar_one_or_none()
    if media is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pending upload not found")
    if media.status != MediaStatus.PENDING:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Upload already processed")

    file_bytes = await file.read()

    s3 = get_s3_client()

    def _upload() -> None:
        s3.put_object(
            Bucket=settings.s3_bucket_name,
            Key=media.storage_path,
            Body=file_bytes,
            ContentType=media.mime_type,
        )

    await asyncio.to_thread(_upload)

    media.status = MediaStatus.PROCESSING
    await db.flush()

    process_media.delay(media.id)

    return build_media_response(media, current_user)


@router.post("/upload/confirm", response_model=MediaResponse)
async def confirm_upload(
    body: UploadConfirmRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    media = await media_service.confirm_upload(db, body.media_id, current_user.id)
    if media is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Pending upload not found")

    # Enqueue processing job
    process_media.delay(media.id)

    return build_media_response(media, current_user)


@router.get("", response_model=GalleryResponse)
async def get_gallery(
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=30, ge=1, le=100),
    media_type: MediaType | None = Query(default=None),
    uploader_id: int | None = Query(default=None),
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    items, total = await media_service.get_gallery_page(db, page, page_size, media_type, uploader_id)

    response_items = [build_media_response(m) for m in items]

    return GalleryResponse(
        items=response_items,
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )


@router.get("/{media_id}", response_model=MediaResponse)
async def get_media(
    media_id: int,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select
    from app.models.media import Media, MediaStatus

    result = await db.execute(
        select(Media).where(Media.id == media_id, Media.is_visible.is_(True))
    )
    media = result.scalar_one_or_none()
    if media is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found")
    return build_media_response(media)


@router.delete("/{media_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_media(
    media_id: int,
    current_user: User = Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    from sqlalchemy import select
    from app.models.media import Media
    from app.services.storage import delete_object

    result = await db.execute(select(Media).where(Media.id == media_id))
    media = result.scalar_one_or_none()
    if media is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Media not found")

    # Remove from storage
    for path in [media.storage_path, media.thumbnail_path, media.optimized_path]:
        if path:
            try:
                delete_object(path)
            except Exception:
                pass  # Best-effort cleanup

    await db.delete(media)
