# Product Specification: Wedding Media Platform

> **Version**: 1.0  
> **Last Updated**: 2026-05-24  
> **Status**: Active

## 1. Executive Summary

A single-event web application for collecting and sharing photos and videos from wedding attendees. Designed for ~150 concurrent users across iOS, Android, and PC platforms, with multi-language support (English, Chinese, Russian) and deployment on Chinese cloud infrastructure (AliCloud/AliYun).

## 2. Problem Statement

**Problem**: Wedding attendees capture hundreds of photos and videos on their personal devices, but there's no centralized, easy way to collect and share all media from the event.

**Current Pain Points**:
- Guests use various messaging apps (WeChat, WhatsApp) creating fragmented collections
- No single source of truth for all wedding media
- Difficult to prevent duplicate uploads
- Hard to manage and curate content
- Language barriers for international guests

**Solution**: A dedicated web app accessible to all guests via password, supporting all platforms and languages, with admin controls and duplicate detection.

## 3. Target Users

### 3.1 Primary Users: Wedding Guests (~150 people)
- **Platforms**: iOS (60%), Android (35%), PC/Desktop (5%)
- **Languages**: Chinese (70%), English (20%), Russian (10%)
- **Technical Proficiency**: Mixed (from basic smartphone users to tech-savvy)
- **Location**: China mainland + international guests
- **Usage Pattern**: Intensive during/after wedding (1-3 days), then occasional access

### 3.2 Secondary User: Event Administrator (1-2 people)
- **Role**: Wedding organizers/couple
- **Needs**: Content moderation, configuration, analytics
- **Technical Proficiency**: Moderate

## 4. Core Requirements

### 4.1 Functional Requirements

#### FR-1: Authentication & Access Control
- **Password-based registration**: Single event password allows anyone to create account
- **User accounts**: Email/username + password (no OAuth required)
- **Admin account**: Special admin credentials with elevated privileges
- **Session management**: Persistent login across devices
- **Access scope**: Single wedding event only (no multi-event support)

#### FR-2: Media Upload
- **Supported formats**:
  - Images: JPEG, PNG, HEIC (iOS), WebP
  - Videos: MP4, MOV, WebM
- **File size limits**:
  - Images: Up to 50MB per file
  - Videos: Up to 500MB per file
- **Duplicate detection**: Hash-based deduplication (MD5/SHA256)
  - Warn user if duplicate detected
  - Option to skip or force upload
- **Batch upload**: Multiple files at once
- **Upload progress**: Real-time progress indicator
- **Mobile optimization**: Camera roll integration on iOS/Android

#### FR-3: Media Viewing & Gallery
- **Responsive gallery**: Grid view optimized for mobile/tablet/desktop
- **Lazy loading**: Load images as user scrolls
- **Lightbox viewer**: Full-screen view with swipe/keyboard navigation
- **Filtering**: By date, uploader, media type
- **Search**: By filename, date
- **Download**: Individual or batch download (zip)

#### FR-4: Admin Functions
- **Content moderation**:
  - Delete inappropriate media
  - Bulk delete
- **User management**:
  - View all users
  - Disable/enable accounts
- **Configuration**:
  - Change event password
  - Set upload limits
  - Enable/disable uploads (close event)
- **Analytics dashboard**:
  - Total uploads
  - Storage usage
  - Active users
  - Upload timeline

#### FR-5: Multi-Language Support (i18n)
- **Supported languages**: English, 中文 (Chinese Simplified), Русский (Russian)
- **Language switcher**: Available on every page (persistent preference)
- **Translated elements**:
  - All UI text
  - Error messages
  - Email notifications (if any)
- **Default language**: Auto-detect from browser, fallback to English

#### FR-6: Cross-Platform Compatibility
- **Web-based**: No native apps required
- **Responsive design**: Mobile-first approach
- **Browser support**:
  - iOS Safari 14+
  - Android Chrome 90+
  - Desktop Chrome, Firefox, Edge, Safari
- **PWA features** (optional):
  - Add to home screen
  - Offline viewing of cached media

