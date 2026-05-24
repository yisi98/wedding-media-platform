---
description: Write tests for existing code (TDD-style or backfill)
---

# Write Tests Workflow

## 1. Identify Target
- What module / function / component needs tests?
- Read the code and any existing tests for context.
- Read `docs/TESTING_STRATEGY.md` and `.windsurf/rules/testing-rules.md`.

## 2. Determine Test Type
- **Unit**: Pure logic, no I/O — fast, isolated
- **Integration**: Touches DB / external services with test doubles
- **E2E**: Full user flow via Playwright

## 3. Plan Cases
List the cases before writing code:
- Happy path
- At least one error / exception path
- Edge cases (empty, null, max size, unicode, timezone)
- Auth states (if relevant): unauthenticated, unauthorized, authorized
- Boundary conditions

## 4. Write Tests
**Backend (pytest):**
```python
# backend/tests/unit/test_<module>.py
def test_<function>_<condition>_<expected>():
    # Arrange
    # Act
    # Assert
```

**Frontend (Vitest + RTL):**
```ts
// frontend/src/components/__tests__/<Component>.test.tsx
describe('<Component>', () => {
  it('<does X when Y>', () => { ... });
});
```

## 5. Run & Iterate
```bash
# Backend
pytest backend/tests/path/to/test_file.py -v

# Frontend
npm test --prefix frontend -- <ComponentName>
```

## 6. Coverage Check
```bash
pytest --cov=app --cov-report=term-missing
npm run test:coverage --prefix frontend
```

Target: ≥ 80% for new code, ≥ 95% for critical paths.

## 7. Verify Quality
- [ ] Each test has Arrange / Act / Assert structure
- [ ] Test names describe behavior, not implementation
- [ ] No real network / file system / time dependencies
- [ ] Tests are deterministic (run 3x, same result)
- [ ] No `pytest.mark.skip` without linked issue
