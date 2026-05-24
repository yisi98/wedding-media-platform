# Contributing to Wedding Media Platform

## Development Workflow

### 1. Setup
Follow the setup workflow: `/setup-environment`

### 2. Pick a Task
- Check GitHub Issues or project board
- Assign yourself to the task
- Review related documentation

### 3. Create a Branch
```bash
git checkout -b feature/[feature-name]
# or
git checkout -b fix/[bug-id]-[description]
```

### 4. Develop
- Follow coding standards in `docs/CODING_STANDARDS.md`
- Write tests first (TDD)
- Make small, focused commits
- Use conventional commit messages

### 5. Test
```bash
# Backend
pytest --cov=app

# Frontend
npm test
npm run test:e2e
```

### 6. Code Quality
```bash
# Backend
ruff check backend/
black backend/

# Frontend
npm run lint
npm run type-check
```

### 7. Commit
```bash
git add .
git commit -m "feat(scope): description"
```

### 8. Push & PR
```bash
git push origin feature/[feature-name]
```
Create a pull request on GitHub

### 9. Code Review
- Address review comments
- Update tests if needed
- Ensure CI passes

### 10. Merge
- Squash and merge to main
- Delete feature branch

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructuring
- test: Tests
- chore: Tooling

**Example:**
```
feat(auth): add Google OAuth login

Implement Google OAuth2 authentication flow.
Users can now sign in with Google accounts.

Closes #123
```

## Code Review Checklist

- [ ] Code follows standards
- [ ] Tests included and passing
- [ ] Documentation updated
- [ ] No security issues
- [ ] Performance considered
- [ ] Error handling appropriate

## Questions?

Ask in:
- GitHub Discussions
- Project chat
- Or create an issue
