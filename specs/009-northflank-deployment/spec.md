# Specification: Northflank Production Deployment

**Feature ID**: 009
**Feature Name**: Northflank Production Deployment Infrastructure
**Version**: 1.0.0
**Status**: IN PROGRESS
**Created**: October 21, 2025
**Approach**: Docker Containerization with Managed Services

---

## Overview

Establish production-ready deployment infrastructure for the JADE Spa Marketplace backend on Northflank's Platform-as-a-Service, ensuring secure, scalable, and maintainable operations while maintaining constitutional compliance and zero disruption to development workflows.

---

## Objectives

### Primary Goals

1. Deploy vendure-backend to Northflank production environment
2. Implement production-grade Docker containerization
3. Establish SSL/TLS encrypted database connections
4. Configure health monitoring and graceful shutdown
5. Document complete deployment process
6. Maintain development environment stability

### Success Metrics

- Backend deployment completes successfully
- Health check endpoints respond within 2 seconds
- Database connections establish with SSL/TLS
- Zero-downtime deployments achieved
- Graceful shutdown completes within 30 seconds
- Docker build time < 10 minutes
- 100% infrastructure-as-code documentation

---

## Technical Specification

### Architecture

#### Deployment Platform

```yaml
Platform: Northflank
Region: Auto (closest to data)
Environment: Production
Runtime: Docker Container
Orchestration: Kubernetes (managed by Northflank)
```

#### Infrastructure Components

```typescript
// Northflank Services
- Combined Service (Build + Deploy)
  - Build: Dockerfile-based
  - Deploy: Container orchestration
  - Port: 3000 (dynamic via env)

- PostgreSQL Addon (Managed Database)
  - Version: 16
  - SSL/TLS: Required
  - Connection Pooling: Enabled

- Redis Addon (Optional - Future)
  - Version: 7
  - For: Job queues, caching
```

### Containerization Specification

#### Multi-Stage Dockerfile

**Location**: `/apps/vendure-backend/Dockerfile`

**Stage 1: Builder**
```dockerfile
FROM node:20-alpine AS builder
- Install build dependencies (python3, make, g++)
- Enable pnpm via corepack
- Copy workspace configuration
- Install all dependencies (frozen lockfile)
- Build shared packages first
- Build vendure-backend
```

**Stage 2: Runtime**
```dockerfile
FROM node:20-alpine AS runner
- Install runtime dependencies (curl, tini)
- Enable pnpm
- Create non-root user (nodejs:1001)
- Copy built artifacts from builder
- Copy static assets and templates
- Configure health check
- Use tini for signal handling
- Start application as non-root user
```

**Security Features**:
- Non-root user execution
- Minimal Alpine base image
- Tini init system (proper PID 1 handling)
- Health check monitoring
- No secrets in image layers
- Multi-stage build (small final image)

#### Docker Ignore Configuration

**Location**: `/apps/vendure-backend/.dockerignore`

**Excluded Artifacts**:
```
node_modules/      # Rebuilt in container
coverage/          # Test artifacts
*.log              # Log files
.env*             # Environment files
.git/             # Version control
*.md              # Documentation
tests/            # Test files
```

### Database Configuration

#### SSL/TLS Implementation

**Location**: `/apps/vendure-backend/src/config/database.ts`

**SSL Configuration Strategy**:
```typescript
const getSSLConfig = () => {
  // 1. Check if SSL enabled via environment
  if (!process.env.DATABASE_SSL) return false;

  // 2. Look for certificate file (Northflank provides)
  const certPath = process.env.DATABASE_SSL_CERT_PATH || '/app/certs/db-ca-cert.crt';

  // 3. Use certificate if available
  if (fs.existsSync(certPath)) {
    return {
      rejectUnauthorized: true,
      ca: fs.readFileSync(certPath).toString()
    };
  }

  // 4. Fallback for Northflank managed SSL
  return { rejectUnauthorized: false };
};
```

**Connection Pooling**:
```typescript
extra: {
  max: 10,              // Maximum connections
  min: 2,               // Minimum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
}
```

**Migration Support**:
- Development: Uses .ts migration files
- Production: Uses compiled .js migration files
- Path resolution based on NODE_ENV

### Application Configuration

#### Port Management

**Standardization**: All services use port 3000 by default

