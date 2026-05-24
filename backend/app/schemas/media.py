from datetime import datetime

from pydantic import BaseModel, Field

from app.models.media import MediaStatus, MediaType


class UploadInitRequest(BaseModel):
    """Client sends file metadata; server returns a presigned URL."""
    filename: str = Field(..., max_length=255)
    file_size: int = Field(..., gt=0)
    mime_type: str
    file_hash: str = Field(..., min_length=64, max_length=64, description="SHA-256 hex digest")


class PresignedUploadResponse(BaseModel):
    upload_url: str
    upload_fields: dict  # Additional form fields for presigned POST
    media_id: int        # Pending media record id
    expires_in: int      # Seconds until presigned URL expires


class DuplicateWarning(BaseModel):
    is_duplicate: bool
    existing_media_id: int | None = None
    existing_media_url: str | None = None


class UploadConfirmRequest(BaseModel):
    media_id: int


class MediaResponse(BaseModel):
    id: int
    filename: str
    original_filename: str
    media_type: MediaType
    status: MediaStatus
    file_size: int
    mime_type: str
    width: int | None
    height: int | None
    duration_seconds: int | None
    thumbnail_url: str | None
    original_url: str | None
    uploader_id: int | None
    uploader_username: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class GalleryResponse(BaseModel):
    items: list[MediaResponse]
    total: int
    page: int
    page_size: int
    has_next: bool
