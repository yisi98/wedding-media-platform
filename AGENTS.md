# AGENTS.md

This file is the entry point for AI coding agents (Cascade, Claude Code, Cursor, Aider, etc.) working on this repository. It is intentionally concise. Detailed rules live in linked documents.

## Project: Wedding Media Platform
A production-grade web app for sharing photos/videos from wedding attendees. Built using the agentic coding approach.

## Required Reading Order (for any new task)
1. **This file** (`AGENTS.md`) — orientation
2. **`docs/GETTING_STARTED.md`** — agentic workflow overview
3. **`docs/architecture/ARCHITECTURE.md`** — system design
4. **Relevant ADRs** in `docs/adr/` — design decisions
5. **`docs/CODING_STANDARDS.md`** — style and conventions
6. **`progress.md`** — current state and pending work

## Tech Stack (locked — see ADR-001)
- **Backend**: FastAPI, Python 3.11+, SQLAlchemy 2.0, PostgreSQL 15+, Redis 7+
- **Frontend**: Next.js 14+, TypeScript, TailwindCSS, shadcn/ui, React Query
- **Storage**: S3-compatible (AWS S3 / MinIO)
- **Testing**: pytest, Vitest, Playwright

## Repository Layout
```
backend/   # FastAPI app (app/, tests/, alembic/)
frontend/  # Next.js app (src/app, src/components, src/lib)
docs/      # ADRs, architecture, features, API design
.windsurf/ # Agent workflows + rules
.github/   # CI, PR/issue templates
```

## Workflows (use these via `/<name>`)
- `/setup-environment` — first-time setup
- `/onboard` — read all docs to gain project context
- `/add-feature` — implement a new feature end-to-end
- `/fix-bug` — root-cause and fix bugs
- `/write-tests` — generate tests for existing code
- `/create-adr` — document a significant decision
- `/refactor` — safe refactoring
- `/deploy` — production deployment

## Core Rules (enforced)
Detailed rules are loaded automatically from `.windsurf/rules/`:
- `project-rules.md` — always-on project rules
- `backend-rules.md` — applies to `backend/**/*.py`
- `frontend-rules.md` — applies to `frontend/**/*.{ts,tsx}`
- `testing-rules.md` — applies to test files

## Definition of Done
A task is **only complete** when ALL apply:
- [ ] Code follows standards in `docs/CODING_STANDARDS.md`
- [ ] Tests written and passing (`pytest` / `npm test`)
- [ ] Lint + format pass (`ruff`, `black`, `eslint`, `prettier`)
- [ ] Type-check passes (`mypy` if configured, `tsc --noEmit`)
- [ ] Relevant docs updated (API docs, ADR, feature spec, `progress.md`)
- [ ] No new secrets / credentials committed
- [ ] Commit message follows Conventional Commits

## Long-Horizon Coordination
- **`progress.md`** tracks state across sessions — update it when you finish or pause a task
- **`docs/features/`** contains per-feature specs — create one before implementing non-trivial features
- **`docs/adr/`** captures decisions — add a new ADR for any architectural change

## Useful Commands
```bash
# Backend
pytest backend/tests/                      # run tests
ruff check backend/ && black backend/      # lint + format
alembic revision --autogenerate -m "..."   # new migration
alembic upgrade head                       # apply migrations

# Frontend
npm test --prefix frontend                 # run tests
npm run lint --prefix frontend             # lint
npm run type-check --prefix frontend       # type-check
npm run dev --prefix frontend              # dev server
```

## When You're Unsure
1. Re-read the relevant ADR
2. Check `docs/features/` for the feature spec
3. Search the codebase for similar patterns
4. Ask the user one specific question — do not guess silently
