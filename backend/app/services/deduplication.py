from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.media import Media, MediaStatus


async def find_duplicate(db: AsyncSession, file_hash: str) -> Media | None:
    """Return an existing READY/PROCESSING media record with the same SHA-256 hash, or None."""
    result = await db.execute(
        select(Media).where(
            Media.file_hash == file_hash,
            Media.status.in_([MediaStatus.READY, MediaStatus.PROCESSING, MediaStatus.PENDING]),
        )
    )
    return result.scalar_one_or_none()
