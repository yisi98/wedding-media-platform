# Wedding Media Platform

A single-event web application for collecting and sharing wedding photos and videos from ~150 guests, with multi-language support and deployment on Chinese cloud infrastructure.

## 🎯 Project Overview

A password-protected web app designed for **one wedding event**, allowing all attendees to upload and view photos/videos from their smartphones (iOS/Android) or PCs. Features duplicate detection, admin moderation, and support for English, Chinese, and Russian languages. Optimized for 150 concurrent users and hosted on AliCloud (mainland China) for fast access domestically and internationally.

### Key Features
- 🔐 **Password-based access** — Single event password for guest registration
- 📱 **Cross-platform** — Works on iOS, Android, and PC browsers
- 🌍 **Multi-language** — English, 中文, Русский (switchable on any page)
- 🚫 **Duplicate detection** — Hash-based deduplication prevents duplicate uploads
- 👑 **Admin controls** — Delete, configure, and manage content
- ☁️ **AliCloud deployment** — Hosted in mainland China for optimal performance
- ⚡ **High concurrency** — Supports 150 simultaneous users

## 🏗️ Architecture

- **Frontend**: Next.js 14+ with TypeScript, TailwindCSS, shadcn/ui, next-i18next
- **Backend**: FastAPI (Python 3.12+) with async support, managed by uv
- **Database**: PostgreSQL 15+ (AliCloud RDS) with SQLAlchemy ORM
- **Storage**: AliCloud OSS (Object Storage Service) for media files
- **Cache**: Redis 7+ (ApsaraDB for Redis) for sessions and caching
- **CDN**: AliCloud CDN for fast media delivery
- **Authentication**: Password-based (event password + user accounts)
- **Deployment**: Docker containers on AliCloud ECS

See `docs/architecture/ARCHITECTURE.md` and `docs/PRODUCT_SPEC.md` for details.

## 📚 Documentation Structure

This project uses **agentic coding** with comprehensive documentation:

### Core Documentation
- `docs/PRODUCT_SPEC.md` - **Product requirements and specifications** ([HTML version](docs/PRODUCT_SPEC.html))
- `docs/GETTING_STARTED.md` - Start here for agentic coding approach
- `docs/architecture/ARCHITECTURE.md` - System architecture
- `docs/architecture/data-models.md` - Database schema
- `docs/CODING_STANDARDS.md` - Code quality guidelines
- `docs/TESTING_STRATEGY.md` - Testing approach
- `docs/PROJECT_STRUCTURE.md` - File organization
- `README_SETUP.md` - **Development environment setup guide**
- `GIT_GUIDE.md` - Git workflow and commit guidelines
- `progress.md` - Project progress tracker

### Architecture Decision Records (ADRs)
- `docs/adr/001-technology-stack.md` - Tech stack (FastAPI, Next.js, PostgreSQL, Redis)
- `docs/adr/002-authentication-strategy.md` - Password-based auth (revised)
- `docs/adr/003-media-storage-strategy.md` - AliCloud OSS storage (revised)
- `docs/adr/004-internationalization-strategy.md` - Multi-language (EN/ZH/RU)
- `docs/adr/005-duplicate-detection-strategy.md` - SHA-256 hash-based deduplication

### Workflows (`.windsurf/workflows/`)
- `setup-environment.md` - Development setup
- `add-feature.md` - Feature development workflow
- `fix-bug.md` - Bug fixing workflow
- `deploy.md` - Deployment workflow

## 🚀 Quick Start

