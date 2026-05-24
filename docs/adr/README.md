# Architecture Decision Records (ADRs)

## What are ADRs?

Architecture Decision Records document significant architectural decisions made during the project. They help:
- Understand why decisions were made
- Onboard new team members
- Avoid revisiting settled decisions
- Track architectural evolution

## ADR Format

Each ADR follows this structure:

```markdown
# ADR XXX: [Title]

## Status
[Proposed | Accepted | Deprecated | Superseded]

## Context
What is the issue we're facing?

## Decision
What decision did we make?

## Rationale
Why did we make this decision?

## Alternatives Considered
What other options did we consider and why were they rejected?

## Consequences
What are the positive, negative, and neutral consequences?

## Date
When was this decision made?

## Participants
Who was involved in the decision?
```

## Current ADRs

- [ADR-001: Technology Stack Selection](001-technology-stack.md)
- [ADR-002: Authentication Strategy](002-authentication-strategy.md) *(Revised 2026-05-24)*
- [ADR-003: Media Storage and Processing Strategy](003-media-storage-strategy.md) *(Revised 2026-05-24)*
- [ADR-004: Internationalization (i18n) Strategy](004-internationalization-strategy.md)
- [ADR-005: Duplicate Detection Strategy](005-duplicate-detection-strategy.md)

## Creating a New ADR

1. Copy the template above
2. Number it sequentially (e.g., 004)
3. Use a descriptive title
4. Fill in all sections
5. Get review from team/AI agent
6. Mark as "Accepted" when finalized
