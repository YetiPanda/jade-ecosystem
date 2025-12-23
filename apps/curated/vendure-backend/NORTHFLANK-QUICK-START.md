# Northflank Deployment - Quick Start Guide

**Project**: JADE Spa Marketplace Backend
**Status**: Ready for deployment ✅
**Docker Image**: Successfully built and tested locally

---

## 🚀 Quick Deployment Steps

### 1. Connect GitHub Repository (5 minutes)

Go to: https://app.northflank.com/t/yetipandas-team/projects

1. **Settings** → **Git Repositories** → **Add GitHub Integration**
2. Authorize **YetiPanda** account
3. Select repository: **jade-spa-marketplace**
4. Branch: **main**

---

### 2. Create PostgreSQL Database (3 minutes)

1. **Addons** → **Create Addon** → **PostgreSQL**
2. Settings:
   - Name: `jade-marketplace-db`
   - Version: PostgreSQL 16
   - Plan: Choose based on your needs (Starter is fine to begin)
   - Region: Select closest to your users
3. **Create** and wait for provisioning
4. **Copy connection details** (you'll need these in Step 3)

---

### 3. Create Secrets (10 minutes)

1. **Secrets** → **Create Secret Group**
2. Name: `jade-backend-secrets`
3. Add these secrets one by one:

**Copy from `generated-secrets.txt` file:**
```bash
JWT_ACCESS_SECRET=<from generated-secrets.txt>
JWT_REFRESH_SECRET=<from generated-secrets.txt>
VENDURE_COOKIE_SECRET=<from generated-secrets.txt>
SESSION_SECRET=<from generated-secrets.txt>
```

**From PostgreSQL addon (Step 2):**
```bash
DATABASE_HOST=<from addon>
DATABASE_PORT=5432
DATABASE_NAME=<from addon>
DATABASE_USERNAME=<from addon>
DATABASE_PASSWORD=<from addon>
DATABASE_SSL=true
```

**Required environment settings:**
```bash
NODE_ENV=production
PORT=3000
DATABASE_TYPE=postgres
DATABASE_POOL_MAX=10
DATABASE_POOL_MIN=2
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d
LOG_LEVEL=info
```

**CORS (update with your actual frontend domain):**
```bash
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

---

### 4. Create Backend Service (5 minutes)

1. **Services** → **Create Service** → **Combined (Build & Deploy)**

**Configuration:**
```
Name: jade-marketplace-backend
Repository: jade-spa-marketplace
Branch: main

Build Settings:
  Dockerfile Path: /apps/vendure-backend/Dockerfile
  Build Context: /

Port: 3000
Health Check Path: /health

Resources:
  CPU: 0.5 vCPU (minimum)
  Memory: 512 MB (recommend 1GB)

Environment:
  Link secret group: jade-backend-secrets
```

**⚠️ Important**: The Dockerfile path MUST start with `/` (forward slash)

2. **Create Service**
3. Watch build logs (3-5 minutes)

---

### 5. Verify Deployment (2 minutes)

Once deployment shows "Running":

1. Copy the service URL from Northflank dashboard
2. Test health endpoint:
   ```bash
   curl https://your-service-url.northflank.app/health
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

3. Test GraphQL:
   ```bash
   curl -X POST https://your-service-url.northflank.app/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ __typename }"}'
   ```

---

### 6. Run Database Migrations (5 minutes)

**Option A: Northflank Console**
1. Go to your service → **Jobs** or **Console**
2. Run command:
   ```bash
   node dist/run-migrations.js
   ```

**Option B: Local Connection to Production DB**
1. Get database credentials from Northflank addon
2. Create local `.env.migration`:
   ```bash
   DATABASE_HOST=<northflank-host>
   DATABASE_PORT=5432
   DATABASE_NAME=<northflank-db>
   DATABASE_USERNAME=<northflank-user>
   DATABASE_PASSWORD=<northflank-pass>
   DATABASE_SSL=true
   NODE_ENV=production
   ```
3. Run locally:
   ```bash
   cd apps/vendure-backend
   dotenv -e .env.migration -- node dist/run-migrations.js
   ```

---

## ✅ Success Checklist

- [ ] GitHub repository connected
- [ ] PostgreSQL addon created and running
- [ ] All secrets configured in secret group
- [ ] Backend service created and deployed
- [ ] Service status shows "Running"
- [ ] Health endpoint returns 200 OK
- [ ] GraphQL endpoint accessible
- [ ] Database migrations completed
- [ ] No errors in service logs

---

## 📋 What You Have

✅ **Files Created:**
- `NORTHFLANK-SETUP-STEPS.md` - Detailed step-by-step guide
- `NORTHFLANK-QUICK-START.md` - This quick reference (you are here)
- `generated-secrets.txt` - Pre-generated secrets (⚠️ keep secure!)
- `northflank-secrets-template.txt` - Template for all env vars
- `Dockerfile` - Production-ready Docker image
- `.dockerignore` - Optimized Docker build
- `.env.production.template` - Reference for all variables

✅ **Docker Image:**
- Built successfully: `jade-backend:test`
- Size: 513MB
- Multi-stage build with security hardening
- Health checks included
- Graceful shutdown handlers
- SSL/TLS database support

---

## 🔧 Configuration Reference

### Service Ports
- Container Port: **3000**
- Health Check: **/health**
- Readiness Check: **/ready**
- GraphQL API: **/graphql**

### Database
- Type: PostgreSQL 16
- SSL: Required
- Pool: 2-10 connections

### Build Time
- Expected: 3-5 minutes
- Stages: Install deps → Build shared-types → Build backend → Runtime

### Deployment
- Auto-deploy on git push to main
- Zero-downtime rolling updates
- Health checks before traffic routing

---

## 📚 Additional Resources

- **Detailed Guide**: See `NORTHFLANK-SETUP-STEPS.md`
- **Troubleshooting**: Check logs in Northflank dashboard
- **Rollback**: Use Northflank deployments tab to redeploy previous version

---

## 🆘 Need Help?

**Common Issues:**

1. **Build fails**: Check Dockerfile path is `apps/vendure-backend/Dockerfile`
2. **Service won't start**: Verify all environment variables are set
3. **Database connection fails**: Check SSL is enabled and credentials are correct
4. **Health check fails**: Ensure port 3000 is exposed and `/health` endpoint exists

**Check logs:**
- Northflank Dashboard → Your Service → **Logs** tab

---

## 🎯 Next Steps After Deployment

1. Add custom domain (optional)
2. Update frontend to use new backend URL
3. Configure monitoring/alerts
4. Set up database backups
5. Review and optimize resource allocation

---

**Last Updated**: 2025-10-21
**Status**: Production Ready ✅
