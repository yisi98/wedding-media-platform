from datetime import datetime

from sqlalchemy import Boolean, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class EventConfig(Base):
    __tablename__ = "event_config"

    id: Mapped[int] = mapped_column(primary_key=True)
    # Singleton row: id=1 always

    uploads_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    max_image_size_mb: Mapped[int] = mapped_column(Integer, default=50, nullable=False)
    max_video_size_mb: Mapped[int] = mapped_column(Integer, default=500, nullable=False)
    event_name: Mapped[str] = mapped_column(String(255), default="Wedding", nullable=False)
    event_date: Mapped[str] = mapped_column(String(20), default="2026-10-10", nullable=False)

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
