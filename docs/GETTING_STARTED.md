# Getting Started with Agentic Coding

## What is Agentic Coding?

Agentic coding is an approach where you work with AI agents (like Cascade) to build software by:
1. Defining clear specifications in markdown files
2. Following structured workflows
3. Making architectural decisions explicit (ADRs)
4. Maintaining high code quality standards

## How to Use This Setup

### 1. Review Documentation First
Before starting any work, review:
- `docs/architecture/ARCHITECTURE.md` - System design
- `docs/adr/` - Architectural decisions
- `docs/CODING_STANDARDS.md` - Code quality guidelines

### 2. Use Workflows
Workflows are in `.windsurf/workflows/`. Use them by:
- Typing `/` in Cascade to see available workflows
- Following step-by-step instructions
- Letting Cascade auto-run safe commands (marked with `// turbo`)

### 3. Document Decisions
When making significant decisions:
1. Create an ADR in `docs/adr/XXX-decision-name.md`
2. Follow the ADR template
3. Update architecture docs if needed

### 4. Define Features
Before implementing features:
1. Create `docs/features/[feature-name].md`
2. Define requirements and acceptance criteria
3. Design API and data models
4. Then implement

### 5. Maintain Quality
- Write tests first (TDD)
- Follow coding standards
- Run linters and formatters
- Get code reviews

## Quick Start Commands

### Setup Environment
```bash
# Use the setup workflow
/setup-environment
```

### Add a Feature
```bash
# Use the feature workflow
/add-feature
```

### Fix a Bug
```bash
# Use the bug fix workflow
/fix-bug
```

### Deploy
```bash
# Use the deployment workflow
/deploy
```

## Working with Cascade

### Best Practices
1. **Be specific**: "Add user authentication with JWT" vs "Add auth"
2. **Reference docs**: "Follow the auth strategy in ADR-002"
3. **Use workflows**: "/add-feature for photo upload"
4. **Review changes**: Always review generated code
5. **Update docs**: Keep documentation in sync

### Example Requests
- "Create the User model following the data model spec in docs/architecture/data-models.md"
- "Implement the /auth/login endpoint according to ADR-002"
- "Add tests for the media upload service"
- "Update the API documentation for the new event endpoints"

## Project Phases

### Phase 1: Foundation (Current)
- [ ] Setup project structure
- [ ] Create documentation framework
- [ ] Define workflows
- [ ] Setup development environment

### Phase 2: Core Backend
- [ ] Database models
- [ ] Authentication system
- [ ] Event management API
- [ ] Media upload API

### Phase 3: Core Frontend
- [ ] Authentication UI
- [ ] Event creation/joining
- [ ] Media upload interface
- [ ] Gallery view

### Phase 4: Advanced Features
- [ ] Real-time updates
- [ ] Video processing
- [ ] Social features
- [ ] Mobile optimization

### Phase 5: Production
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Deployment setup
- [ ] Monitoring and logging

## Next Steps

1. Review all documentation in `docs/`
2. Run `/setup-environment` workflow
3. Start with Phase 2: Core Backend
4. Follow the `/add-feature` workflow for each feature
