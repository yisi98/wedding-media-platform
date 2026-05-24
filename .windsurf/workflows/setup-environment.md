---
description: Setup development environment for the wedding media platform
---

# Setup Development Environment

## Prerequisites Check
1. Verify Python 3.11+ is installed: `python --version`
2. Verify Node.js 18+ is installed: `node --version`
3. Verify Git is configured: `git config --list`

## Backend Setup (Python/Django or FastAPI)
// turbo
1. Create Python virtual environment:
```bash
python -m venv .venv
```

2. Activate virtual environment:
   - Windows: `.venv\Scripts\activate`
   - Unix/MacOS: `source .venv/bin/activate`

// turbo
3. Install backend dependencies:
```bash
pip install -r backend/requirements.txt
```

// turbo
4. Setup environment variables:
```bash
cp backend/.env.example backend/.env
```

5. Run database migrations:
```bash
cd backend && python manage.py migrate
```

## Frontend Setup (React/Next.js)
// turbo
1. Install frontend dependencies:
```bash
cd frontend && npm install
```

// turbo
2. Setup frontend environment:
```bash
cp frontend/.env.example frontend/.env.local
```

## Verification
// turbo
1. Run backend tests:
```bash
cd backend && pytest
```

// turbo
2. Run frontend tests:
```bash
cd frontend && npm test
```

3. Start development servers (separate terminals):
   - Backend: `cd backend && python manage.py runserver`
   - Frontend: `cd frontend && npm run dev`

## Post-Setup
1. Access frontend at http://localhost:3000
2. Access backend API at http://localhost:8000
3. Access API docs at http://localhost:8000/docs