### 4.2 Non-Functional Requirements

#### NFR-1: Performance
- **Concurrent users**: Support 150 simultaneous users
- **Page load time**: < 3 seconds on 4G connection
- **Upload speed**: Limited by user bandwidth, not server
- **API response time**: < 500ms (p95) for standard operations
- **Image optimization**: Auto-compress for web display (keep original)

#### NFR-2: Scalability
- **Storage**: Support up to 50GB total media (estimate: 150 users × 50 photos × 2MB avg)
- **Horizontal scaling**: Ability to add more server instances if needed
- **CDN**: Use AliCloud CDN for media delivery

#### NFR-3: Availability & Reliability
- **Uptime**: 99% during event period (3-day window)
- **Data durability**: No media loss (backup strategy required)
- **Graceful degradation**: If upload fails, queue for retry

#### NFR-4: Security
- **HTTPS only**: SSL/TLS encryption
- **Password strength**: Minimum 8 characters for user accounts
- **Admin protection**: Strong admin password, rate limiting on login
- **File validation**: Server-side file type and size validation
- **No public access**: Requires authentication for all content
- **XSS/CSRF protection**: Standard web security measures

#### NFR-5: Compliance & Localization
- **China deployment**: 
  - Hosted on AliCloud (mainland China region)
  - No dependency on blocked services (Google, Facebook, AWS S3)
  - Fast access from China mainland
- **International access**: Accessible from overseas (may be slower)
- **Data residency**: All data stored in China
- **ICP filing**: Required for China hosting (user responsibility)

#### NFR-6: Usability
- **Mobile-first**: Optimized for smartphone use
- **Intuitive UI**: Minimal learning curve
- **Accessibility**: WCAG 2.1 AA compliance (where feasible)
- **Error messages**: Clear, actionable, translated

## 5. User Stories & Journeys

### 5.1 Guest User Journey
1. **Receive invitation**: Get event password via WeChat/WhatsApp
2. **Access web app**: Open URL on phone browser
3. **Register**: Create account with event password
4. **Upload photos**: Select photos from camera roll, upload batch
5. **View gallery**: Browse all wedding photos from all guests
6. **Download favorites**: Download specific photos to device
7. **Switch language**: Change to preferred language (Chinese/English/Russian)

### 5.2 Admin User Journey
1. **Login as admin**: Use admin credentials
2. **Monitor uploads**: View real-time upload activity
3. **Moderate content**: Delete inappropriate/duplicate photos
4. **Manage users**: Check who has registered
5. **Close event**: Disable uploads after event concludes
6. **Export all media**: Bulk download for archival

## 6. Feature Prioritization (Full-Featured App)

### 6.1 Core Features (Phase 2)
**Authentication & Access:**
- [ ] Password-based registration + login
- [ ] Admin account with full moderation powers
- [ ] User profile with language preference
- [ ] Session management with persistent login

**Media Management:**
- [ ] Photo upload (JPEG, PNG, HEIC, WebP)
- [ ] Video upload (MP4, MOV, WebM)
- [ ] Batch upload (multiple files at once)
- [ ] Upload progress tracking
- [ ] Duplicate detection (SHA-256 hash-based)
- [ ] Auto-thumbnail generation
- [ ] Image optimization (WebP conversion)
- [ ] Video transcoding (H.264, multiple resolutions)

**Gallery & Viewing:**
- [ ] Infinite scroll grid layout
- [ ] Lazy loading with progressive images
- [ ] Lightbox with full-screen view
- [ ] Swipe navigation (mobile) / keyboard arrows (desktop)
- [ ] Pinch-to-zoom on photos
- [ ] Video playback in lightbox
- [ ] Responsive design (mobile/tablet/desktop)

**Multi-Language:**
- [ ] English, 中文 (Simplified), Русский
- [ ] Language switcher on every page
- [ ] Persistent language preference
- [ ] Translated UI and error messages

