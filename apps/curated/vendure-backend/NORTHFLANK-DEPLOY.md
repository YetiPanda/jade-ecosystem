# Northflank Deployment Guide - JADE Vendure Backend

## Overview
This guide walks you through deploying the JADE Spa Marketplace backend to Northflank, a modern PaaS platform.

---

## Prerequisites

- [ ] Northflank account (sign up at https://northflank.com)
- [ ] GitHub repository access
- [ ] This branch pushed to GitHub
- [ ] PostgreSQL addon created in Northflank
- [ ] Redis addon created in Northflank (optional)

---

## Step 1: Prepare Local Environment

### 1.1 Test Docker Build Locally

```bash
# Navigate to project root
cd /Users/jessegarza/JADE/jade-spa-marketplace

# Build the Docker image
docker build -f apps/vendure-backend/Dockerfile -t jade-backend:test .

# Check build succeeded
docker images | grep jade-backend
```

### 1.2 Test Container Locally (Optional)

```bash
# Run the container
docker run -p 3000:3000 \
  -e NODE_ENV=development \
  -e PORT=3000 \
  -e DATABASE_HOST=host.docker.internal \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=jade_marketplace \
  -e DATABASE_USER=jade_user \
  -e DATABASE_PASSWORD=jade_dev_password \
  -e DATABASE_SCHEMA=jade \
  jade-backend:test

# Test health check
curl http://localhost:3000/health
```

### 1.3 Commit and Push Changes

```bash
# Stage all deployment files
git add apps/vendure-backend/Dockerfile
git add apps/vendure-backend/.dockerignore
git add apps/vendure-backend/.env.production.template
git add apps/vendure-backend/NORTHFLANK-DEPLOY.md
git add apps/vendure-backend/src/index.ts
git add apps/vendure-backend/src/config/database.ts
git add apps/vendure-backend/src/vendure-config.ts

# Commit
git commit -m "feat: Add Northflank deployment configuration

- Add multi-stage Dockerfile with security hardening
- Implement graceful shutdown handling
- Add SSL/TLS database support
- Fix port configuration for Northflank
- Add production environment template
- Update health check endpoints"

# Push to GitHub
git push origin main
```

---

## Step 2: Create Northflank Project

### 2.1 Log into Northflank
1. Go to https://app.northflank.com
2. Click "Create Project"
3. Name: `jade-spa-marketplace`
4. Click "Create"

---

## Step 3: Create PostgreSQL Database Addon

### 3.1 Add PostgreSQL
1. In your project, click "Addons" → "Add Addon"
2. Select "PostgreSQL" (version 16 recommended)
3. Configuration:
   - Name: `jade-postgres`
   - Plan: Development (can upgrade later)
   - Database Name: `jade_marketplace`
   - Username: `jade_user`
4. Click "Create Addon"
5. Wait for provisioning (2-3 minutes)

### 3.2 Note Database Credentials
Northflank will auto-generate:
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`

---

## Step 4: Create Secret Group

### 4.1 Create Secrets
1. Go to "Secret Groups" → "Create Secret Group"
2. Name: `jade-backend-secrets`
3. Add the following secrets:

```env
# Database (link to addon)
DATABASE_HOST={{ POSTGRES_HOST }}
DATABASE_PORT={{ POSTGRES_PORT }}
DATABASE_USER={{ POSTGRES_USER }}
DATABASE_PASSWORD={{ POSTGRES_PASSWORD }}
DATABASE_NAME={{ POSTGRES_DB }}
DATABASE_SCHEMA=jade
DATABASE_SSL=true

# Application
NODE_ENV=production
PORT=3000

# Vendure
VENDURE_COOKIE_SECRET=<generate-random-32-char>
JWT_SECRET=<generate-random-64-char>

# CORS - Frontend URLs (comma-separated)
# If not set, backend will auto-detect Northflank frontend (.code.run domains)
ALLOWED_ORIGINS=https://p01--jade-marketplace-frontend--gzzwy72wxtyk.code.run

# Zilliz (from .env.example)
ZILLIZ_ENDPOINT=<your-endpoint>
ZILLIZ_USERNAME=<your-username>
ZILLIZ_PASSWORD=<your-password>
```

**Generate Secrets:**
```bash
# Generate random secret for VENDURE_COOKIE_SECRET
openssl rand -base64 32

# Generate random secret for JWT_SECRET
openssl rand -base64 64
```

---

## Step 5: Create Backend Service

### 5.1 Connect GitHub Repository
1. Click "Services" → "Create Service"
2. Select "Combined Service" (for simplicity)
3. Source:
   - Provider: GitHub
   - Repository: `YetiPanda/jade-spa-marketplace`
   - Branch: `main`

### 5.2 Configure Build
1. Build Settings:
   - Build Method: **Dockerfile**
   - Dockerfile Path: `apps/vendure-backend/Dockerfile`
   - Build Context: `/` (root of repository)
2. Click "Next"

### 5.3 Configure Runtime
1. Service Name: `jade-backend`
2. Port: `3000`
3. Health Check:
   - Path: `/health`
   - Initial Delay: 40 seconds
4. Resources:
   - CPU: 0.5 vCPU
   - Memory: 1 GB
   - Storage: 5 GB

### 5.4 Link Environment Variables
1. Environment:
   - Link Secret Group: `jade-backend-secrets`
2. Click "Create Service"

---

## Step 6: Monitor Deployment

### 6.1 Watch Build Logs
1. Go to "Builds" tab
2. Click on the running build
3. Watch for successful build completion
4. Expected time: 5-10 minutes

### 6.2 Watch Runtime Logs
1. Go to "Logs" tab
2. Look for:
   ```
   ✓ Database connected
   🚀 Server ready at http://localhost:3000
   🔗 GraphQL endpoint: http://localhost:3000/graphql
   ```

### 6.3 Test Health Endpoint
```bash
# Replace with your Northflank service URL
curl https://jade-backend-<your-id>.northflank.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T...",
  "env": "production",
  "port": 3000
}
```

---

## Step 7: Run Database Migrations

### 7.1 Access Service Shell
1. In Northflank, go to your service
2. Click "Jobs" → "Create Job"
3. Type: One-off
4. Command:
   ```bash
   pnpm --filter @jade/vendure-backend migration:run
   ```
5. Click "Run"

---

## Step 8: Verify Deployment

### 8.1 Check GraphQL Playground
Visit: `https://jade-backend-<your-id>.northflank.app/graphql`

