# Northflank Configuration Reference Card

Quick copy-paste values for Northflank UI configuration.

---

## 🔧 Build Settings

### Dockerfile Configuration

| Field | Value | Notes |
|-------|-------|-------|
| **Dockerfile path** | `/apps/vendure-backend/Dockerfile` | ⚠️ Must start with `/` |
| **Build context** | `/` | Repository root |
| **Build engine** | Docker | |

---

## 🌐 Service Configuration

### Basic Settings

| Field | Value |
|-------|-------|
| **Name** | `jade-marketplace-backend` |
| **Type** | Combined (Build & Deploy) |
| **Repository** | `jade-spa-marketplace` |
| **Branch** | `main` |

### Port Configuration

| Field | Value |
|-------|-------|
| **Port** | `3000` |
| **Protocol** | HTTP |
| **Public access** | Enabled |

### Health Checks

| Field | Value |
|-------|-------|
| **Health check path** | `/health` |
| **Health check port** | `3000` |
| **Initial delay** | `30` seconds |
| **Timeout** | `10` seconds |
| **Period** | `30` seconds |
| **Failure threshold** | `3` |

---

## 💾 PostgreSQL Addon

### Configuration

| Field | Value |
|-------|-------|
| **Name** | `jade-marketplace-db` |
| **Type** | PostgreSQL |
| **Version** | `16` (or latest) |
| **Plan** | Starter (or higher) |

---

## 🔐 Environment Variables (Secret Group: `jade-backend-secrets`)

### Copy-Paste Template

```bash
# === REQUIRED VARIABLES ===

# Environment
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Database (get from PostgreSQL addon)
DATABASE_TYPE=postgres
DATABASE_HOST=<COPY_FROM_POSTGRES_ADDON>
DATABASE_PORT=5432
DATABASE_NAME=<COPY_FROM_POSTGRES_ADDON>
DATABASE_USERNAME=<COPY_FROM_POSTGRES_ADDON>
DATABASE_PASSWORD=<COPY_FROM_POSTGRES_ADDON>
DATABASE_SSL=true
DATABASE_POOL_MAX=10
DATABASE_POOL_MIN=2

# JWT Secrets (from generated-secrets.txt)
JWT_ACCESS_SECRET=eCrhCCTn407PJ/6J+7JHgKpuNYItBx/D3lVqMHXHGdk=
JWT_REFRESH_SECRET=hd+Rurr/Ke9fN23m5pVRlIFUKqE9XQ0mLYUgpj4JI4U=
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

# Vendure Configuration (from generated-secrets.txt)
VENDURE_COOKIE_SECRET=BJv1VkkE59d3plLZtRwzpOiPUdDTEEeYBkcEgn/y0yo=

# Session Secret (from generated-secrets.txt)
SESSION_SECRET=BV7FCRVV+DKT7bTMtucux0CSse3jKThxN+kJY4y4aUk=

# CORS - UPDATE THIS with your actual frontend domain
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### Add Each Variable Separately in Northflank

Click "Add Secret" for each variable above and enter:
- **Key**: Variable name (e.g., `NODE_ENV`)
- **Value**: Variable value (e.g., `production`)

---

## 📊 Resource Allocation

### Minimum (Development/Testing)

| Resource | Value |
|----------|-------|
| **CPU** | 0.5 vCPU |
| **Memory** | 512 MB |
| **Instances** | 1 |

### Recommended (Production)

| Resource | Value |
|----------|-------|
| **CPU** | 1 vCPU |
| **Memory** | 1 GB |
| **Min Instances** | 1 |
| **Max Instances** | 3 |

---

## 🧪 Testing Endpoints After Deployment

### Health Check
```bash
curl https://YOUR-SERVICE-URL.northflank.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-21T...",
  "env": "production",
  "port": 3000
}
```

### Readiness Check
```bash
curl https://YOUR-SERVICE-URL.northflank.app/ready
```

**Expected Response:**
```json
{
  "status": "ready",
  "timestamp": "2025-10-21T..."
}
```

### GraphQL Endpoint
```bash
curl -X POST https://YOUR-SERVICE-URL.northflank.app/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __typename }"}'
```

**Expected Response:**
```json
{
  "data": {
    "__typename": "Query"
  }
}
```

---

## 🔄 Database Migrations

### After First Deployment

Run this command once in Northflank console:

```bash
node dist/run-migrations.js
```

**Where to run:**
1. Go to your service in Northflank
2. Click **"Jobs"** or **"Console"** or **"Run Command"**
3. Enter the command above
4. Click **"Run"**
5. Wait for completion (check logs)

---

## 📝 Deployment Checklist

Use this checklist while configuring Northflank:

### Step 1: GitHub Connection
- [ ] GitHub repository connected
- [ ] Repository: `YetiPanda/jade-spa-marketplace` selected
- [ ] Branch: `main` configured

### Step 2: PostgreSQL Addon
- [ ] PostgreSQL addon created
- [ ] Version 16 selected
- [ ] Addon status: Running
- [ ] Connection details copied

### Step 3: Secrets
- [ ] Secret group `jade-backend-secrets` created
- [ ] All database variables added
- [ ] All JWT secrets added
- [ ] VENDURE_COOKIE_SECRET added
- [ ] SESSION_SECRET added
- [ ] ALLOWED_ORIGINS configured
- [ ] NODE_ENV=production set
- [ ] PORT=3000 set

### Step 4: Service Creation
- [ ] Service name: `jade-marketplace-backend`
- [ ] Dockerfile path: `/apps/vendure-backend/Dockerfile`
- [ ] Build context: `/`
- [ ] Port: 3000
- [ ] Health check path: `/health`
- [ ] Secret group linked
- [ ] Resources allocated

### Step 5: Build & Deploy
- [ ] Build started
- [ ] Build completed successfully
- [ ] Deployment started
- [ ] Service status: Running
- [ ] Public URL available

### Step 6: Verification
- [ ] Health endpoint responds with 200
- [ ] GraphQL endpoint accessible
- [ ] No errors in service logs
- [ ] Database migrations completed

---

## ⚠️ Common Issues & Solutions

### Issue: Dockerfile path validation error

**Error Message:**
```
"buildSettings.dockerfile.dockerFilePath" fails to match pattern
```

**Solution:**
- Use: `/apps/vendure-backend/Dockerfile` (starts with `/`)
- NOT: `apps/vendure-backend/Dockerfile` (missing leading `/`)

### Issue: Build context not found

**Solution:**
- Set build context to: `/` (repository root)
- Ensure repository is properly connected

### Issue: Health check fails

**Solution:**
1. Verify port is set to `3000`
2. Check health check path is `/health`
3. Increase initial delay to 60 seconds
4. Check service logs for startup errors

### Issue: Database connection fails

**Solution:**
1. Verify all DATABASE_* variables are set correctly
2. Ensure `DATABASE_SSL=true`
3. Check PostgreSQL addon is running
4. Verify credentials match addon connection details

### Issue: Build succeeds but deployment fails

**Solution:**
1. Check service logs for errors
2. Verify all required environment variables are set
3. Check DATABASE_HOST and credentials
4. Ensure ALLOWED_ORIGINS is set (can be `*` for testing)

---

## 📞 Support

- **Northflank Docs**: https://northflank.com/docs
- **Northflank Support**: https://northflank.com/support
- **GitHub Issues**: https://github.com/YetiPanda/jade-spa-marketplace/issues

---

**Last Updated**: 2025-10-21
**Status**: Ready for deployment ✅
