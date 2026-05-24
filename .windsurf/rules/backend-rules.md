---
trigger: glob
globs: backend/**/*.py
description: Backend-specific rules (FastAPI/Python)
---

# Backend Rules

## Structure
- API endpoints go in `backend/app/api/v1/endpoints/`
- Business logic goes in `backend/app/services/` — never in endpoints
- SQLAlchemy models in `backend/app/models/`
- Pydantic schemas in `backend/app/schemas/` (separate from ORM models)
- Reusable dependencies in `backend/app/core/dependencies.py`

## FastAPI Conventions
- Use async endpoints for I/O-bound operations
- Return Pydantic response models; never return raw ORM objects
- Use `Depends()` for dependency injection (DB sessions, auth, etc.)
- Group routes with `APIRouter` per resource

## Database
- All schema changes require a new Alembic migration
- Use SQLAlchemy 2.0 style (`select()`, not legacy `Query`)
- Always use `async_session` for async endpoints
- Index foreign keys and frequently-queried columns
- Avoid N+1 queries — use `selectinload` / `joinedload`

## Error Handling
- Raise `HTTPException` with appropriate status codes from endpoints
- Define custom domain exceptions in `backend/app/core/exceptions.py`
- Never expose internal errors / stack traces to clients
- Log errors with context (user_id, request_id) but never log PII

## Validation
- All request bodies must be Pydantic models
- All path/query params must be typed
- Use `EmailStr`, `UUID`, `HttpUrl` etc. from Pydantic for built-in validation

## Quality Gates
Before declaring backend work complete:
1. `ruff check backend/` passes
2. `black backend/ --check` passes
3. `pytest backend/tests/` passes
4. Type hints on every function signature
