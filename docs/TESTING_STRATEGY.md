# Testing Strategy

## Testing Pyramid

```
        /\
       /  \
      / E2E \
     /--------\
    /          \
   / Integration \
  /--------------\
 /                \
/   Unit Tests     \
--------------------
```

## Test Coverage Goals
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: Critical paths covered
- **E2E Tests**: User journeys covered

## Backend Testing (Python)

### Unit Tests
- Test individual functions and methods
- Mock external dependencies
- Fast execution (< 1 second per test)

### Integration Tests
- Test API endpoints
- Use test database
- Test database operations

### Tools
- pytest
- pytest-asyncio
- pytest-cov
- factory-boy (test fixtures)

## Frontend Testing (TypeScript)

### Unit Tests
- Test components in isolation
- Test utility functions
- Test custom hooks

### Integration Tests
- Test component interactions
- Test API integration

### E2E Tests
- Test complete user flows
- Use Playwright

### Tools
- Vitest
- React Testing Library
- Playwright
- MSW (API mocking)

## Running Tests

### Backend
```bash
# All tests
pytest

# With coverage
pytest --cov=app --cov-report=html

# Specific test file
pytest tests/test_auth.py

# Watch mode
pytest-watch
```

### Frontend
```bash
# All tests
npm test

# With coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# Watch mode
npm test -- --watch
```
