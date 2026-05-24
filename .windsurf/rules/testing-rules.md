---
trigger: glob
globs: ["**/tests/**", "**/__tests__/**", "**/*.test.{ts,tsx,py}", "**/*.spec.{ts,tsx,py}"]
description: Testing rules
---

# Testing Rules

## Coverage Requirements
- New code: ≥ 80% line coverage
- Critical paths (auth, payments, media upload): ≥ 95%
- Never decrease overall coverage in a PR

## Test Structure (AAA)
- **Arrange**: Set up data and dependencies
- **Act**: Execute the unit under test
- **Assert**: Verify outcomes

## Naming
- Test files: `test_<module>.py` (Python) or `<Component>.test.tsx` (Frontend)
- Test functions: `test_<what>_<condition>_<expected>`
  - Example: `test_create_user_with_duplicate_email_raises_error`
- Test cases describe behavior, not implementation

## What to Test
- Public API of each module
- Happy path + at least one error case per function
- Edge cases: empty, null, max size, unicode, timezone
- Auth: unauthenticated, unauthorized, authorized
- Permissions for every protected endpoint

## What NOT to Test
- Framework internals (FastAPI, React)
- Third-party libraries
- Trivial getters/setters
- Implementation details (test behavior, not internals)

## Mocking
- Mock external services (S3, email, payment APIs)
- Use `pytest` fixtures for shared setup
- Use MSW for frontend API mocking
- Don't mock the unit under test

## Test Data
- Use factories (`factory-boy`) — never hardcoded objects with many fields
- Each test should be independent (no shared mutable state)
- Use transactional rollback or fresh DB per test

## Forbidden in Tests
- `time.sleep()` for timing — use proper async waits or mocks
- Real network calls
- Real file system writes outside `tmp_path`
- `pytest.mark.skip` without a linked issue
- Catching all exceptions (`except:` or `except Exception:`)
