# Progress Tracker

> **Purpose**: Long-horizon state across coding sessions. Agents and humans update this when starting, pausing, or finishing work. Keep it terse — link out for details.

## Current Focus
**Active task**: Phase 2 backend + frontend running locally — next: Celery worker, frontend UI polish, cross-browser test
**Active phase**: Phase 2 — Core Features Development
**Project scope**: Full-featured single wedding event app, 150 concurrent users, multi-language (EN/ZH/RU), AliCloud deployment
**Development approach**: Build complete feature set (not MVP)
**Wedding date**: October 10, 2026
**Hard deadline**: September 15, 2026 (all development complete)
**Time available**: 16 weeks from now (May 24 → Sep 15)
**Development timeline**: 12-14 weeks development + 2 weeks deployment = **14-16 weeks total**
**Status**: ⚠️ Tight schedule (0-2 weeks buffer) - must stay on track

## Phase Status

### Phase 1: Foundation & Documentation — ✅ COMPLETE
- [x] Repository structure created
- [x] Architecture docs (`docs/architecture/`)
- [x] ADRs 001-005 written (tech stack, auth, storage, i18n, deduplication)
- [x] Coding standards & testing strategy
- [x] Core workflows (`.windsurf/workflows/`)
- [x] Agent rules (`.windsurf/rules/`)
- [x] `AGENTS.md` entry point
- [x] Feature spec template
- [x] API design doc
- [x] CI workflow (`.github/workflows/ci.yml`) - configured, checks optional until Phase 2
- [x] Pre-commit hooks
- [x] `.env.example` files for backend & frontend
- [x] PR / issue templates
- [x] Additional workflows (`/onboard`, `/write-tests`, `/create-adr`, `/refactor`)
- [x] Product specification (`docs/PRODUCT_SPEC.md` + HTML version)
- [x] README updated with actual requirements
- [x] Security documentation (`SECURITY.md`)
- [x] Git workflow guide (`GIT_GUIDE.md`)
- [x] Development setup guide (`README_SETUP.md`)
- [x] Docker Compose for local dev (PostgreSQL, Redis, MinIO)
- [x] Podman setup guide (free Docker alternative)
- [x] Python 3.12 + uv configuration
- [x] Security vulnerabilities fixed (9 CVEs - 1 CRITICAL, 8 HIGH)

### Phase 2: Core Features Development — IN PROGRESS

**Local Development Environment:**
- [x] Docker Compose / Podman Compose setup (PostgreSQL, Redis, MinIO) — running ✅
- [x] Backend deps installed in root `.venv` (Python 3.12)
- [x] Frontend npm deps installed (Node 24)
- [x] `backend/.env` configured (WSL IP for Podman containers)
- [x] Podman containers confirmed healthy
- [x] Backend connected to PostgreSQL + Redis + MinIO ✅
- [x] Frontend dev server running at localhost:3000 ✅
- [x] Alembic migration 0001 applied (all 4 tables created) ✅
- [x] Admin account seeded (username: admin) ✅
- [x] End-to-end API smoke test passed (register, /me, gallery, admin login) ✅
- **Note**: Podman containers on WSL IP 172.24.62.171 (update .env if WSL restarts)

**Backend (Week 1-2):**
- [ ] Initialize FastAPI project skeleton
- [ ] Database setup (PostgreSQL + Alembic)
- [ ] Database models:
  - [ ] User (username, password, role, language_preference)
  - [ ] Media (file_hash, storage_path, metadata, uploader)
  - [ ] EventConfig (event_password, settings)
  - [ ] RefreshToken (session management)
- [ ] Authentication system:
  - [ ] Event password validation
  - [ ] User registration endpoint
  - [ ] Login/logout endpoints
  - [ ] JWT + refresh token implementation
  - [ ] Admin account seeding
- [ ] Media upload API:
  - [ ] Presigned URL generation (AliCloud OSS)
  - [ ] Upload confirmation endpoint
  - [ ] Duplicate detection (SHA-256 hash check)
  - [ ] File validation (type, size)
- [ ] Media processing:
  - [ ] Celery worker setup
  - [ ] Thumbnail generation (Pillow)
  - [ ] Image optimization (WebP conversion)
  - [ ] Video transcoding (FFmpeg, H.264)
  - [ ] EXIF metadata extraction
- [ ] Media retrieval API:
  - [ ] Paginated gallery endpoint
  - [ ] Individual media endpoint
  - [ ] CDN URL generation
- [ ] i18n support (gettext for API messages)

**Frontend (Week 3-4):**
- [ ] Initialize Next.js 14+ project
- [ ] Setup next-i18next (EN/ZH/RU)
- [ ] Translation files for all three languages
- [ ] Authentication pages:
  - [ ] Registration page (event password + user details)
  - [ ] Login page
  - [ ] Language switcher component (persistent)
- [ ] Upload interface:
  - [ ] Drag-and-drop upload zone
  - [ ] File picker (multi-select)
  - [ ] Batch upload queue
  - [ ] Upload progress bars (per file + total)
  - [ ] Duplicate warning modal
  - [ ] Success/error notifications
