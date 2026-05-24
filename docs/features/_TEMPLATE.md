# Feature: [Feature Name]

> **Status**: Draft | Approved | In Progress | Shipped | Deprecated
> **Owner**: [name]
> **Created**: YYYY-MM-DD
> **Target Release**: vX.Y.Z

## 1. Problem Statement
What problem are we solving? Who has this problem? Why now?

## 2. Goals & Non-Goals
**Goals:**
- [Specific, measurable outcome]

**Non-Goals (out of scope):**
- [What this feature will NOT do]

## 3. User Stories
- As a **[role]**, I want to **[action]** so that **[benefit]**.
- As a **[role]**, I want to **[action]** so that **[benefit]**.

## 4. Acceptance Criteria
Specific, testable criteria for "done":
- [ ] Criterion 1 (e.g., "Guest can upload up to 50MB photo via drag-and-drop")
- [ ] Criterion 2
- [ ] Criterion 3

## 5. UX / UI Design
- Link to mockups / Figma
- Key screens / interactions
- Empty / loading / error states
- Accessibility requirements

## 6. Technical Design

### 6.1 Data Model Changes
```
# New tables / columns / indexes
```
Link to migration: `backend/alembic/versions/XXX_feature_name.py`

### 6.2 API Contract
```
POST /api/v1/[resource]
Request: { ... }
Response 200: { ... }
Errors: 400, 401, 403, 404, 422, 500
```

### 6.3 Frontend Changes
- New routes / pages
- New components
- State management changes

### 6.4 Architecture Impact
- New services / dependencies
- Cache / queue / storage changes
- Link to relevant ADR(s)

## 7. Test Plan
**Unit tests:**
- [Service / function]

**Integration tests:**
- [API endpoint]

**E2E tests:**
- [User flow]

**Manual QA:**
- [Browser / device matrix]

## 8. Security & Privacy
- AuthN / AuthZ requirements
- PII handled
- Rate limits
- Input validation rules

## 9. Performance & Scale
- Expected load (requests/sec, data size)
- Latency budget (p50, p95, p99)
- Caching strategy
- Async/background work

## 10. Observability
- Metrics to add
- Logs to emit (no PII)
- Alerts to configure

## 11. Rollout Plan
- [ ] Feature flag name: `feature_xxx`
- [ ] Migration deployed
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Enable for internal users
- [ ] Gradual rollout (10% → 50% → 100%)
- [ ] Monitor for 48h

## 12. Rollback Plan
How to disable / revert if something goes wrong.

## 13. Open Questions
- [ ] Question 1 — owner, due date
- [ ] Question 2

## 14. References
- Related ADRs:
- Related issues / PRs:
- External docs:
