"""
S3-compatible storage abstraction (MinIO for dev, AliCloud OSS for prod).
Both expose the same boto3/botocore presigned URL interface.
"""
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError

from app.config import get_settings

settings = get_settings()

_s3_client = None


def get_s3_client():
    global _s3_client
    if _s3_client is None:
        _s3_client = boto3.client(
            "s3",
            endpoint_url=settings.s3_endpoint_url,
            aws_access_key_id=settings.s3_access_key_id,
            aws_secret_access_key=settings.s3_secret_access_key,
            region_name=settings.s3_region,
            config=Config(signature_version="s3v4"),
        )
    return _s3_client


def generate_presigned_upload_url(object_key: str, content_type: str, file_size: int) -> dict:
    """Returns presigned POST fields for direct browser-to-storage upload."""
    client = get_s3_client()
    response = client.generate_presigned_post(
        Bucket=settings.s3_bucket_name,
        Key=object_key,
        Fields={"Content-Type": content_type},
        Conditions=[
            {"Content-Type": content_type},
            ["content-length-range", 1, file_size],
        ],
        ExpiresIn=settings.s3_presigned_url_expire_seconds,
    )
    return {
        "url": response["url"],
        "fields": response["fields"],
    }


def generate_presigned_download_url(object_key: str, expires_in: int | None = None) -> str:
    """Returns a presigned GET URL for downloading/viewing an object."""
    client = get_s3_client()
    return client.generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.s3_bucket_name, "Key": object_key},
        ExpiresIn=expires_in or settings.s3_presigned_url_expire_seconds,
    )


def delete_object(object_key: str) -> None:
    client = get_s3_client()
    client.delete_object(Bucket=settings.s3_bucket_name, Key=object_key)


def object_exists(object_key: str) -> bool:
    client = get_s3_client()
    try:
        client.head_object(Bucket=settings.s3_bucket_name, Key=object_key)
        return True
    except ClientError:
        return False


def build_object_key(media_id: int, filename: str, variant: str = "original") -> str:
    """
    Consistent key structure: media/{id}/{variant}/{filename}
    variant: original | thumbnail | optimized
    """
    return f"media/{media_id}/{variant}/{filename}"
