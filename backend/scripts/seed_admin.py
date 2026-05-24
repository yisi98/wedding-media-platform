"""
Run once after migrations to create the initial admin account.
Usage: python scripts/seed_admin.py
"""
import asyncio
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from dotenv import load_dotenv
load_dotenv()

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.config import get_settings
from app.services.auth import seed_admin

settings = get_settings()


async def main() -> None:
    admin_username = os.environ.get("ADMIN_USERNAME", "admin")
    admin_password = os.environ.get("ADMIN_PASSWORD")
    if not admin_password:
        print("ERROR: Set ADMIN_PASSWORD environment variable")
        sys.exit(1)

    engine = create_async_engine(settings.database_url)
    Session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with Session() as db:
        user = await seed_admin(db, admin_username, admin_password)
        await db.commit()
        print(f"Admin account ready: username={user.username} id={user.id}")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(main())
