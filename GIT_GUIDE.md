# Git Guide - What to Commit

## ✅ Files to ADD (Commit to Git)

### Root Level
```bash
git add .github/                    # CI/CD workflows, PR/issue templates
git add .gitignore                  # Git ignore rules
git add .pre-commit-config.yaml     # Pre-commit hooks config
git add .python-version             # Python version for uv
git add .windsurf/                  # Agent workflows and rules
git add AGENTS.md                   # Agent entry point
git add CONTRIBUTING.md             # Contribution guidelines
git add LICENSE                     # License file
git add README.md                   # Main README
git add README_SETUP.md             # Setup guide
git add docker-compose.yml          # Docker services config
git add progress.md                 # Project progress tracker
```

### Documentation
```bash
git add docs/                       # All documentation
# Includes:
# - docs/GETTING_STARTED.md
# - docs/CODING_STANDARDS.md
# - docs/TESTING_STRATEGY.md
# - docs/PROJECT_STRUCTURE.md
# - docs/PRODUCT_SPEC.md
# - docs/architecture/
# - docs/adr/
# - docs/features/
# - docs/api/
```

### Backend
```bash
git add backend/.env.example       # Example environment file (NO SECRETS)
git add backend/.gitignore         # Backend-specific ignores
git add backend/pyproject.toml     # Python dependencies and config
git add backend/requirements.txt   # (Keep for compatibility, but uv uses pyproject.toml)
git add backend/requirements-dev.txt
```

### Frontend
```bash
git add frontend/.env.example      # Example environment file (NO SECRETS)
git add frontend/package.json      # Node dependencies
```

---

## ❌ Files to IGNORE (Already in .gitignore)

### Never Commit These:
- ❌ `.env` - Contains secrets and API keys
- ❌ `.env.local` - Local environment overrides
- ❌ `.venv/` - Python virtual environment
- ❌ `node_modules/` - Node dependencies (huge)
- ❌ `uv.lock` - Lock file (auto-generated)
- ❌ `.idea/` - IDE settings (personal)
- ❌ `__pycache__/` - Python bytecode
- ❌ `.next/` - Next.js build output
- ❌ `*.log` - Log files
- ❌ `.coverage` - Test coverage data
- ❌ `*.db`, `*.sqlite` - Local databases

---

## 🚀 Quick Commands

### Add Everything (Recommended for Initial Commit)
```bash
# Add all new files (respects .gitignore)
git add .

# Check what will be committed
git status

# Commit with conventional commit message
git commit -m "chore: setup project foundation and development environment

- Add agentic coding structure (ADRs, workflows, rules)
- Add Docker Compose for local development (PostgreSQL, Redis, MinIO)
- Add backend setup with uv and Python 3.12
- Add frontend setup with Next.js 14 and TypeScript
- Add comprehensive documentation and setup guides
- Configure CI/CD workflows and pre-commit hooks
- Set hard deadline: September 15, 2026
- Event password: YisiNata2026 for October 10, 2026 wedding"
```

### Add Selectively (If You Want Control)
```bash
# Add root config files
git add .gitignore .python-version .pre-commit-config.yaml
git add docker-compose.yml

# Add documentation
git add AGENTS.md CONTRIBUTING.md README.md README_SETUP.md progress.md
git add docs/

# Add workflows and rules
git add .windsurf/ .github/

# Add backend
git add backend/.env.example backend/.gitignore backend/pyproject.toml
git add backend/requirements.txt backend/requirements-dev.txt

# Add frontend
git add frontend/.env.example frontend/package.json

# Commit
git commit -m "chore: setup project foundation"
```

---

## 🔍 Verify Before Committing

### Check what will be committed:
```bash
git status
```

### Check what's ignored:
```bash
git status --ignored
```

### See diff of changes:
```bash
git diff
```

### See what files are staged:
```bash
git diff --cached
```

---

## ⚠️ Important Notes

### NEVER commit:
1. **Secrets**: API keys, passwords, tokens
2. **Environment files**: `.env`, `.env.local` (only commit `.env.example`)
3. **Dependencies**: `node_modules/`, `.venv/`, `uv.lock`
4. **Build artifacts**: `.next/`, `dist/`, `build/`
5. **IDE settings**: `.idea/`, `.vscode/` (personal preferences)
6. **Logs**: `*.log`, `logs/`
7. **Databases**: `*.db`, `*.sqlite`

### DO commit:
1. **Source code**: All `.py`, `.ts`, `.tsx` files
2. **Configuration**: `pyproject.toml`, `package.json`, `docker-compose.yml`
3. **Documentation**: All `.md` files
4. **Example files**: `.env.example` (without secrets)
5. **Workflows**: `.github/`, `.windsurf/`
6. **Tests**: All test files

---

## 📋 Recommended First Commit

```bash
# Add everything (respects .gitignore)
git add .

# Verify what's being added
git status

# Commit Phase 1 completion
git commit -m "chore: complete Phase 1 - foundation and documentation

Phase 1 Complete (September 15, 2026 deadline):
- ✅ Agentic coding structure (ADRs, workflows, rules)
- ✅ Product specification (single wedding event, 150 users)
- ✅ Development environment (Docker, uv, Python 3.12)
- ✅ Multi-language support (EN/ZH/RU)
- ✅ Authentication strategy (password-based)
- ✅ Media storage strategy (AliCloud OSS)
- ✅ Duplicate detection (SHA-256)
- ✅ Gallery strategy (infinite scroll + lightbox)
- ✅ CI/CD workflows and pre-commit hooks

Event Details:
- Wedding: October 10, 2026
- Event Password: YisiNata2026
- Hard Deadline: September 15, 2026

Next: Phase 2 - Core Features Development"

# Push to remote
git push origin main
```

---

## 🔄 Future Workflow

### For each feature:
```bash
# Create feature branch
git checkout -b feature/user-authentication

# Make changes, add files
git add backend/app/auth/
git add backend/tests/test_auth.py

# Commit with conventional commit
git commit -m "feat(auth): implement user registration with event password"

# Push and create PR
git push origin feature/user-authentication
```

### Conventional Commit Types:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style (formatting, no logic change)
- `refactor:` - Code refactoring
- `test:` - Adding/updating tests
- `chore:` - Build, dependencies, configs
- `perf:` - Performance improvements

---

## 📊 Current Status

**Untracked files ready to commit:**
- ✅ 19 files from Phase 1 setup
- ✅ All documentation (ADRs, guides, specs)
- ✅ All configuration (Docker, uv, CI/CD)
- ✅ All workflows and rules

**Files correctly ignored:**
- ✅ `.idea/` (IDE settings)
- ✅ No `.env` files (only `.env.example`)
- ✅ No virtual environments
- ✅ No build artifacts

**Ready to commit!** 🚀
