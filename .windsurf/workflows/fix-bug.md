---
description: Debug and fix issues in the wedding media platform
---

# Bug Fix Workflow

## 1. Bug Identification
- Document bug in GitHub Issues or `docs/bugs/[bug-id].md`
- Include: steps to reproduce, expected vs actual behavior, environment
- Check if bug is already reported
- Assign priority (P0-Critical, P1-High, P2-Medium, P3-Low)

## 2. Root Cause Analysis
1. Reproduce the bug locally
2. Check application logs:
   - Backend: `backend/logs/`
   - Frontend: Browser console
3. Add debug logging if needed
4. Use debugger to step through code
5. Identify root cause (not just symptoms)
6. Document findings in bug report

## 3. Fix Strategy
- Determine if fix should be upstream (root cause) or downstream (symptom)
- Check if fix affects other parts of the system
- Plan minimal change that addresses root cause
- Consider if regression test is needed

## 4. Implementation
1. Create bug fix branch: `git checkout -b fix/[bug-id]-[short-description]`
2. Write failing test that reproduces the bug
3. Implement minimal fix
4. Verify test now passes
5. Run full test suite to check for regressions
6. Manual testing of the fix

## 5. Testing
// turbo
1. Run unit tests:
```bash
pytest backend/tests/ && npm test --prefix frontend
```

2. Run integration tests:
```bash
pytest backend/tests/integration/
```

3. Run E2E tests if UI-related:
```bash
npm run test:e2e --prefix frontend
```

4. Test edge cases and boundary conditions

## 6. Code Quality
// turbo
1. Check backend code quality:
```bash
ruff check backend/ && black backend/ --check
```

// turbo
2. Check frontend code quality:
```bash
npm run lint --prefix frontend && npm run type-check --prefix frontend
```

## 7. Documentation
- Update bug report with fix details
- Add comments explaining non-obvious fixes
- Update relevant documentation if behavior changed
- Add entry to CHANGELOG.md

## 8. Review & Deploy
1. Commit with format: `fix: [bug-id] - brief description`
2. Create pull request referencing bug report
3. Get code review
4. Merge after approval
5. Deploy to staging first
6. Verify fix in staging
7. Deploy to production
8. Monitor for 24-48 hours
9. Close bug report
