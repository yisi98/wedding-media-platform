import enum
from datetime import datetime

from sqlalchemy import BigInteger, Boolean, DateTime, Enum, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class MediaType(str, enum.Enum):
    IMAGE = "image"
    VIDEO = "video"


class MediaStatus(str, enum.Enum):
    PENDING = "pending"        # Uploaded to storage, awaiting processing
    PROCESSING = "processing"  # Thumbnail/transcoding in progress
    READY = "ready"            # Fully processed, visible in gallery
    FAILED = "failed"          # Processing failed


class Media(Base):
    __tablename__ = "media"

    id: Mapped[int] = mapped_column(primary_key=True)
    uploader_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    # File identity
    filename: Mapped[str] = mapped_column(String(255), nullable=False)
    original_filename: Mapped[str] = mapped_column(String(255), nullable=False)
    file_hash: Mapped[str] = mapped_column(String(64), unique=True, nullable=False, index=True)  # SHA-256
    file_size: Mapped[int] = mapped_column(BigInteger, nullable=False)
    mime_type: Mapped[str] = mapped_column(String(100), nullable=False)
    media_type: Mapped[MediaType] = mapped_column(
        Enum(MediaType, values_callable=lambda x: [e.value for e in x], name="mediatype"),
        nullable=False, index=True,
    )

    # Storage paths
    storage_path: Mapped[str] = mapped_column(String(500), nullable=False)          # Original
    thumbnail_path: Mapped[str | None] = mapped_column(String(500), nullable=True)  # 400x400 thumbnail
    optimized_path: Mapped[str | None] = mapped_column(String(500), nullable=True)  # WebP optimized

    # Media metadata
    width: Mapped[int | None] = mapped_column(Integer, nullable=True)
    height: Mapped[int | None] = mapped_column(Integer, nullable=True)
    duration_seconds: Mapped[int | None] = mapped_column(Integer, nullable=True)  # Video duration
    exif_data: Mapped[str | None] = mapped_column(Text, nullable=True)             # JSON string

    # Status
    status: Mapped[MediaStatus] = mapped_column(
        Enum(MediaStatus, values_callable=lambda x: [e.value for e in x], name="mediastatus"),
        default=MediaStatus.PENDING, nullable=False, index=True,
    )
    is_visible: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)  # Admin can hide

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False, index=True
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )

    uploader = relationship("User", back_populates="media_items")
