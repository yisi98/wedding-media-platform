# GitHub Actions Workflows

## Current Workflows

### CI Workflow (`ci.yml`)

Runs on every push and pull request to `main` and `develop` branches.

#### Jobs:

1. **Backend** (Python 3.12 + uv)
   - Lint with ruff
   - Format check with black
   - Type check with mypy
   - Run pytest with coverage
   - Upload coverage to Codecov

2. **Frontend** (Node.js 20)
   - Lint with ESLint
   - Type check with TypeScript
   - Run tests with Vitest
   - Build Next.js app

3. **Security**
   - Gitleaks (secret detection)
   - Trivy (vulnerability scanning)

#### Current Status (Phase 1)

⚠️ **Note**: Backend and frontend checks are currently set to `continue-on-error: true` because:
- Phase 1 (Foundation) is complete
- Phase 2 (Core Features) has not started yet
- No `backend/app/` or `frontend/src/` code exists yet

Once Phase 2 begins and code is added, these checks will be enforced (remove `continue-on-error`).

#### Security Checks

Security scans run on every commit and **will fail the build** if:
- Secrets are detected (gitleaks)
- High or critical vulnerabilities found (Trivy)

These checks are **always enforced** regardless of project phase.

---

## Adding New Workflows

To add a new workflow:

1. Create `.github/workflows/<name>.yml`
2. Follow existing patterns
3. Document in this README
4. Test on a feature branch first

---

## Workflow Best Practices

- Use `concurrency` to cancel outdated runs
- Cache dependencies (uv, npm) for faster builds
- Use `continue-on-error` sparingly (only during early development)
- Always run security checks without `continue-on-error`
- Upload test coverage to track progress

---

## Future Workflows (Planned)

- **Deploy to Staging** - Auto-deploy on merge to `develop`
- **Deploy to Production** - Manual approval for `main` branch
- **Dependency Updates** - Dependabot or Renovate
- **Performance Testing** - Load testing on staging
- **E2E Tests** - Playwright tests on deployed environments

---

**Last Updated**: 2026-05-24 (Phase 1 Complete)