### 6.2 Advanced Features (Phase 3)
**Social & Engagement:**
- [ ] Reactions/likes on photos (❤️ 👍 😂)
- [ ] Comments on photos/videos
- [ ] User mentions in comments (@username)
- [ ] Favorites/bookmarks (save photos to personal collection)
- [ ] View count tracking

**Search & Discovery:**
- [ ] Filter by date (today, yesterday, all time)
- [ ] Filter by uploader (all users, specific user, my uploads)
- [ ] Filter by media type (photos only, videos only)
- [ ] Search by filename
- [ ] Sort options (newest, oldest, most liked, most viewed)
- [ ] Timeline view (chronological grouping)

**Download & Sharing:**
- [ ] Individual photo/video download
- [ ] Bulk download (select multiple, download as ZIP)
- [ ] Share to WeChat (native share API)
- [ ] Share link generation (direct link to photo)
- [ ] QR code for event access

**Admin Features:**
- [ ] Analytics dashboard (uploads, users, storage, activity)
- [ ] Content moderation (delete, hide, flag)
- [ ] User management (view all, disable accounts)
- [ ] Bulk delete operations
- [ ] Change event password
- [ ] Enable/disable uploads (close event)
- [ ] Export all media (bulk download for archival)
- [ ] View upload timeline
- [ ] Storage usage monitoring

### 6.3 Premium Features (Phase 4)
**Real-Time & Notifications:**
- [ ] Real-time upload notifications (WebSocket)
- [ ] Live activity feed (who uploaded what, when)
- [ ] Push notifications (new photos from event)
- [ ] Email digests (daily summary of new uploads)

**AI & Automation:**
- [ ] Perceptual hashing (detect similar photos)
- [ ] Auto-generated albums (group by time/location)
- [ ] Face detection and grouping
- [ ] Smart cropping for thumbnails
- [ ] Auto-enhance photos (brightness, contrast)
- [ ] Duplicate photo clustering (show all similar)

**Performance & UX:**
- [ ] PWA features (add to home screen, offline viewing)
- [ ] Service worker for caching
- [ ] Progressive image loading (LQIP - Low Quality Image Placeholder)
- [ ] Adaptive bitrate streaming for videos (HLS)
- [ ] Image lazy loading with blur-up effect
- [ ] Prefetching next page

**Collaboration:**
- [ ] Photo albums (user-created collections)
- [ ] Collaborative albums (multiple users can add)
- [ ] Photo tagging (tag people in photos)
- [ ] Event highlights (admin-curated best photos)
- [ ] Slideshow mode (auto-play gallery)

### 6.4 Out of Scope
**Explicitly NOT included:**
- Multi-event support (one wedding only)
- Social login (OAuth with Google/Facebook)
- Payment processing
- Live streaming
- Native mobile apps (web app only)
- Video editing features
- Photo editing features (filters, cropping)

## 7. Technical Constraints

### 7.1 Hosting & Infrastructure
- **Cloud provider**: AliCloud (AliYun) — mainland China region
- **Services to use**:
  - ECS (Elastic Compute Service) for application servers
  - OSS (Object Storage Service) for media files
  - RDS (Relational Database Service) for PostgreSQL
  - Redis (ApsaraDB for Redis) for caching
  - CDN for media delivery
- **Development/testing**: Local PC hosting initially
- **Deployment**: Docker containers for easy migration to AliCloud

### 7.2 Technology Stack (per ADR-001)
- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: Next.js 14+ (React, TypeScript)
- **Database**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Storage**: AliCloud OSS (S3-compatible)
- **i18n**: next-i18next (frontend), gettext (backend)

### 7.3 Blocked Services in China
**Avoid dependencies on:**
- Google services (Analytics, Fonts, Maps, OAuth)
- Facebook services
- AWS S3 (use AliCloud OSS instead)
- Cloudflare (use AliCloud CDN)
- Twitter, YouTube embeds

**Use instead:**
- AliCloud CDN
- Self-hosted fonts or China-accessible CDNs
- WeChat OAuth (if social login needed in future)

## 8. Success Metrics

