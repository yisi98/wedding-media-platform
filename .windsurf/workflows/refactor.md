---
description: Safely refactor code without changing behavior
---

# Refactor Workflow

**Golden rule**: Refactoring must not change observable behavior. If behavior changes, it's a feature or bug fix, not a refactor.

## 1. Establish Safety Net
Before changing anything:
- [ ] Find existing tests covering the target code
- [ ] If coverage is < 80% in the target area, **write tests first** (use `/write-tests`)
- [ ] Run the test suite and confirm green baseline

## 2. Define Scope
- What is being refactored? (module / function / class)
- What is the goal? (readability, performance, removing duplication, decoupling)
- What is explicitly out of scope?

## 3. Plan Small Steps
Break the refactor into the smallest safe steps. Each step should:
- Compile / type-check
- Pass all tests
- Be commitable on its own

## 4. Common Refactoring Patterns
- Extract function / method
- Inline variable / function
- Rename for clarity
- Move function to appropriate module
- Replace conditional with polymorphism / strategy
- Introduce parameter object
- Replace magic number with named constant

## 5. Execute
For each step:
1. Make the change
2. Run tests: `pytest backend/tests/` or `npm test --prefix frontend`
3. Run linters: `ruff check`, `black --check`, `eslint`
4. Run type-check
5. Commit with `refactor:` prefix

## 6. Verify No Behavior Change
- [ ] All existing tests still pass without modification
- [ ] No new test failures
- [ ] Public API unchanged (or changes documented)
- [ ] Performance not regressed (if relevant — measure)

## 7. Forbidden During Refactor
- Adding new features
- Fixing unrelated bugs (open separate PR)
- Changing public API without prior agreement
- Modifying tests to fit new behavior

## 8. Document
- If the refactor changes architecture meaningfully, create an ADR
- Update relevant docs if module structure changed
- Update `progress.md` if it was a planned task
