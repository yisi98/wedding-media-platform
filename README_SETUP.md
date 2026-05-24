# Local Development Setup Guide

## Prerequisites

### Required Software:
1. **uv** - Fast Python package installer [Install](https://docs.astral.sh/uv/getting-started/installation/)
   ```powershell
   # Windows (PowerShell)
   powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```
2. **Node.js 20+** - [Download](https://nodejs.org/)
3. **Container Runtime** (choose one):
   - **Podman Desktop** (FREE, recommended) - [Download](https://podman-desktop.io/)
   - Docker Engine (Linux only, free)
   - ~~Docker Desktop~~ (requires paid license for commercial use)
4. **Git** - [Download](https://git-scm.com/)

### Optional (for video processing):
5. **FFmpeg** - [Download](https://ffmpeg.org/download.html)

**Notes**: 
- `uv` will automatically install Python 3.12 if needed
- Podman is 100% compatible with Docker commands (just alias `docker=podman`)

---

## Quick Start (5 minutes)

### 1. Start Infrastructure Services

#### Option A: Using Podman (Recommended - FREE)
```powershell
# Install Podman Desktop from https://podman-desktop.io/
# After installation, start Podman machine (first time only)
podman machine init
podman machine start

# Use podman-compose (install if needed)
pip install podman-compose

# Start services
podman-compose up -d
```

#### Option B: Using Docker (if you already have it)
```powershell
docker-compose up -d
```

This starts:
- **PostgreSQL** on `localhost:5432`
- **Redis** on `localhost:6379`
- **MinIO** on `localhost:9000` (API) and `localhost:9001` (Console)

Verify services:
```powershell
# Podman
podman-compose ps

# Docker
docker-compose ps
```

### 2. Setup Backend

```powershell
# Navigate to backend
cd backend

# Install dependencies (uv creates venv automatically)
uv sync

# Copy environment file
copy .env.example .env

# Run database migrations
uv run alembic upgrade head

# Start backend server
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API docs at: `http://localhost:8000/docs`

### 3. Setup Frontend

```powershell
# Open new terminal, navigate to frontend
cd frontend

# Install dependencies
npm install

# Copy environment file
copy .env.example .env.local

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## Detailed Setup

### Backend Setup (Detailed)

#### 1. Install Dependencies with uv
```powershell
cd backend

# Install all dependencies (creates .venv automatically)
uv sync

# Or install with dev dependencies explicitly
uv sync --all-extras
```

**Note**: `uv` automatically creates and manages the virtual environment in `.venv`

#### 3. Environment Configuration
```powershell
copy .env.example .env
```

Edit `.env` and set required secrets:
```env
# REQUIRED: Set event password hash
EVENT_PASSWORD_HASH=<bcrypt-hash-of-password>

# REQUIRED: Generate random secret key
SECRET_KEY=<random-string-min-32-chars>
```

**Security Note**: Never commit `.env` to git. See `SECURITY.md` for details on generating password hashes.

#### 4. Database Setup
```powershell
# Initialize Alembic (only first time)
uv run alembic init alembic

# Create initial migration
uv run alembic revision --autogenerate -m "Initial schema"

# Apply migrations
uv run alembic upgrade head
```

#### 5. Create Admin User
```powershell
# Run seed script (to be created)
uv run python scripts/seed_admin.py
```

#### 6. Start Backend
```powershell
# Development mode (auto-reload)
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# With workers (production-like)
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### 7. Start Celery Worker (for background tasks)
```powershell
# Open new terminal
cd backend

# Start worker
uv run celery -A app.worker worker --loglevel=info --pool=solo
```

**Note**: On Windows, use `--pool=solo` for Celery.

### Frontend Setup (Detailed)

#### 1. Install Dependencies
```powershell
cd frontend
npm install
```

#### 2. Environment Configuration
```powershell
copy .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

#### 3. Start Development Server
```powershell
npm run dev
```

#### 4. Run Tests
```powershell
# Unit tests
npm test

# With coverage
npm run test:coverage

# E2E tests (requires app running)
npm run test:e2e
```

---

## Accessing Services

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:8000 | - |
| API Docs (Swagger) | http://localhost:8000/docs | - |
| PostgreSQL | localhost:5432 | `wedding_user` / `wedding_dev_password` |
| Redis | localhost:6379 | No password |
| MinIO Console | http://localhost:9001 | `minioadmin` / `minioadmin` |
| MinIO API | http://localhost:9000 | `minioadmin` / `minioadmin` |

---

## Common Commands

### Container Management (Podman/Docker)
```powershell
# Start all services
podman-compose up -d    # or: docker-compose up -d

# Stop all services
podman-compose down     # or: docker-compose down

# View logs
podman-compose logs -f  # or: docker-compose logs -f

# Restart a service
podman-compose restart postgres  # or: docker-compose restart postgres

# Remove all data (⚠️ destructive)
podman-compose down -v  # or: docker-compose down -v

# Check running containers
podman ps               # or: docker ps
```

**Tip**: Create an alias for convenience:
```powershell
# PowerShell profile (~\Documents\PowerShell\Microsoft.PowerShell_profile.ps1)
Set-Alias -Name docker -Value podman
Set-Alias -Name docker-compose -Value podman-compose
```

### Backend
```powershell
# Run tests
uv run pytest

# Run tests with coverage
uv run pytest --cov=app --cov-report=html

# Lint code
uv run ruff check .

# Format code
uv run black .

# Type check
uv run mypy app

# Create new migration
uv run alembic revision --autogenerate -m "description"

# Apply migrations
uv run alembic upgrade head

# Rollback migration
uv run alembic downgrade -1

# Add new dependency
uv add package-name

# Add dev dependency
uv add --dev package-name
```

### Frontend
```powershell
# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Lint
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

---

## Troubleshooting

### Container Issues (Podman/Docker)

**Problem**: Containers won't start
```powershell
# Podman: Check machine is running
podman machine list
podman machine start

# Check containers
podman ps -a            # or: docker ps -a

# Check logs
podman-compose logs     # or: docker-compose logs

# Restart Podman Desktop or Docker Desktop
```

**Problem**: Port already in use
```powershell
# Find process using port (e.g., 5432)
netstat -ano | findstr :5432

# Kill process by PID
taskkill /PID <PID> /F
```

### Backend Issues

**Problem**: ModuleNotFoundError
```powershell
# Reinstall dependencies
uv sync

# Or force reinstall
uv sync --reinstall
```

**Problem**: uv command not found
```powershell
# Install uv
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Restart terminal
```

**Problem**: Database connection error
```powershell
# Check PostgreSQL is running
docker-compose ps postgres

# Check connection string in .env
# Should be: postgresql+asyncpg://wedding_user:wedding_dev_password@localhost:5432/wedding_media
```

### Frontend Issues

**Problem**: Module not found
```powershell
# Delete node_modules and reinstall
rm -r node_modules
npm install
```

**Problem**: Port 3000 already in use
```powershell
# Use different port
$env:PORT=3001; npm run dev
```

---

## Next Steps

1. ✅ Start all Docker services
2. ✅ Setup backend and run migrations
3. ✅ Setup frontend
4. ✅ Access http://localhost:3000
5. 📝 Start implementing Phase 2 features

---

## Development Workflow

1. **Create feature branch**
   ```powershell
   git checkout -b feature/user-authentication
   ```

2. **Make changes** (backend and/or frontend)

3. **Run tests**
   ```powershell
   # Backend
   cd backend
   pytest

   # Frontend
   cd frontend
   npm test
   ```

4. **Lint and format**
   ```powershell
   # Backend
   ruff check . && black .

   # Frontend
   npm run lint && npm run format
   ```

5. **Commit with conventional commits**
   ```powershell
   git add .
   git commit -m "feat(auth): add user registration endpoint"
   ```

6. **Push and create PR**
   ```powershell
   git push origin feature/user-authentication
   ```

---

## Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Next.js Docs**: https://nextjs.org/docs
- **SQLAlchemy Docs**: https://docs.sqlalchemy.org/
- **Alembic Docs**: https://alembic.sqlalchemy.org/
- **TailwindCSS Docs**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/

---

**Timeline Reminder**: Hard deadline September 15, 2026 - Stay on track! ⚠️
