"""
MinIO CORS + bucket setup script.

Run once after starting containers:
    python scripts/setup_minio.py

This configures the wedding-media bucket with CORS rules that allow
browsers to POST directly to presigned upload URLs.
"""

import os
import sys
from pathlib import Path

# Allow running from project root or scripts/ dir
sys.path.insert(0, str(Path(__file__).parent.parent))

import boto3
from botocore.exceptions import ClientError
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / ".env")

ENDPOINT = os.getenv("S3_ENDPOINT_URL", "http://172.24.62.171:9000")
ACCESS_KEY = os.getenv("S3_ACCESS_KEY", "minioadmin")
SECRET_KEY = os.getenv("S3_SECRET_KEY", "minioadmin")
BUCKET = os.getenv("S3_BUCKET_NAME", "wedding-media")
REGION = os.getenv("S3_REGION", "us-east-1")

# Allowed origins for browser uploads (add your production domain here)
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_CONFIG = {
    "CORSRules": [
        {
            "AllowedOrigins": ALLOWED_ORIGINS,
            "AllowedMethods": ["GET", "POST", "PUT", "HEAD"],
            "AllowedHeaders": ["*"],
            "ExposeHeaders": ["ETag", "x-amz-request-id"],
            "MaxAgeSeconds": 3600,
        }
    ]
}


def main() -> None:
    s3 = boto3.client(
        "s3",
        endpoint_url=ENDPOINT,
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        region_name=REGION,
    )

    # 1. Create bucket if it doesn't exist
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

    # 2. Apply CORS configuration
    s3.put_bucket_cors(Bucket=BUCKET, CORSConfiguration=CORS_CONFIG)
    print(f"  CORS rules applied to '{BUCKET}':")
    for origin in ALLOWED_ORIGINS:
        print(f"    - {origin}")

    # 3. Verify
    result = s3.get_bucket_cors(Bucket=BUCKET)
    rules = result.get("CORSRules", [])
    print(f"\n  Verified: {len(rules)} CORS rule(s) active.")
    print("\nMinIO setup complete.")


if __name__ == "__main__":
    main()
