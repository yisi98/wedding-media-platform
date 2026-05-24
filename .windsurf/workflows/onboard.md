---
description: Onboard an AI agent (or human) to this project by reading all key docs in order
---

# Onboarding Workflow

Use this at the start of any new session to load full project context.

## 1. Entry Point
Read `AGENTS.md` for the orientation overview.

## 2. Workflow Overview
Read `docs/GETTING_STARTED.md`.

## 3. Architecture
Read in order:
1. `docs/architecture/ARCHITECTURE.md`
2. `docs/architecture/data-models.md`

## 4. Decisions
Read every ADR in `docs/adr/` (currently 001-003).

## 5. Standards
Read:
1. `docs/CODING_STANDARDS.md`
2. `docs/TESTING_STRATEGY.md`
3. `docs/api/API_DESIGN.md`

## 6. Current State
Read `progress.md` to understand what's done, in progress, and pending.

## 7. Active Feature (if any)
If `progress.md` references an active feature, read its spec in `docs/features/<name>.md`.

## 8. Rules (auto-loaded)
Project rules in `.windsurf/rules/` are loaded automatically by Cascade. Skim them once:
- `project-rules.md`
- `backend-rules.md`
- `frontend-rules.md`
- `testing-rules.md`

## 9. Confirm Understanding
After reading, summarize back to the user:
1. Project purpose & current phase
2. Active task / focus
3. Key constraints (tech stack, security, conventions)
4. Any open questions from `progress.md`

## 10. Ready to Work
Pick a task from `progress.md` or wait for user direction.