- [ ] Gallery page:
  - [ ] Infinite scroll grid layout
  - [ ] Lazy loading with Intersection Observer
  - [ ] Thumbnail display (200x200)
  - [ ] Video thumbnails with play icon
  - [ ] Loading skeletons
  - [ ] Empty state (no photos yet)
- [ ] Lightbox component:
  - [ ] Full-screen overlay
  - [ ] Image display with zoom
  - [ ] Video player (HTML5)
  - [ ] Navigation (swipe/arrows)
  - [ ] Download button
  - [ ] Close button
  - [ ] Keyboard shortcuts
- [ ] Responsive design:
  - [ ] Mobile layout (1-2 columns)
  - [ ] Tablet layout (2-3 columns)
  - [ ] Desktop layout (3-4 columns)
  - [ ] Touch gestures (swipe, pinch-zoom)
- [ ] Cross-browser testing:
  - [ ] iOS Safari 14+
  - [ ] Android Chrome 90+
  - [ ] Desktop Chrome, Firefox, Edge, Safari

### Phase 3: Advanced Features — NOT STARTED

**Social & Engagement (Week 5):**
- [ ] Database models for reactions, comments, favorites
- [ ] Reactions API (like, love, laugh)
- [ ] Comments API (create, read, delete)
- [ ] Favorites API (bookmark photos)
- [ ] User profile API
- [ ] Frontend: Reaction buttons on photos
- [ ] Frontend: Comment section in lightbox
- [ ] Frontend: Favorites page
- [ ] Frontend: User profile page

**Search & Discovery (Week 6):**
- [ ] Filter API (by date, uploader, media type)
- [ ] Search API (filename search)
- [ ] Sort API (newest, oldest, most liked, most viewed)
- [ ] Frontend: Filter bar component
- [ ] Frontend: Search input
- [ ] Frontend: Sort dropdown
- [ ] Frontend: Timeline view (chronological grouping)
- [ ] Frontend: Filter persistence (URL params)

**Download & Sharing (Week 7):**
- [ ] Bulk download API (ZIP generation)
- [ ] Share link API (generate shareable URLs)
- [ ] QR code generation API
- [ ] Frontend: Multi-select mode
- [ ] Frontend: Bulk download button
- [ ] Frontend: WeChat share integration (native API)
- [ ] Frontend: Share link modal
- [ ] Frontend: QR code display

### Phase 4: Premium Features — NOT STARTED

**Real-Time & Notifications (Week 8):**
- [ ] WebSocket server setup
- [ ] Real-time upload events
- [ ] Activity feed API
- [ ] Push notification service
- [ ] Email service (SMTP setup)
- [ ] Frontend: WebSocket client
- [ ] Frontend: Live activity feed
- [ ] Frontend: Push notification permission
- [ ] Frontend: Email digest preferences

**AI & Automation (Week 9):**
- [ ] Perceptual hashing (pHash/dHash)
- [ ] Similar photo detection API
- [ ] Face detection (OpenCV or cloud service)
- [ ] Face grouping algorithm
- [ ] Auto-album generation (clustering)
- [ ] Smart thumbnail cropping
- [ ] Frontend: Similar photos view
- [ ] Frontend: Face-based albums
- [ ] Frontend: Auto-generated albums

**Performance & UX (Week 10):**
- [ ] PWA manifest and service worker
- [ ] Offline caching strategy
- [ ] Progressive image loading (LQIP)
- [ ] Adaptive video streaming (HLS transcoding)
- [ ] Image prefetching
- [ ] Frontend: Add to home screen prompt
- [ ] Frontend: Offline indicator
- [ ] Frontend: Blur-up image effect
- [ ] Frontend: Adaptive video player

### Phase 5: Admin & Analytics — NOT STARTED
- [ ] Admin dashboard backend (stats aggregation)
- [ ] Analytics API (uploads, users, storage, activity)
- [ ] Content moderation API (hide, flag, bulk delete)
- [ ] User management API (list, disable, enable)
- [ ] Export API (bulk download all media)
- [ ] Frontend: Admin dashboard page
- [ ] Frontend: Analytics charts (Chart.js or Recharts)
- [ ] Frontend: Content moderation interface
- [ ] Frontend: User management table
- [ ] Frontend: Export functionality

### Phase 6: Testing & Optimization — NOT STARTED
- [ ] Local testing with 10-20 users
- [ ] Load testing (simulate 150 concurrent users)
- [ ] Cross-platform testing (iOS, Android, PC)
- [ ] Multi-language testing (EN/ZH/RU)
- [ ] Docker images for backend + frontend
- [ ] AliCloud account setup
- [ ] AliCloud services provisioned (ECS, RDS, OSS, Redis, CDN)
- [ ] Deploy to AliCloud staging environment
- [ ] Performance testing on AliCloud
- [ ] SSL certificate setup
- [ ] Domain DNS configuration
- [ ] Production deployment
- [ ] Smoke tests on production