### Prerequisites
- **uv** (Python package manager) - [Install](https://docs.astral.sh/uv/)
- Node.js 20+
- Docker Desktop
- Git

**Note**: uv will automatically install Python 3.12 if needed.

### Setup

**See `README_SETUP.md` for detailed setup instructions.**

#### Quick Start:

1. **Start infrastructure**
```powershell
docker-compose up -d
```

2. **Backend setup**
```powershell
cd backend
uv sync                    # Install dependencies
copy .env.example .env     # Configure environment
uv run alembic upgrade head  # Run migrations
uv run uvicorn app.main:app --reload  # Start server
```

3. **Frontend setup**
```powershell
cd frontend
npm install
copy .env.example .env.local
npm run dev
```

**Access**:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## 🤖 Agentic Coding Approach

This project is designed for agentic coding with AI assistants like Cascade:

### Key Principles
1. **Documentation-First**: All decisions documented in ADRs
2. **Workflow-Driven**: Use workflows for common tasks
3. **Standards-Based**: Follow coding standards strictly
4. **Test-Driven**: Write tests before implementation
5. **Iterative**: Build incrementally with clear milestones

### Working with AI Agents

**Good Requests:**
- "Implement the User model following docs/architecture/data-models.md"
- "Add authentication endpoints according to ADR-002"
- "Create tests for the media upload service"

**Use Workflows:**
- `/setup-environment` - Setup development environment
- `/add-feature` - Add new features
- `/fix-bug` - Debug and fix issues
- `/deploy` - Deploy to production

### Before Starting Development
1. Read `docs/GETTING_STARTED.md`
2. Review architecture docs
3. Understand ADRs
4. Follow workflows

## 🧪 Testing

```powershell
# Backend tests
uv run pytest
uv run pytest --cov=app --cov-report=html

# Frontend tests
npm test
npm run test:coverage

# E2E tests
npm run test:e2e
```

## 📦 Project Structure

```
wedding-media-platform/
├── .windsurf/workflows/    # Agentic coding workflows
├── backend/                # FastAPI backend
├── frontend/               # Next.js frontend
├── docs/                   # Comprehensive documentation
│   ├── architecture/       # Architecture docs
│   ├── adr/               # Decision records
│   └── features/          # Feature specs
├── scripts/               # Utility scripts
└── docker-compose.yml     # Local development
```

## 🛠️ Development

### Code Quality
```powershell
# Backend (using uv)
uv run ruff check .
uv run black .
uv run mypy app

# Frontend
npm run lint
npm run type-check
```

### Adding Dependencies
```powershell
# Backend
uv add package-name        # Production dependency
uv add --dev package-name  # Dev dependency

# Frontend
npm install package-name
```

### Commit Convention
```
<type>(<scope>): <subject>

feat(auth): add Google OAuth login
fix(media): resolve thumbnail generation
docs(api): update authentication docs
```

See `CONTRIBUTING.md` for detailed guidelines.

## 📋 Project Status & Timeline

### Current Status
- ✅ **Phase 1 Complete**: Foundation & Documentation (May 24, 2026)
- 🚧 **Phase 2 In Progress**: Core Features Development

### Critical Dates
- **Hard Deadline**: September 15, 2026 (all development complete)
- **Wedding Event**: October 10, 2026
- **Time Remaining**: 16 weeks (tight schedule - 0-2 weeks buffer)

### Project Phases
- [x] **Phase 1**: Foundation & Documentation ✅
- [ ] **Phase 2**: Core Features (Auth, Upload, Gallery, i18n, Duplicate Detection) - Weeks 1-4
- [ ] **Phase 3**: Advanced Features (Reactions, Comments, Search, Filters, Bulk Download) - Weeks 5-7
- [ ] **Phase 4**: Premium Features (Real-time, AI, PWA, Face Detection) - Weeks 8-10
- [ ] **Phase 5**: Admin & Analytics (Dashboard, Moderation, User Management) - Week 11
- [ ] **Phase 6**: Testing & Optimization (Load testing, Performance, Security) - Weeks 12-13
- [ ] **Phase 7**: Deployment (AliCloud infrastructure, Staging, Production) - Week 14
- [ ] **Phase 8**: Wedding Event (Live monitoring, 150 concurrent users) - Oct 10, 2026
- [ ] **Phase 9**: Post-Event (Archive, Backup, Post-mortem) - Week after

**Development Timeline**: 14-16 weeks (must stay on track!)  
See `docs/PRODUCT_SPEC.md` or `docs/PRODUCT_SPEC.html` for detailed feature list.

## 🌏 Deployment & Localization

### Event Details
- **Wedding Date**: October 10, 2026
- **Event Password**: Set in environment variables (see `.env.example`)
- **Expected Users**: ~150 concurrent users
- **Admin Accounts**: Multiple admins supported

### China-Specific Considerations
- **Hosting**: AliCloud (mainland China region) for optimal domestic performance
- **No blocked services**: No dependencies on Google, Facebook, AWS, or other blocked services
- **ICP filing**: Required for production deployment in China (TBD)
- **CDN**: AliCloud CDN for media delivery
- **Languages**: Simplified Chinese (primary), English, Russian

### Performance Targets
- **Concurrent users**: 150 simultaneous users
- **Page load**: < 3 seconds on 4G
- **API response**: < 500ms (p95)
- **Storage**: Support up to 50GB total media (~7,500 photos)

## 🤝 Contributing

See `CONTRIBUTING.md` for development workflow and guidelines.

## 📄 License

See `LICENSE` file for details.

## 🔗 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Architecture Decision Records](https://adr.github.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)

---

**Built with agentic coding principles for maintainability, scalability, and collaboration.**
