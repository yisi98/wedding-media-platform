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
- **Backend**: FastAPI (Python 3.11+) with async support
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
- `docs/PRODUCT_SPEC.md` - **Product requirements and specifications**
- `docs/GETTING_STARTED.md` - Start here for agentic coding approach
- `docs/architecture/ARCHITECTURE.md` - System architecture
- `docs/architecture/data-models.md` - Database schema
- `docs/CODING_STANDARDS.md` - Code quality guidelines
- `docs/TESTING_STRATEGY.md` - Testing approach
- `docs/PROJECT_STRUCTURE.md` - File organization

### Architecture Decision Records (ADRs)
- `docs/adr/001-technology-stack.md` - Tech stack choices
- `docs/adr/002-authentication-strategy.md` - Auth implementation
- `docs/adr/003-media-storage-strategy.md` - Media handling

### Workflows (`.windsurf/workflows/`)
- `setup-environment.md` - Development setup
- `add-feature.md` - Feature development workflow
- `fix-bug.md` - Bug fixing workflow
- `deploy.md` - Deployment workflow

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- Git

### Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd wedding-media-platform
```

2. **Use the setup workflow**
```bash
# In Cascade, type:
/setup-environment
```

Or manually:

3. **Backend Setup**
```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r backend/requirements.txt
```

4. **Frontend Setup**
```bash
cd frontend
npm install
```

5. **Environment Variables**
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

6. **Start Development**
```bash
# Terminal 1: Backend
cd backend
python manage.py runserver

# Terminal 2: Frontend
cd frontend
npm run dev
```

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

```bash
# Backend tests
pytest --cov=app

# Frontend tests
npm test

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
```bash
# Backend
ruff check backend/
black backend/

# Frontend
npm run lint
npm run type-check
```

### Commit Convention
```
<type>(<scope>): <subject>

feat(auth): add Google OAuth login
fix(media): resolve thumbnail generation
docs(api): update authentication docs
```

See `CONTRIBUTING.md` for detailed guidelines.

## 📋 Project Phases

- [x] **Phase 1**: Foundation & Documentation ✅
- [ ] **Phase 2**: Core Features (Auth, Upload, Gallery, i18n, Duplicate Detection)
- [ ] **Phase 3**: Advanced Features (Reactions, Comments, Search, Filters, Bulk Download)
- [ ] **Phase 4**: Premium Features (Real-time, AI, PWA, Face Detection)
- [ ] **Phase 5**: Admin & Analytics (Dashboard, Moderation, User Management)
- [ ] **Phase 6**: Testing & Optimization (Load testing, Performance, Security)
- [ ] **Phase 7**: Deployment (AliCloud infrastructure, Staging, Production)
- [ ] **Phase 8**: Wedding Event (Live monitoring, 150 concurrent users)
- [ ] **Phase 9**: Post-Event (Archive, Backup, Post-mortem)

**Development Timeline**: 12-14 weeks  
See `docs/PRODUCT_SPEC.md` for detailed feature list and timeline.

## 🌏 Deployment & Localization

### China-Specific Considerations
- **Hosting**: AliCloud (mainland China region) for optimal domestic performance
- **No blocked services**: No dependencies on Google, Facebook, AWS, or other blocked services
- **ICP filing**: Required for production deployment in China
- **CDN**: AliCloud CDN for media delivery
- **Languages**: Simplified Chinese (primary), English, Russian

### Performance Targets
- **Concurrent users**: 150 simultaneous users
- **Page load**: < 3 seconds on 4G
- **API response**: < 500ms (p95)
- **Storage**: Support up to 50GB total media

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