**Configuration Points**:
1. `index.ts`: `process.env.PORT || '3000'`
2. `vendure-config.ts`: `process.env.PORT || '3000'`
3. `Dockerfile`: `EXPOSE 3000`

**Northflank Override**: Northflank sets PORT environment variable dynamically

#### Graceful Shutdown

**Location**: `/apps/vendure-backend/src/index.ts`

**Signal Handlers**:
```typescript
// SIGTERM: Kubernetes pod termination
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

// SIGINT: Manual interruption
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Unhandled errors: Emergency shutdown
process.on('unhandledRejection', ...);
process.on('uncaughtException', ...);
```

**Shutdown Sequence**:
1. Receive termination signal
2. Stop accepting new connections
3. Wait for in-flight requests (max 30s)
4. Close database connections
5. Exit cleanly with status code 0

**Timeout Protection**: Force shutdown after 30 seconds

#### Health Check Endpoints

**Location**: `/apps/vendure-backend/src/index.ts`

**Health Check** (`/health`):
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T...",
  "env": "production",
  "port": 3000
}
```

**Readiness Check** (`/ready`):
```json
{
  "status": "ready",
  "timestamp": "2025-10-21T..."
}
```

**Usage**:
- Northflank: Health monitoring
- Kubernetes: Liveness probe
- Load Balancer: Health checking
- Monitoring: Status verification

#### CORS Configuration

**Development Origins**:
```typescript
- http://localhost:3000
- http://localhost:4005
- http://localhost:5173
- https://studio.apollographql.com
```

**Production Origins**:
```typescript
// From ALLOWED_ORIGINS environment variable
- https://your-frontend.northflank.app
- https://www.your-domain.com
- Custom domains
```

**Security**:
- Environment-based configuration
- No wildcard in production
- Credentials support enabled
- Preflight caching

---

## Environment Configuration

### Environment Variables

**Required Variables**:

```bash
# Application
NODE_ENV=production
PORT=3000

# Database (from Northflank PostgreSQL addon)
DATABASE_HOST={{ POSTGRES_HOST }}
DATABASE_PORT={{ POSTGRES_PORT }}
DATABASE_USER={{ POSTGRES_USER }}
DATABASE_PASSWORD={{ POSTGRES_PASSWORD }}
DATABASE_NAME={{ POSTGRES_DB }}
DATABASE_SCHEMA=jade
DATABASE_SSL=true

# Security
VENDURE_COOKIE_SECRET=<32-char-random>
JWT_SECRET=<64-char-random>

# CORS
ALLOWED_ORIGINS=https://your-frontend.com
```

**Optional Variables**:

```bash
# Redis (future)
REDIS_HOST=<redis-host>
REDIS_PORT=6379
REDIS_PASSWORD=<password>

# Email
SMTP_HOST=<smtp-host>
SMTP_PORT=587
SMTP_USER=<username>
SMTP_PASS=<password>

# Storage
AWS_ACCESS_KEY_ID=<key>
AWS_SECRET_ACCESS_KEY=<secret>
AWS_REGION=us-east-1
AWS_S3_BUCKET=<bucket>

# Monitoring
LOG_LEVEL=info
LOG_FORMAT=json
```

### Secret Management

**Northflank Secret Groups**:
1. `jade-backend-secrets`: Application secrets
2. `jade-database-secrets`: Database credentials (auto-linked)
3. `jade-external-services`: Third-party API keys

**Secret Generation**:
```bash
# VENDURE_COOKIE_SECRET
openssl rand -base64 32

