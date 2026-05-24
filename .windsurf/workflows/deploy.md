---
description: Deploy the wedding media platform to production
---

# Deployment Workflow

## Pre-Deployment Checklist
- [ ] All tests passing (unit, integration, E2E)
- [ ] Code review completed and approved
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Database migrations reviewed
- [ ] Environment variables configured
- [ ] Security scan completed
- [ ] Performance testing done

## Staging Deployment

// turbo
1. Build backend for staging:
```bash
cd backend && docker build -t wedding-platform-backend:staging .
```

// turbo
2. Build frontend for staging:
```bash
cd frontend && npm run build:staging
```

3. Deploy to staging environment:
   - Push Docker images to registry
   - Update Kubernetes/Docker Compose configs
   - Apply database migrations
   - Deploy services

// turbo
4. Run smoke tests on staging:
```bash
npm run test:smoke -- --env=staging
```

5. Manual QA on staging:
   - Test critical user flows
   - Verify new features
   - Check performance metrics
   - Test on multiple devices

## Production Deployment

1. Create release tag:
```bash
git tag -a v[version] -m "Release version [version]"
git push origin v[version]
```

// turbo
2. Build production images:
```bash
docker build -t wedding-platform-backend:v[version] backend/
docker build -t wedding-platform-frontend:v[version] frontend/
```

3. Push to production registry:
```bash
docker push wedding-platform-backend:v[version]
docker push wedding-platform-frontend:v[version]
```

4. Backup production database:
```bash
# Run database backup script
./scripts/backup-db.sh production
```

5. Deploy with zero-downtime:
   - Use blue-green or rolling deployment
   - Apply database migrations (if any)
   - Update service configurations
   - Deploy backend first, then frontend

6. Post-deployment verification:
   - Check health endpoints
   - Monitor error rates
   - Verify critical features
   - Check performance metrics

## Rollback Procedure (if needed)

1. Identify issue quickly
2. Rollback to previous version:
```bash
kubectl rollout undo deployment/wedding-platform-backend
kubectl rollout undo deployment/wedding-platform-frontend
```

3. Restore database if needed:
```bash
./scripts/restore-db.sh [backup-timestamp]
```

4. Verify rollback successful
5. Document incident and create postmortem

## Post-Deployment

1. Monitor for 24 hours:
   - Application logs
   - Error tracking (Sentry/similar)
   - Performance metrics (response times, throughput)
   - User feedback

2. Update deployment log in `docs/deployments/`

3. Notify team of successful deployment

4. Close deployment ticket
