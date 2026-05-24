---
trigger: glob
globs: frontend/**/*.{ts,tsx,js,jsx}
description: Frontend-specific rules (Next.js/React/TypeScript)
---

# Frontend Rules

## Structure
- Pages/routes in `frontend/src/app/` (Next.js App Router)
- Reusable UI primitives in `frontend/src/components/ui/`
- Feature components in `frontend/src/components/features/`
- Layout components in `frontend/src/components/layout/`
- API client + hooks in `frontend/src/lib/api/`
- Shared hooks in `frontend/src/lib/hooks/`
- Types in `frontend/src/types/`

## React Conventions
- Functional components only — no class components
- Use TypeScript strict mode; no `any` without justification comment
- Server Components by default; mark client components with `'use client'`
- Co-locate component tests in `__tests__/` next to the component

## State Management
- Local state: `useState` / `useReducer`
- Server state: React Query (TanStack Query)
- Global client state: Zustand (only when truly needed)
- Never put server data in Zustand — that's React Query's job

## Styling
- TailwindCSS utility classes only
- Use `shadcn/ui` components from `frontend/src/components/ui/`
- No inline styles except for dynamic values
- Follow design tokens (no arbitrary colors/spacing)

## Forms
- React Hook Form + Zod for all forms
- Zod schemas should match backend Pydantic schemas
- Display field-level errors inline

## Data Fetching
- Use React Query hooks from `lib/api/`
- Never call `fetch` directly in components
- Handle loading, error, and empty states explicitly
- Use Suspense boundaries for Server Components

## Accessibility (Required)
- All interactive elements must be keyboard accessible
- All images must have `alt` text
- Use semantic HTML (`<button>`, not `<div onClick>`)
- Color contrast must meet WCAG AA
- Run `npm run test:a11y` before declaring complete

## Quality Gates
Before declaring frontend work complete:
1. `npm run lint` passes
2. `npm run type-check` passes
3. `npm test` passes
4. No console errors in browser