# JWT_SECRET
openssl rand -base64 64
```

---

## Integration Requirements

### Existing System Integration

**Must Not Break**:
- Local development environment
- Database migrations
- Vendure admin UI
- GraphQL API endpoints
- Apollo Server functionality

**Must Integrate With**:
- Northflank PostgreSQL addon
- Northflank build system
- Northflank deployment pipeline
- GitHub repository (auto-deploy)
- Frontend applications

### Backward Compatibility

- Local development uses Docker Compose (unchanged)
- Development .env file structure preserved
- All existing npm scripts functional
- TypeScript compilation unchanged
- Test suite runs without modification

---

## Constitutional Compliance

### Infrastructure Stability Protection

**Principle**: Deployment infrastructure changes must not destabilize development

**Protected Elements**:
1. **Local Development**: Docker Compose remains primary local stack
2. **Environment Files**: .env files never committed to repository
3. **Build Process**: No breaking changes to package.json scripts
4. **Database Schema**: Migrations always backward compatible

**Change Request Process**:
Any future infrastructure changes must include:
1. Impact assessment on development workflow
2. Rollback plan
3. Testing in staging environment
4. Documentation updates
5. Team notification

### Security Compliance

**Security Requirements**:
1. No secrets in code or Docker images
2. SSL/TLS for all database connections
3. Non-root container execution
4. Environment-based configuration
5. Principle of least privilege

**Audit Trail**:
- All infrastructure changes in git history
- Deployment logs retained by Northflank
- Configuration changes versioned
- Secret rotations documented

---

## Testing Requirements

### Pre-Deployment Testing

**Docker Build Test**:
```bash
docker build -f apps/vendure-backend/Dockerfile -t jade-backend:test .
```

**Expected Outcome**:
- Build completes without errors
- Image size < 300MB
- All dependencies installed
- TypeScript compiles successfully

**Container Runtime Test**:
```bash
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e PORT=3000 \
  -e DATABASE_HOST=localhost \
  jade-backend:test
```

**Expected Outcome**:
- Container starts successfully
- Health endpoint responds
- Application listens on port 3000
- Graceful shutdown works

### Post-Deployment Testing

**Health Check Verification**:
```bash
curl https://jade-backend.northflank.app/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T...",
  "env": "production",
  "port": 3000
}
```

**GraphQL Endpoint Verification**:
```bash
curl https://jade-backend.northflank.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

**Database Connection Verification**:
- Check logs for "Database connected" message
- Verify SSL/TLS connection established
- Confirm connection pooling active

**Performance Benchmarks**:
- Health check response < 2 seconds
- GraphQL query response < 500ms
- Container startup < 60 seconds
- Graceful shutdown < 30 seconds

---

## Security Considerations

### Container Security

**Image Security**:
- Alpine Linux base (minimal attack surface)
- Regular security updates
- No unnecessary packages
- Vulnerability scanning

**Runtime Security**:
- Non-root user (nodejs:1001)
- Read-only root filesystem (future)
- No privileged escalation
- Resource limits enforced

### Network Security

**Transport Security**:
- HTTPS only (Northflank provides SSL)
- Database SSL/TLS required
- No plain HTTP connections
- Certificate validation

**Access Control**:
- Northflank authentication required
- GitHub repository access controlled
- Database credentials rotated
- API keys in secret management

### Data Security

**In Transit**:
- TLS 1.2+ for all connections
- Certificate pinning considered
- No credential exposure in logs

**At Rest**:
- PostgreSQL encryption at rest (Northflank managed)
- Secrets encrypted in Northflank
- No sensitive data in environment

---

## Documentation Requirements

### Infrastructure Documentation

**Created Documents**:
1. `Dockerfile` - Container build instructions
2. `.dockerignore` - Build context optimization
3. `.env.production.template` - Environment variable reference
4. `NORTHFLANK-DEPLOY.md` - Step-by-step deployment guide
5. `DEPLOYMENT-FIXES-SUMMARY.md` - Implementation summary
6. This specification - Complete technical reference

**Required Updates**:
1. README.md - Add deployment section
2. package.json - Document deployment scripts
3. CHANGELOG.md - Record infrastructure changes

### Operational Documentation

**Runbooks** (Future):
- Deployment procedure
- Rollback procedure
- Incident response
- Scaling procedure
- Backup and restore

**Monitoring** (Future):
- Health check dashboard
- Error rate monitoring
- Performance metrics
- Resource utilization

---

## Rollout Strategy

### Phase 1: Infrastructure Setup (Completed)

- [x] Create Dockerfile
- [x] Create .dockerignore
- [x] Implement SSL/TLS support
- [x] Add graceful shutdown
- [x] Create health endpoints
- [x] Fix port configuration
- [x] Create environment template
- [x] Write deployment documentation

### Phase 2: Code Fixes (In Progress)

- [ ] Fix TypeScript compilation errors
- [ ] Install missing dependencies
- [ ] Update Vendure API compatibility
- [ ] Fix User entity definitions
- [ ] Test Docker build locally

### Phase 3: Northflank Setup (Pending)

- [ ] Create Northflank account
- [ ] Create project
- [ ] Provision PostgreSQL addon
- [ ] Create secret groups
- [ ] Configure environment variables
- [ ] Connect GitHub repository

### Phase 4: Deployment (Pending)

