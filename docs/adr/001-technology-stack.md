# ADR 001: Technology Stack Selection

## Status
Accepted

## Context
We need to select a technology stack for the Wedding Media Platform that balances:
- Developer productivity and experience
- Performance and scalability
- Production-readiness and stability
- Community support and ecosystem
- Deployment flexibility

## Decision

### Frontend: Next.js 14+ with TypeScript
**Rationale:**
- Server-side rendering (SSR) for better SEO and initial load performance
- Built-in image optimization crucial for media-heavy application
- TypeScript for type safety and better developer experience
- Large ecosystem and community support
- Easy deployment to Vercel or self-hosted

**Alternatives Considered:**
- Create React App: Less features, no SSR
- Vue.js/Nuxt: Smaller ecosystem
- SvelteKit: Less mature, smaller community

### Backend: FastAPI with Python 3.11+
**Rationale:**
- Async support for handling concurrent uploads
- Automatic OpenAPI documentation
- Excellent performance (comparable to Node.js)
- Type hints with Pydantic for validation
- Rich ecosystem for image/video processing (Pillow, FFmpeg)
- Easy integration with ML libraries for future AI features

**Alternatives Considered:**
- Django: More opinionated, slower for async operations
- Node.js/Express: Less suitable for media processing
- Go: Steeper learning curve, less libraries for media processing

### Database: PostgreSQL 15+
**Rationale:**
- ACID compliance for data integrity
- Excellent JSON support for flexible metadata
- Full-text search capabilities
- Proven scalability and reliability
- Rich extension ecosystem (PostGIS for location data)

**Alternatives Considered:**
- MySQL: Less advanced JSON and full-text search
- MongoDB: Less suitable for relational data
- SQLite: Not suitable for production scale

### Object Storage: S3-compatible (AWS S3 or MinIO)
**Rationale:**
- Scalable and cost-effective for large media files
- Industry standard with wide tooling support
- MinIO allows self-hosted option
- Built-in CDN integration

### Cache: Redis 7+
**Rationale:**
- Fast in-memory caching
- Session storage
- Rate limiting
- Real-time features (pub/sub)

### Styling: TailwindCSS + shadcn/ui
**Rationale:**
- Utility-first approach for rapid development
- Small bundle size with purging
- shadcn/ui provides accessible, customizable components
- Modern, professional UI out of the box

## Consequences

### Positive
- Modern, performant stack
- Excellent developer experience
- Strong typing throughout (TypeScript + Pydantic)
- Easy to find developers familiar with these technologies
- Good documentation and community support

### Negative
- Learning curve for developers unfamiliar with FastAPI
- Need to manage two separate codebases (frontend/backend)
- Requires understanding of async Python

### Neutral
- Standard deployment complexity for modern web apps
- Need proper CI/CD setup for both frontend and backend

## Implementation Notes
- Use monorepo structure with separate `frontend/` and `backend/` directories
- Share TypeScript types between frontend and backend using OpenAPI code generation
- Use Docker Compose for local development
- Use GitHub Actions for CI/CD

## Date
2026-05-24

## Participants
- AI Agent (Cascade)
- Project Owner
