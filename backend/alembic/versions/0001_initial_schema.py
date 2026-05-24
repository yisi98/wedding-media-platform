"""Initial schema: users, media, event_config, refresh_tokens

Revision ID: 0001
Revises:
Create Date: 2026-05-24
"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0001"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("username", sa.String(50), nullable=False, unique=True),
        sa.Column("email", sa.String(255), nullable=True, unique=True),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.Enum("guest", "admin", name="userrole"), nullable=False, server_default="guest"),
        sa.Column("language_preference", sa.Enum("en", "zh", "ru", name="languagepreference"), nullable=False, server_default="en"),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_users_username", "users", ["username"])
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "media",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("uploader_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="SET NULL"), nullable=True),
        sa.Column("filename", sa.String(255), nullable=False),
        sa.Column("original_filename", sa.String(255), nullable=False),
        sa.Column("file_hash", sa.String(64), nullable=False, unique=True),
        sa.Column("file_size", sa.BigInteger(), nullable=False),
        sa.Column("mime_type", sa.String(100), nullable=False),
        sa.Column("media_type", sa.Enum("image", "video", name="mediatype"), nullable=False),
        sa.Column("storage_path", sa.String(500), nullable=False),
        sa.Column("thumbnail_path", sa.String(500), nullable=True),
        sa.Column("optimized_path", sa.String(500), nullable=True),
        sa.Column("width", sa.Integer(), nullable=True),
        sa.Column("height", sa.Integer(), nullable=True),
        sa.Column("duration_seconds", sa.Integer(), nullable=True),
        sa.Column("exif_data", sa.Text(), nullable=True),
        sa.Column("status", sa.Enum("pending", "processing", "ready", "failed", name="mediastatus"), nullable=False, server_default="pending"),
        sa.Column("is_visible", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_media_file_hash", "media", ["file_hash"])
    op.create_index("ix_media_uploader_id", "media", ["uploader_id"])
    op.create_index("ix_media_status", "media", ["status"])
    op.create_index("ix_media_created_at", "media", ["created_at"])
    op.create_index("ix_media_media_type", "media", ["media_type"])

    op.create_table(
        "event_config",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("uploads_enabled", sa.Boolean(), nullable=False, server_default="true"),
        sa.Column("max_image_size_mb", sa.Integer(), nullable=False, server_default="50"),
        sa.Column("max_video_size_mb", sa.Integer(), nullable=False, server_default="500"),
        sa.Column("event_name", sa.String(255), nullable=False, server_default="Wedding"),
        sa.Column("event_date", sa.String(20), nullable=False, server_default="2026-10-10"),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "refresh_tokens",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token_hash", sa.String(64), nullable=False, unique=True),
        sa.Column("is_revoked", sa.Boolean(), nullable=False, server_default="false"),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index("ix_refresh_tokens_user_id", "refresh_tokens", ["user_id"])
    op.create_index("ix_refresh_tokens_token_hash", "refresh_tokens", ["token_hash"])


def downgrade() -> None:
    op.drop_table("refresh_tokens")
    op.drop_table("event_config")
    op.drop_table("media")
    op.drop_table("users")
    op.execute("DROP TYPE IF EXISTS userrole")
    op.execute("DROP TYPE IF EXISTS languagepreference")
    op.execute("DROP TYPE IF EXISTS mediatype")
    op.execute("DROP TYPE IF EXISTS mediastatus")