### 8.2 Test Query
```graphql
query {
  __typename
}
```

### 8.3 Check Admin UI
Visit: `https://jade-backend-<your-id>.northflank.app/admin`

---

## Troubleshooting

### Build Fails
- Check Dockerfile syntax
- Verify all files exist in repository
- Check build logs for specific errors

### Database Connection Issues
- Verify PostgreSQL addon is running
- Check DATABASE_SSL is set to `true`
- Verify secret group is linked
- Check database credentials

### Port Issues
- Ensure PORT=3000 in environment
- Verify health check path is `/health`
- Check service is listening on correct port

### SSL/TLS Issues
- Ensure DATABASE_SSL=true
- Check Northflank PostgreSQL addon SSL is enabled
- Verify SSL configuration in database.ts

### CORS Issues

**Symptom**: Frontend shows "CORS policy" errors in browser console

**Error Example**:
```
Access to fetch at 'https://backend.code.run/graphql' from origin 'https://frontend.code.run'
has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present
```

**Solutions**:

1. **Check ALLOWED_ORIGINS environment variable**:
   ```bash
   # In Northflank, set environment variable:
   ALLOWED_ORIGINS=https://p01--jade-marketplace-frontend--gzzwy72wxtyk.code.run

   # Multiple origins (comma-separated):
   ALLOWED_ORIGINS=https://frontend1.code.run,https://frontend2.code.run
   ```

2. **Verify backend logs** - Look for CORS messages:
   ```
   CORS allowed origins: https://...
   Allowing Northflank origin: https://...
   ```

3. **Auto-detection for Northflank**:
   - If `ALLOWED_ORIGINS` is not set, backend automatically allows all `.code.run` domains
   - Check logs for: "ALLOWED_ORIGINS not set - defaulting to Northflank frontend"

4. **Test CORS with curl**:
   ```bash
   curl -X OPTIONS https://your-backend.code.run/graphql \
     -H "Origin: https://your-frontend.code.run" \
     -H "Access-Control-Request-Method: POST" \
     -v

   # Should see header:
   # Access-Control-Allow-Origin: https://your-frontend.code.run
   ```

