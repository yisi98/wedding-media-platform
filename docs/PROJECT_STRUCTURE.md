# Project Structure

## Root Directory
```
wedding-media-platform/
├── .windsurf/
│   └── workflows/          # Agentic coding workflows
├── backend/                # Python FastAPI backend
├── frontend/               # Next.js frontend
├── docs/                   # Project documentation
│   ├── architecture/       # Architecture docs
│   ├── adr/               # Architecture Decision Records
│   ├── api/               # API documentation
│   └── features/          # Feature specifications
├── scripts/               # Utility scripts
├── docker-compose.yml     # Local development setup
└── README.md
```

## Backend Structure
```
backend/
├── app/
│   ├── api/v1/endpoints/  # API route handlers
│   ├── core/              # Config, security, deps
│   ├── models/            # SQLAlchemy models
│   ├── schemas/           # Pydantic schemas
│   ├── services/          # Business logic
│   └── main.py
├── tests/
├── alembic/               # Database migrations
└── requirements.txt
```

## Frontend Structure
```
frontend/
├── src/
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utilities, hooks, API
│   ├── types/            # TypeScript types
│   └── styles/           # Global styles
├── public/               # Static assets
└── package.json
```

## Documentation Structure
```
docs/
├── architecture/
│   ├── ARCHITECTURE.md
│   └── data-models.md
├── adr/
│   ├── 001-technology-stack.md
│   ├── 002-authentication-strategy.md
│   └── 003-media-storage-strategy.md
├── api/
│   └── API_DESIGN.md
├── features/
│   └── [feature-name].md
├── CODING_STANDARDS.md
├── TESTING_STRATEGY.md
└── PROJECT_STRUCTURE.md
```