### Phase 7: Deployment — NOT STARTED
**Target**: September 1-15, 2026 (HARD DEADLINE: Sep 15)
- [ ] AliCloud account setup (provide credentials when ready)
- [ ] Provision services (ECS, RDS, OSS, Redis, CDN)
- [ ] Domain name registration and DNS setup
- [ ] ICP filing (if required, start early - takes 2-4 weeks)
- [ ] Docker images (backend, frontend)
- [ ] Docker Compose for staging
- [ ] SSL certificate (Let's Encrypt or AliCloud)
- [ ] Deploy to staging environment
- [ ] Staging smoke tests
- [ ] Production deployment
- [ ] Production smoke tests
- [ ] Monitoring setup (CloudMonitor, logs)

### Phase 8: Wedding Event (Live Operation) — NOT STARTED
**Date**: October 10, 2026 (and surrounding days)
- [ ] Pre-event checklist (1 week before)
- [ ] Monitor server load and performance
- [ ] Multiple admin accounts ready
- [ ] Incident response plan ready
- [ ] Real-time monitoring dashboard
- [ ] Backup verification
- [ ] Performance metrics tracking
- [ ] Guest support (event password distributed via secure channel)

### Phase 9: Post-Event — NOT STARTED
- [ ] Disable uploads (archive mode)
- [ ] Backup all media to external storage
- [ ] Export all media for couple
- [ ] Export user data if needed
- [ ] Post-mortem analysis
- [ ] Lessons learned documentation
- [ ] Optional: Keep read-only access for guests
- [ ] Decommission or archive infrastructure

## Open Questions
- [x] **Wedding event date**: October 10, 2026
- [x] **Event password**: Set (stored securely, not in git)
- [x] **Admin accounts**: Multiple admins supported
- [ ] **Domain name**: TBD (will configure before deployment)
- [ ] **AliCloud details**: TBD (will set up closer to deployment)
- [ ] **ICP filing status**: TBD (will handle before deployment)
- [ ] **Media retention**: TBD (decide after event)
- [ ] **Email notifications**: TBD (optional feature)
- [ ] **WeChat sharing**: TBD (likely yes for Chinese guests)

## Recent Decisions
| Date | Decision | Link |
|------|----------|------|
| 2026-05-24 | Adopt FastAPI + Next.js stack | ADR-001 |
| 2026-05-24 | Password-only auth with event password + admin account | ADR-002 (revised) |
| 2026-05-24 | AliCloud OSS + CDN for media storage | ADR-003 (revised) |
| 2026-05-24 | Single-event scope, 150 users, AliCloud deployment | PRODUCT_SPEC.md |
| 2026-05-24 | Multi-language: EN/ZH/RU (next-i18next + gettext) | ADR-004 |
| 2026-05-24 | SHA-256 hash-based duplicate detection | ADR-005 |
| 2026-05-24 | Build full-featured app (not MVP) | User decision |
| 2026-05-24 | Infinite scroll gallery with lightbox | Analysis |
| 2026-05-24 | Wedding date: October 10, 2026 | User input |
| 2026-05-24 | Event password configured (not in git) | Security |
| 2026-05-24 | Multiple admin accounts supported | User input |
| 2026-05-24 | AliCloud setup deferred until deployment phase | User decision |
| 2026-05-24 | Hard deadline: September 15, 2026 (all complete) | User requirement |
| 2026-05-24 | Security fixes: Updated 3 packages (9 CVEs fixed - 1 CRITICAL, 8 HIGH) | Security audit |
| 2026-05-24 | Storage: 50GB starting, scalable up to 1TB maximum | User requirement |

## Blocked / Waiting
_None_

## Session Log
Append a short entry per session.

### 2026-05-24 — Foundation setup (COMPLETE)
- Created docs, ADRs, workflows, agent rules, AGENTS.md
- Completed Tier 1 + 2 agentic coding setup (19 files)
- Created comprehensive product specification (PRODUCT_SPEC.md)
- Updated README with actual project requirements
- Clarified scope: single wedding event, 150 concurrent users, multi-language (EN/ZH/RU), AliCloud deployment
- Revised ADR-002 (password-only auth) and ADR-003 (AliCloud OSS)
- Created ADR-004 (i18n strategy) and ADR-005 (duplicate detection)
- **Phase 1 complete** — Ready for Phase 2 development
- **Decision**: Build full-featured app (not MVP approach)
- Expanded plan to 9 phases with all advanced features
- **Timeline confirmed**: Wedding October 10, 2026
- **Hard deadline**: September 15, 2026 (all development complete)
- Time available: 16 weeks, Development needed: 14-16 weeks ⚠️ Tight schedule
- Event password configured (stored securely in .env, not in git)
- Multiple admin accounts will be created
- AliCloud setup deferred to Phase 7 (Sep 1-15)
- Security fixes: Updated 3 packages (9 CVEs fixed - 1 CRITICAL, 8 HIGH)
- Podman setup guide created (free Docker alternative)
- Product spec HTML version created
- CI/CD configured (checks optional until Phase 2, security always enforced)
- Git workflow and security documentation complete
- **Total files created**: 50+ across documentation, config, and setup
- **Phase 1 Status**: ✅ COMPLETE - Ready to commit
- Next: Commit Phase 1, then start Phase 2 (backend/frontend skeletons)