5. **Common fixes**:
   - Restart backend service after adding ALLOWED_ORIGINS
   - Ensure frontend URL is exact (no trailing slash)
   - Check for typos in frontend URL
   - Verify NODE_ENV=production is set

---

## Performance Tuning

### Scale Service
1. Go to service settings
2. Increase resources:
   - CPU: 1 vCPU
   - Memory: 2 GB
3. Enable autoscaling (optional)

### Database Connection Pooling
Already configured in `database.ts`:
- Max connections: 10
- Min connections: 2

---

## Security Checklist

- [ ] All secrets use environment variables (not hardcoded)
- [ ] DATABASE_SSL enabled
- [ ] CORS configured with specific origins
- [ ] JWT_SECRET is random and secure
- [ ] VENDURE_COOKIE_SECRET is random and secure
- [ ] No .env files committed to git
- [ ] Health check endpoints don't expose sensitive data
- [ ] Non-root user in Docker container
- [ ] Rate limiting considered (future)

---

## Next Steps

1. **Set up Frontend Deployment** - Deploy marketplace-frontend to Northflank
2. **Configure Custom Domain** - Add your domain in Northflank
3. **Set up CDN** - Configure CloudFlare or AWS CloudFront
4. **Add Monitoring** - Integrate logging/monitoring service
5. **Configure Backups** - Enable automated database backups
6. **Set up CI/CD** - Auto-deploy on git push

---

## Support

- Northflank Docs: https://northflank.com/docs
- Discord: https://discord.gg/northflank
- Support: support@northflank.com

---

## Deployment Checklist

Pre-Deployment:
- [x] Dockerfile created
- [x] .dockerignore created
- [x] SSL/TLS database support added
- [x] Port configuration fixed
- [x] Graceful shutdown implemented
- [x] Production environment template created
- [x] Health check endpoints added
- [ ] Docker build tested locally
- [ ] Changes committed to GitHub

DermaLogica Intelligence MVP:
- [x] Intelligence plugin implemented
- [x] Skincare Knowledge Architecture (SKA) entities created
- [x] 17D skin tensor implementation complete
- [x] Zilliz vector database integration
- [x] Semantic search service
- [x] Causal chain navigation
- [x] Compatibility analyzer
- [x] Evidence and efficacy tracking
- [x] Knowledge threshold access control
- [x] API documentation updated
- [x] User guide updated

Northflank Setup:
- [ ] Project created
- [ ] PostgreSQL addon provisioned
- [ ] Redis addon provisioned (optional)
- [ ] Secret group created
- [ ] Secrets configured (including Zilliz credentials)
- [ ] Backend service created
- [ ] Build completed successfully
- [ ] Service is running
- [ ] Health check passing
- [ ] Database migrations run
- [ ] Intelligence data seeded

Post-Deployment:
- [ ] GraphQL endpoint tested
- [ ] Admin UI accessible
- [ ] Frontend connected
- [ ] Intelligence queries tested
- [ ] Skincare Search working
- [ ] Skin Health Dashboard accessible
- [ ] Custom domain configured
- [ ] Monitoring setup
- [ ] Backups enabled

---

## Intelligence Environment Variables

Add these to your Northflank secret group:

```env
# Zilliz Cloud (Vector Database for Intelligence)
ZILLIZ_ENDPOINT=https://in05-b5782a2faae5596.serverless.gcp-us-west1.cloud.zilliz.com
ZILLIZ_USERNAME=db_b5782a2faae5596
ZILLIZ_PASSWORD=<your-zilliz-password>
ZILLIZ_DATABASE=default

# Intelligence Feature Flags
ENABLE_TENSOR_CALCULATIONS=true
ENABLE_SEMANTIC_SEARCH=true
ENABLE_ANALYTICS=true
```

---

## Intelligence Post-Deployment Testing

### Test Intelligence Search
```bash
curl -X POST https://your-backend.code.run/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { intelligenceSearch(query: \"vitamin c serum\", limit: 5) { results { name atomType score } } }"
  }'
```

### Test Skin Health API
```bash
curl -X POST https://your-backend.code.run/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { skinTypes }"
  }'
```

### Test Tensor Dimensions
```bash
curl -X POST https://your-backend.code.run/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { tensorDimensions { key label description } }"
  }'
```

---

**Status**: ✅ Ready for Deployment
**Last Updated**: December 11, 2025
