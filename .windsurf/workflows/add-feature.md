---
description: Add a new feature to the wedding media platform
---

# Add New Feature Workflow

## 1. Planning Phase
- Review `docs/architecture/ARCHITECTURE.md` to understand system design
- Check `docs/adr/` for relevant architectural decisions
- Create feature specification in `docs/features/[feature-name].md`
- Define acceptance criteria and test cases

## 2. Design Phase
- Update data models if needed (document in `docs/architecture/data-models.md`)
- Design API endpoints (follow REST/GraphQL conventions in `docs/api/API_DESIGN.md`)
- Design UI components (follow design system in `docs/design-system.md`)
- Create ADR if making significant architectural decisions

## 3. Implementation Phase - Backend
1. Create feature branch: `git checkout -b feature/[feature-name]`
2. Write tests first (TDD approach):
   - Unit tests in `backend/tests/unit/`
   - Integration tests in `backend/tests/integration/`
3. Implement backend logic:
   - Models in `backend/app/models/`
   - Services in `backend/app/services/`
   - API endpoints in `backend/app/api/`
4. Run tests: `pytest backend/tests/`
5. Check code quality: `ruff check backend/ && black backend/`

## 4. Implementation Phase - Frontend
1. Write component tests in `frontend/src/components/__tests__/`
2. Implement UI components in `frontend/src/components/`
3. Implement pages/views in `frontend/src/pages/` or `frontend/src/app/`
4. Add API integration in `frontend/src/services/`
5. Run tests: `npm test`
6. Check code quality: `npm run lint && npm run type-check`

## 5. Integration Testing
1. Test feature end-to-end manually
2. Run E2E tests: `npm run test:e2e`
3. Test on different devices/browsers
4. Verify accessibility: `npm run test:a11y`

## 6. Documentation
- Update API documentation in `docs/api/`
- Update user documentation in `docs/user-guide/`
- Add inline code comments for complex logic
- Update CHANGELOG.md

## 7. Code Review & Merge
1. Commit changes with conventional commits format
2. Push branch: `git push origin feature/[feature-name]`
3. Create pull request with template
4. Address review comments
5. Merge to main after approval

## 8. Deployment
- Follow deployment workflow in `deploy.md`
- Monitor application logs
- Verify feature in production
