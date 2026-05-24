"""
Start the Celery worker for media processing.

Usage (from the backend/ directory):
    python scripts/start_worker.py

Or directly with celery (equivalent):
    celery -A app.workers.celery_app worker --loglevel=info --concurrency=2

Requirements:
  - Redis must be running (see REDIS_URL in .env)
  - MinIO must be running (see S3_* vars in .env)
  - FFmpeg must be on PATH for video processing

On Windows you may need to set the pool to 'solo' for development:
    celery -A app.workers.celery_app worker --loglevel=info --pool=solo
"""

import subprocess
import sys
from pathlib import Path

# Run from the backend/ directory so app imports work
backend_dir = Path(__file__).parent.parent
sys.path.insert(0, str(backend_dir))


def main() -> None:
    # Use 'solo' pool on Windows (gevent/prefork don't work well on Windows)
    pool = "solo" if sys.platform == "win32" else "prefork"

    cmd = [
        sys.executable, "-m", "celery",
        "-A", "app.workers.celery_app",
        "worker",
        "--loglevel=info",
        f"--pool={pool}",
        "--concurrency=2",
    ]

    print("Starting Celery worker...")
    print("  Command:", " ".join(cmd))
    print("  Working dir:", backend_dir)
    print("  Press Ctrl+C to stop.\n")

    subprocess.run(cmd, cwd=str(backend_dir))


if __name__ == "__main__":
    main()
