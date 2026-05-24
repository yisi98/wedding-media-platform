---
description: Document a significant architectural decision as an ADR
---

# Create ADR Workflow

## When to Create an ADR
Create one whenever you make a decision that:
- Affects more than one module
- Locks in a technology, pattern, or trade-off
- Is hard or costly to reverse later
- Future contributors will ask "why did we do it this way?"

If a decision is small or easily reversible, log it in `progress.md` instead.

## 1. Number the ADR
- Look at `docs/adr/` for the next sequential number
- Format: `XXX-short-kebab-title.md` (e.g., `004-rate-limiting-strategy.md`)

## 2. Use the Standard Template
Create `docs/adr/XXX-<title>.md` with this structure:

```markdown
# ADR XXX: [Title]

## Status
Proposed

## Context
What forces are at play? What problem are we solving? Link relevant feature specs / issues.

## Decision
The choice we are making, stated clearly and concisely.

## Rationale
Why this option over the alternatives?

## Alternatives Considered
- **Option A**: Description. Rejected because [reason].
- **Option B**: Description. Rejected because [reason].

## Consequences
**Positive:**
- ...

**Negative:**
- ...

**Neutral:**
- ...

## Risks & Mitigations
- **Risk**: ...
  - **Mitigation**: ...

## Implementation Notes
Concrete steps / links to PRs.

## Date
YYYY-MM-DD

## Participants
- [name]
```

## 3. Review
- Share the draft with stakeholders
- Update Status to `Accepted` once agreed
- Link from `docs/adr/README.md` index

## 4. Cross-Reference
- If this ADR supersedes another, mark the old one `Superseded by ADR-XXX`
- Link the ADR from related code (in docstrings) and feature specs

## 5. Update progress.md
Add the decision to the "Recent Decisions" table in `progress.md`.