### 8.1 Launch Success Criteria
- [ ] All 150 guests can register and login
- [ ] Average upload success rate > 95%
- [ ] No downtime during peak usage (wedding day)
- [ ] Page load time < 3s on 4G
- [ ] Zero data loss
- [ ] All three languages functional

### 8.2 Post-Launch Metrics
- **Engagement**: % of guests who uploaded at least 1 photo
- **Content**: Total photos/videos uploaded
- **Performance**: Average upload time, API response times
- **Errors**: Upload failure rate, error logs
- **Usage**: Peak concurrent users, storage used

## 9. Assumptions & Risks

### 9.1 Assumptions
- Users have smartphones with cameras
- Users have stable internet (4G or WiFi)
- Event password is shared securely (not leaked publicly)
- Admin monitors content periodically
- Wedding event is 1-3 days, then archive mode

### 9.2 Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| 150 concurrent uploads overwhelm server | High | Medium | Load testing, auto-scaling on AliCloud |
| Duplicate uploads fill storage | Medium | High | Hash-based deduplication (FR-2) |
| Inappropriate content uploaded | Medium | Low | Admin moderation tools, user reporting |
| Event password leaked publicly | High | Low | Admin can change password, disable accounts |
| China firewall blocks dependencies | High | Medium | Use AliCloud services only, no Google/AWS |
| Mobile browser compatibility issues | Medium | Medium | Extensive cross-browser testing |
| Storage costs exceed budget | Medium | Low | Set upload limits, monitor usage |

## 10. Deployment Strategy

### 10.1 Development Environment
- Local PC hosting for development and initial testing
- Docker Compose for local stack (PostgreSQL, Redis, MinIO)
- Test with 10-20 users before production

### 10.2 Production Deployment (AliCloud)
1. **Pre-deployment**:
   - ICP filing completed (if required)
   - Domain registered and DNS configured
   - SSL certificate obtained
   - AliCloud account and services provisioned

2. **Infrastructure setup**:
   - ECS instances (2x for redundancy)
   - RDS PostgreSQL (with backup)
   - ApsaraDB Redis
   - OSS bucket for media
   - CDN configured
   - Load balancer (SLB)

3. **Deployment process**:
   - Docker images built and pushed to AliCloud Container Registry
   - Deploy to ECS via Docker Compose or Kubernetes
   - Database migrations applied
   - Smoke tests run
   - DNS cutover

4. **Monitoring**:
   - AliCloud CloudMonitor for infrastructure
   - Application logs to AliCloud Log Service
   - Error tracking (self-hosted Sentry or similar)

### 10.3 Rollback Plan
- Keep previous Docker images
- Database backup before each deployment
- Ability to rollback within 5 minutes if critical issue

## 11. Timeline & Milestones

### Phase 1: Foundation ✅ (Complete)
- [x] Documentation and architecture setup
- [x] ADRs, workflows, coding standards
- [x] Product specification

### Phase 2: Core Features (3-4 weeks)
**Week 1-2: Backend**
- [ ] FastAPI project setup
- [ ] Database models (User, Media, EventConfig)
- [ ] Authentication (event password + JWT)
- [ ] Upload API with duplicate detection
- [ ] AliCloud OSS integration
- [ ] Image processing (thumbnails, optimization)
- [ ] Video transcoding pipeline

**Week 3-4: Frontend**
- [ ] Next.js project setup with next-i18next
- [ ] Authentication UI (register, login)
- [ ] Upload interface (drag-drop, batch, progress)
- [ ] Infinite scroll gallery with lazy loading
- [ ] Lightbox with navigation
- [ ] Language switcher (EN/ZH/RU)
- [ ] Responsive design (mobile/tablet/desktop)

### Phase 3: Advanced Features (2-3 weeks)
**Week 5: Social & Engagement**
- [ ] Reactions/likes system
- [ ] Comments on photos
- [ ] Favorites/bookmarks
- [ ] User profiles

**Week 6: Search & Discovery**
- [ ] Filters (date, uploader, media type)
- [ ] Search functionality
- [ ] Sort options
- [ ] Timeline view

**Week 7: Download & Sharing**
- [ ] Bulk download (ZIP generation)
- [ ] WeChat share integration
- [ ] Share links and QR codes

### Phase 4: Premium Features (2-3 weeks)
**Week 8: Real-Time & Notifications**
- [ ] WebSocket integration
- [ ] Real-time activity feed
- [ ] Push notifications
- [ ] Email digests

**Week 9: AI & Automation**
- [ ] Perceptual hashing (similar photo detection)
- [ ] Face detection and grouping
- [ ] Auto-generated albums
- [ ] Smart cropping

**Week 10: Performance & UX**
- [ ] PWA features (offline mode, add to home screen)
- [ ] Service worker caching
- [ ] Progressive image loading
- [ ] Adaptive video streaming (HLS)

### Phase 5: Admin & Analytics (1 week)
- [ ] Admin dashboard with analytics
- [ ] Content moderation tools
- [ ] User management
- [ ] Storage monitoring
- [ ] Export functionality

### Phase 6: Testing & Optimization (2 weeks)
- [ ] Load testing (150 concurrent users)
- [ ] Cross-browser testing (iOS Safari, Android Chrome, Desktop)
- [ ] Multi-language testing (EN/ZH/RU)
- [ ] Performance optimization
- [ ] Security audit
- [ ] Accessibility testing (WCAG AA)

### Phase 7: Deployment (1 week)
- [ ] AliCloud infrastructure setup
- [ ] Docker images and deployment
- [ ] SSL certificate and DNS
- [ ] Staging environment testing
- [ ] Production deployment
- [ ] Smoke tests

### Phase 8: Wedding Event (3 days)
- [ ] Monitor live usage
- [ ] Admin support
- [ ] Real-time incident response
- [ ] Performance monitoring

### Phase 9: Post-Event (1 week)
- [ ] Archive mode (disable uploads)
- [ ] Backup all media
- [ ] Export for couple
- [ ] Post-mortem analysis
- [ ] Lessons learned documentation

**Total Development Time: 12-14 weeks**

## 12. Open Questions & Answers

### Confirmed:
- [x] **Event date**: October 10, 2026
- [x] **Event password**: Configured in environment variables (not in git)
- [x] **Admin accounts**: Multiple admins supported
- [x] **Development timeline**: 16 weeks available (May 24 → Sep 15), 14-16 weeks needed
- [x] **Hard deadline**: September 15, 2026 (all development complete)
- [x] **Buffer**: 0-2 weeks (tight schedule, must stay on track)

### To Be Determined (Before Deployment):
- [ ] **Domain name**: TBD (configure in Phase 7)
- [ ] **ICP filing**: TBD (start 2-4 weeks before deployment if needed)
- [ ] **AliCloud budget**: TBD (estimate: $50-100/month for 150 users)
- [ ] **AliCloud credentials**: TBD (provide in Phase 7)
- [ ] **Backup strategy**: TBD (decide post-event retention period)
- [ ] **Email notifications**: TBD (optional, requires SMTP setup)
- [ ] **WeChat integration**: TBD (likely yes for Chinese guests)

## 13. Glossary

- **Event password**: Single shared password that allows guest registration
- **Admin account**: Special account with moderation and configuration privileges
- **Duplicate detection**: Hash-based comparison to identify identical files
- **AliCloud/AliYun**: Alibaba Cloud, Chinese cloud service provider
- **OSS**: Object Storage Service (AliCloud's S3 equivalent)
- **ICP filing**: Internet Content Provider license required for China hosting
- **i18n**: Internationalization (multi-language support)

## 14. References

- **Architecture**: `docs/architecture/ARCHITECTURE.md`
- **Data Models**: `docs/architecture/data-models.md`
- **ADR-001**: Technology Stack Selection
- **ADR-002**: Authentication Strategy (needs update for password-only)
- **ADR-003**: Media Storage Strategy (needs update for AliCloud OSS)
- **API Design**: `docs/api/API_DESIGN.md`
