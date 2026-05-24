---
trigger: always_on
description: Core project rules for the Wedding Media Platform
---

# Project Rules (Always Apply)

## Documentation Authority
- `docs/architecture/ARCHITECTURE.md` is the source of truth for system design
- `docs/architecture/data-models.md` is authoritative for database schema
- ADRs in `docs/adr/` override generic best practices when applicable
- If documentation conflicts with code, raise the discrepancy before changing either

## Before You Code
1. Read the relevant ADR and architecture sections
2. Check if a feature spec exists in `docs/features/`; if not, create one for non-trivial work
3. Confirm the task is captured in `progress.md` for multi-session work
4. State the plan before making non-trivial changes

## Code Changes
- Make minimal, focused edits — prefer single-line fixes when sufficient
- Never modify existing Alembic migrations; always create a new one
- Never weaken or delete tests without explicit user direction
- Never commit secrets, API keys, or `.env` files
- Always use absolute imports in backend (`from app.models import X`, not relative)
- Always use type hints in Python and TypeScript

## Testing Discipline
- Write or update tests **before** implementation for new features (TDD)
- Run the relevant test suite after every code change
- Backend test command: `pytest backend/tests/`
- Frontend test command: `npm test --prefix frontend`
- Never skip tests with `@pytest.mark.skip` or `.skip()` without a linked issue

## Security Rules
- Validate all user input via Pydantic (backend) or Zod (frontend)
- Never trust client-provided file types; verify server-side
- Never log passwords, tokens, or PII
- Use parameterized queries only (SQLAlchemy ORM enforces this)
- Presigned URLs must expire in ≤ 1 hour

## Communication
- After completing a task, summarize: what changed, what was tested, what's pending
- If blocked, ask one specific question rather than guessing
- Flag any deviation from ADRs or architecture explicitly

## Forbidden Actions
- Do not introduce new dependencies without justifying in the response
- Do not change the tech stack defined in ADR-001 without a new ADR
- Do not create files outside the documented project structure
- Do not run destructive commands (`rm -rf`, `DROP TABLE`, force-push) without explicit approval