- [ ] Deploy backend service
- [ ] Monitor build logs
- [ ] Verify health checks
- [ ] Run database migrations
- [ ] Test GraphQL endpoints
- [ ] Verify admin UI access

### Phase 5: Validation (Pending)

- [ ] Performance testing
- [ ] Security audit
- [ ] Load testing
- [ ] Failover testing
- [ ] Monitoring setup

---

## Risk Mitigation

### Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Docker build failures | High | High | Fix compilation errors, test locally |
| Database SSL issues | Medium | High | Test SSL config, fallback strategy |
| Port conflicts | Low | Medium | Use standard port 3000, document |
| Memory limits | Medium | Medium | Monitor usage, optimize container |
| Build timeout | Medium | Medium | Optimize Dockerfile, cache layers |

### Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Deployment downtime | Low | High | Health checks, graceful shutdown |
| Secret exposure | Low | Critical | Environment variables only, audit |
| Cost overruns | Medium | Low | Monitor usage, set budget alerts |
| Data loss | Low | Critical | Automated backups, point-in-time recovery |

### Process Risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Missing documentation | Medium | Medium | This specification, deployment guide |
| Configuration drift | Medium | Medium | Infrastructure as code, version control |
| Knowledge silos | Medium | Low | Documentation, team training |

---

## Dependencies

### Infrastructure Dependencies

**Northflank Platform**:
- Account with appropriate tier
- PostgreSQL addon support
- Docker build capability
- GitHub integration

**External Services**:
- GitHub repository access
- Domain DNS (if custom domain)
- SSL certificate provider (Northflank provides)

### Application Dependencies

**Fixed Dependencies** (Blockers):
- @vendure/email-plugin (missing)
- UserRole enum definitions
- User entity with passwordHash
- Vendure 2.2.0 API compatibility

**Runtime Dependencies**:
- Node.js 20.x
- pnpm 8.15.5
- PostgreSQL 16
- Redis 7 (optional)

---

## Acceptance Criteria

### Infrastructure Criteria

- [x] Dockerfile created and documented
- [x] Multi-stage build implemented
- [x] Security hardening applied
- [x] Health checks configured
- [x] SSL/TLS database support added
- [x] Graceful shutdown implemented
- [x] Environment template created
- [x] Deployment guide written

### Code Criteria

- [ ] All TypeScript errors resolved
- [ ] Docker build completes successfully
- [ ] Container runs without errors
- [ ] Health endpoint responds
- [ ] Database connects with SSL
- [ ] Application starts in < 60s

### Deployment Criteria

- [ ] Northflank service created
- [ ] Build succeeds on platform
- [ ] Health checks passing
- [ ] GraphQL endpoint accessible
- [ ] Admin UI functional
- [ ] No errors in logs

### Quality Criteria

- [ ] Documentation complete
- [ ] Code reviewed
- [ ] Security audit passed
- [ ] Performance benchmarks met
- [ ] Monitoring configured

---

## Success Criteria

**Deployment is successful when**:

1. ✅ Backend service running on Northflank
2. ✅ Health check returns 200 OK
3. ✅ Database connection established with SSL
4. ✅ GraphQL API responds correctly
5. ✅ Admin UI accessible
6. ✅ No critical errors in logs
7. ✅ Response times meet SLA
8. ✅ Graceful shutdown works
9. ✅ Auto-deploy from GitHub works
10. ✅ Documentation complete

---

## Version History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2025-10-21 | AI Assistant | Initial specification for Northflank deployment |

---

## Approval

**Prepared by**: AI Development Assistant
**Reviewed by**: Pending
**Approved by**: Pending
**Date**: October 21, 2025
**Status**: IN PROGRESS - Infrastructure Complete, Code Fixes Pending

---

## Appendices

### Appendix A: Dockerfile Reference

See `/apps/vendure-backend/Dockerfile` for complete implementation

### Appendix B: Environment Variables

See `/apps/vendure-backend/.env.production.template` for complete reference

### Appendix C: Deployment Guide

See `/apps/vendure-backend/NORTHFLANK-DEPLOY.md` for step-by-step instructions

### Appendix D: Troubleshooting

See deployment guide Section "Troubleshooting" for common issues and solutions

### Appendix E: Constitutional References

- Amendment 001: UI Stability Protection Protocol (proposed)
- Infrastructure Stability Protection (this spec)
- Security Compliance Requirements
