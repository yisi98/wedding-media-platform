import hashlib
import secrets
from datetime import datetime, timedelta, timezone

import bcrypt
from jose import JWTError, jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import get_settings
from app.models.refresh_token import RefreshToken
from app.models.user import LanguagePreference, User, UserRole

settings = get_settings()


def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())


def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()


def verify_event_password(plain: str) -> bool:
    return bcrypt.checkpw(plain.encode(), settings.event_password_hash.encode())


def create_access_token(user_id: int, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
    payload = {"sub": str(user_id), "role": role, "exp": expire, "type": "access"}
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def create_refresh_token() -> str:
    return secrets.token_urlsafe(48)


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "access":
            raise JWTError("Not an access token")
        return payload
    except JWTError:
        raise


async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()


async def get_user_by_username(db: AsyncSession, username: str) -> User | None:
    result = await db.execute(select(User).where(User.username == username))
    return result.scalar_one_or_none()


async def register_user(
    db: AsyncSession,
    username: str,
    password: str,
    email: str | None,
    language: LanguagePreference,
) -> User:
    user = User(
        username=username,
        hashed_password=hash_password(password),
        email=email,
        role=UserRole.GUEST,
        language_preference=language,
    )
    db.add(user)
    await db.flush()
    return user


async def store_refresh_token(db: AsyncSession, user_id: int, token: str) -> None:
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_token_expire_days)
    rt = RefreshToken(
        user_id=user_id,
        token_hash=_hash_token(token),
        expires_at=expires_at,
    )
    db.add(rt)
    await db.flush()


async def rotate_refresh_token(db: AsyncSession, old_token: str) -> tuple[User, str] | None:
    token_hash = _hash_token(old_token)
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.token_hash == token_hash,
            RefreshToken.is_revoked.is_(False),
            RefreshToken.expires_at > datetime.now(timezone.utc),
        )
    )
    rt = result.scalar_one_or_none()
    if rt is None:
        return None

    rt.is_revoked = True
    user = await get_user_by_id(db, rt.user_id)
    if user is None or not user.is_active:
        return None

    new_token = create_refresh_token()
    await store_refresh_token(db, user.id, new_token)
    return user, new_token


async def revoke_all_user_tokens(db: AsyncSession, user_id: int) -> None:
    result = await db.execute(
        select(RefreshToken).where(
            RefreshToken.user_id == user_id,
            RefreshToken.is_revoked.is_(False),
        )
    )
    for rt in result.scalars():
        rt.is_revoked = True


async def seed_admin(db: AsyncSession, username: str, password: str) -> User:
    existing = await get_user_by_username(db, username)
    if existing:
        return existing
    user = User(
        username=username,
        hashed_password=hash_password(password),
        role=UserRole.ADMIN,
        language_preference=LanguagePreference.EN,
    )
    db.add(user)
    await db.flush()
    return user
