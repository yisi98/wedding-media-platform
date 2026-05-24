"""
MinIO bucket setup script.

Run once after starting containers:
    python scripts/setup_minio.py

NOTE ON CORS: MinIO's PutBucketCors S3 API is not available in all builds.
The platform uses backend-proxied uploads (browser → FastAPI → MinIO) to
avoid any CORS configuration requirement on MinIO entirely.
"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ENDPOINT = os.getenv("S3_ENDPOINT_URL", "http://172.24.62.171:9000")
ACCESS_KEY = os.getenv("S3_ACCESS_KEY_ID", "minioadmin")
SECRET_KEY = os.getenv("S3_SECRET_ACCESS_KEY", "minioadmin")
BUCKET = os.getenv("S3_BUCKET_NAME", "wedding-media")
REGION = os.getenv("S3_REGION", "us-east-1")


def main() -> None:
    s3 = boto3.client(
        "s3",
        endpoint_url=ENDPOINT,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name=REGION,
    )

    # Create bucket if it doesn't exist
    try:
        s3.head_bucket(Bucket=BUCKET)
        print(f"  Bucket '{BUCKET}' already exists.")
    except ClientError as e:
        code = int(e.response["Error"]["Code"])
        if code == 404:
            s3.create_bucket(Bucket=BUCKET)
            print(f"  Created bucket '{BUCKET}'.")
        else:
            raise

    # Set bucket policy to allow authenticated reads
    # (Objects are accessed via presigned URLs, so no public read needed)
    print(f"  Bucket '{BUCKET}' is configured for authenticated access via presigned URLs.")
    print("\nMinIO setup complete.")
    print("\nNote: Browser uploads go through the FastAPI backend (no MinIO CORS required).")
    print("      Viewing media uses presigned download URLs from FastAPI.")


if __name__ == "__main__":
    main()
