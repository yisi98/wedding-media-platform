from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Application
    app_name: str = "wedding-media-platform"
    app_env: str = "development"
    debug: bool = False
    log_level: str = "INFO"

    # Event Configuration
    event_password_hash: str  # Required: bcrypt hash
    event_date: str = "2026-10-10"

    # Server
    host: str = "0.0.0.0"
    port: int = 8000

    # Security
    secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # Database
    database_url: str
    database_pool_size: int = 10
    database_max_overflow: int = 20

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    # Object Storage (S3-compatible / MinIO / AliCloud OSS)
    s3_endpoint_url: str = "http://localhost:9000"
    s3_bucket_name: str = "wedding-media"
    s3_region: str = "us-east-1"
    s3_access_key_id: str = "minioadmin"
    s3_secret_access_key: str = "minioadmin"
    s3_presigned_url_expire_seconds: int = 3600

    # CORS
    cors_origins: str = "http://localhost:3000"

    # Rate limiting
    rate_limit_per_minute: int = 100

    # Media constraints
    max_image_size_mb: int = 50
    max_video_size_mb: int = 500
    allowed_image_types: str = "image/jpeg,image/png,image/webp,image/heic"
    allowed_video_types: str = "video/mp4,video/quicktime,video/webm"

    # Observability
    sentry_dsn: str = ""

    @property
    def cors_origins_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    @property
    def allowed_image_types_list(self) -> List[str]:
        return [t.strip() for t in self.allowed_image_types.split(",")]

    @property
    def allowed_video_types_list(self) -> List[str]:
        return [t.strip() for t in self.allowed_video_types.split(",")]

    @property
    def max_image_size_bytes(self) -> int:
        return self.max_image_size_mb * 1024 * 1024

    @property
    def max_video_size_bytes(self) -> int:
        return self.max_video_size_mb * 1024 * 1024


@lru_cache
def get_settings() -> Settings:
    return Settings()
