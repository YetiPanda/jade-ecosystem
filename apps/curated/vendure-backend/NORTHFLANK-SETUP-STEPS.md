# Northflank Deployment Setup Steps

**Project**: JADE Spa Marketplace Backend
**GitHub Repository**: https://github.com/YetiPanda/jade-spa-marketplace
**Northflank Team**: https://app.northflank.com/t/yetipandas-team/projects

---

## Prerequisites ✅

- [x] Northflank account created (yetipandas-team)
- [x] Docker image builds successfully locally
- [x] GitHub repository available

---

## Step 1: Connect GitHub Repository

1. Go to your Northflank project: https://app.northflank.com/t/yetipandas-team/projects
2. Click on **"Settings"** in the left sidebar
3. Click on **"Git Repositories"** or **"Integrations"**
4. Click **"Connect Repository"** or **"Add GitHub Integration"**
5. Select your GitHub account **YetiPanda**
6. Authorize Northflank to access the repository
7. Select repository: **jade-spa-marketplace**
8. Default branch: **main** (or your primary branch)

✅ **Verification**: You should see the repository listed in your connected repositories.

---

## Step 2: Create PostgreSQL Addon

1. In your Northflank project, click **"Addons"** in the left sidebar
2. Click **"Create Addon"**
3. Select **"PostgreSQL"**
4. Configure the addon:
   ```
   Name: jade-marketplace-db
   Type: PostgreSQL
   Version: 16 (or latest stable)
   Plan: Starter (or appropriate for your needs)
   Region: Select closest to your target users
   ```
5. Click **"Create Addon"**
6. Wait for provisioning to complete (usually 1-2 minutes)

✅ **Verification**: Addon status shows "Running"

**Important**: Note down the connection details:
- Host
- Port
- Database name
- Username
- Password (shown once, save securely!)

---

## Step 3: Create Secret Group for Environment Variables

1. Click **"Secrets"** in the left sidebar
2. Click **"Create Secret Group"**
3. Name it: `jade-backend-secrets`
4. Add the following secrets:

### Required Secrets

```bash
# Database Configuration (from PostgreSQL addon)
DATABASE_HOST=<from addon connection details>
DATABASE_PORT=5432
DATABASE_NAME=<from addon connection details>
DATABASE_USERNAME=<from addon connection details>
DATABASE_PASSWORD=<from addon connection details>
DATABASE_SSL=true

# JWT Secrets (generate using: openssl rand -base64 32)
JWT_ACCESS_SECRET=<generate-secure-random-string>
JWT_REFRESH_SECRET=<generate-secure-random-string>

# Vendure Cookie Secret (generate using: openssl rand -base64 32)
VENDURE_COOKIE_SECRET=<generate-secure-random-string>

# Session Secret (generate using: openssl rand -base64 32)
SESSION_SECRET=<generate-secure-random-string>

# Environment
NODE_ENV=production
PORT=3000

# CORS - Add your frontend domains
ALLOWED_ORIGINS=https://your-frontend-domain.com,https://www.your-frontend-domain.com

# Optional: Email configuration (if using email features)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=<your-smtp-username>
SMTP_PASS=<your-smtp-password>
SMTP_FROM=noreply@yourdomain.com
```

### Generate Secrets Locally

Run these commands to generate secure secrets:

```bash
# JWT Access Secret
echo "JWT_ACCESS_SECRET=$(openssl rand -base64 32)"

# JWT Refresh Secret
echo "JWT_REFRESH_SECRET=$(openssl rand -base64 32)"

# Vendure Cookie Secret
echo "VENDURE_COOKIE_SECRET=$(openssl rand -base64 32)"

# Session Secret
echo "SESSION_SECRET=$(openssl rand -base64 32)"
```

Copy the generated values into Northflank secrets.

---

## Step 4: Create Backend Service

1. Click **"Services"** in the left sidebar
2. Click **"Create Service"**
3. Select **"Combined (Build & Deploy)"**

### Service Configuration

#### Basic Info
```
Name: jade-marketplace-backend
Type: Combined Service
```

#### Source
```
Repository: jade-spa-marketplace
Branch: main
```

#### Build Settings
```
Dockerfile Path: /apps/vendure-backend/Dockerfile
Build Context: /
Build Engine: Docker
Arguments: (none needed)
```

**⚠️ IMPORTANT**: The Dockerfile path MUST start with `/` (forward slash)
- ✅ Correct: `/apps/vendure-backend/Dockerfile`
- ❌ Wrong: `apps/vendure-backend/Dockerfile`

#### Runtime Settings
```
Port: 3000
Protocol: HTTP
Health Check Path: /health
Min Instances: 1
Max Instances: 3 (auto-scaling)
```

#### Environment Variables
- Link the secret group: `jade-backend-secrets`
- All environment variables from the secret group will be automatically available

#### Resources (adjust based on your plan)
```
CPU: 0.5 vCPU (minimum)
Memory: 512 MB (minimum, recommend 1GB)
```

#### Networking
```
Public Access: Enabled
Custom Domain: (optional, can add later)
```

5. Click **"Create Service"**

---

## Step 5: Monitor Build & Deployment

1. After creating the service, you'll be redirected to the service dashboard
2. Click on **"Builds"** tab to watch the build progress
3. Build logs will show:
   - Cloning repository
   - Installing dependencies (pnpm install)
   - Building shared-types package
   - Building vendure-backend
   - Creating Docker image
   - Pushing to registry

Expected build time: **3-5 minutes**

4. Once build completes, deployment starts automatically
5. Click on **"Deployments"** tab to monitor deployment
6. Watch for:
   - Container starting
   - Health check passing
   - Status: "Running"

✅ **Verification**: Service status shows "Running" with green indicator

---

## Step 6: Get Service URL

1. In the service dashboard, look for **"Public URL"** or **"Domains"**
2. Copy the Northflank-provided URL (e.g., `https://jade-marketplace-backend-xxxxx.northflank.app`)
3. Test the health endpoint:

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

---

## Step 7: Run Database Migrations

**Important**: Database migrations need to be run ONCE after first deployment.

### Option A: Using Northflank Console (Recommended)

1. Go to your backend service in Northflank
2. Click on **"Jobs"** or **"Run Command"**
3. Create a one-time job:
   ```bash
   node dist/run-migrations.js
   ```
4. Monitor the job logs to ensure migrations complete successfully

### Option B: Using Local Database Connection (Alternative)

If Northflank doesn't support one-time jobs easily, you can run migrations locally by connecting to the production database:

1. Get database connection details from Northflank PostgreSQL addon
2. Create a temporary `.env.migration` file locally:
   ```bash
   DATABASE_HOST=<northflank-db-host>
   DATABASE_PORT=5432
   DATABASE_NAME=<northflank-db-name>
   DATABASE_USERNAME=<northflank-db-username>
   DATABASE_PASSWORD=<northflank-db-password>
   DATABASE_SSL=true
   NODE_ENV=production
   ```
3. Run migrations locally (pointing to production DB):
   ```bash
   cd apps/vendure-backend
   dotenv -e .env.migration -- node dist/run-migrations.js
   ```

⚠️ **Warning**: Be very careful when running migrations against production database!

---

## Step 8: Verify Deployment

### Test All Endpoints

1. **Health Check**
   ```bash
   curl https://your-service-url.northflank.app/health
   ```

2. **Readiness Check**
   ```bash
   curl https://your-service-url.northflank.app/ready
   ```

3. **GraphQL Endpoint**
   ```bash
   curl -X POST https://your-service-url.northflank.app/graphql \
     -H "Content-Type: application/json" \
     -d '{"query": "{ __typename }"}'
   ```

4. **GraphQL Playground** (if enabled in production)
   - Open browser: `https://your-service-url.northflank.app/graphql`

### Check Logs

1. In Northflank service dashboard, click **"Logs"**
2. Verify:
   - Server started successfully on port 3000
   - Database connection established
   - No error messages
3. Look for startup message:
   ```
   Server listening on port 3000
   GraphQL endpoint: /graphql
   ```

✅ **Success Criteria**:
- Service status: Running
- Health endpoint returns 200 OK
- GraphQL endpoint accessible
- Database migrations completed
- No errors in logs

---

## Step 9: Configure Custom Domain (Optional)

1. In service settings, click **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `api.yourdomain.com`
4. Add the provided CNAME record to your DNS provider:
   ```
   CNAME api.yourdomain.com -> <northflank-provided-domain>
   ```
5. Wait for DNS propagation (5-30 minutes)
6. Enable **"Force HTTPS"** (recommended)

---

## Step 10: Update Frontend Configuration

Update your frontend environment variables to point to the new backend:

```bash
# For marketplace-frontend .env.production
VITE_GRAPHQL_ENDPOINT=https://your-service-url.northflank.app/graphql
VITE_API_URL=https://your-service-url.northflank.app
```

Remember to update CORS `ALLOWED_ORIGINS` in backend secrets to include your frontend domain!

---

## Troubleshooting

### Build Fails

**Check**:
- Dockerfile path is correct: `apps/vendure-backend/Dockerfile`
- Build context is repository root
- All required files are in the repository
- Check build logs for specific errors

**Common Issues**:
- Missing dependencies: Check package.json
- TypeScript errors: Run `pnpm build` locally to verify
- Docker context issues: Ensure Dockerfile COPY paths are correct

### Service Won't Start

**Check**:
- Environment variables are set correctly
- Database connection details are correct
- Port is set to 3000
- Health check path is `/health`
- Check service logs for error messages

**Common Issues**:
- Database SSL connection: Ensure `DATABASE_SSL=true`
- Missing secrets: Verify all required environment variables
- Port mismatch: Ensure PORT=3000 in both code and Northflank config

### Health Check Failing

**Check**:
- Health endpoint is accessible: `curl http://localhost:3000/health` (in container)
- Service is actually listening on port 3000
- No startup errors in logs

**Fix**:
- Increase health check timeout in Northflank settings
- Check health check path is exactly `/health`
- Verify health endpoint returns 200 status code

### Database Connection Fails

**Check**:
- PostgreSQL addon is running
- Connection details match addon credentials
- SSL is enabled: `DATABASE_SSL=true`
- Network connectivity (Northflank services can access addons by default)

**Fix**:
- Verify DATABASE_HOST, PORT, NAME, USERNAME, PASSWORD
- Check if database addon is in same region
- Try toggling SSL settings

### GraphQL Endpoint Not Working

**Check**:
- Service is running
- Port 3000 is exposed
- CORS settings allow requests from your frontend domain
- Check `/graphql` path returns GraphQL playground or error message

**Fix**:
- Update ALLOWED_ORIGINS to include frontend domain
- Verify Apollo Server is configured correctly
- Check service logs for GraphQL initialization errors

---

## Rollback Plan

If deployment fails and you need to rollback:

1. Go to **"Deployments"** tab in Northflank
2. Find the previous working deployment
3. Click **"Redeploy"** on that version
4. Alternatively, revert the Git commit and push to trigger new build

---

## Post-Deployment Checklist

- [ ] Service is running and healthy
- [ ] Health endpoint returns 200 OK
- [ ] GraphQL endpoint is accessible
- [ ] Database migrations completed successfully
- [ ] Environment variables configured correctly
- [ ] CORS allows frontend domain
- [ ] Custom domain configured (if applicable)
- [ ] Frontend updated to use new backend URL
- [ ] SSL/HTTPS enabled
- [ ] Monitoring and logging reviewed
- [ ] Performance metrics look normal

---

## Next Steps After Successful Deployment

1. **Set up monitoring**: Configure alerts for service downtime
2. **Enable auto-scaling**: Adjust based on traffic patterns
3. **Configure backups**: Set up database backup schedule
4. **Review logs**: Set up log aggregation if needed
5. **Performance testing**: Run load tests to verify capacity
6. **Documentation**: Update internal docs with production URLs

---

## Support Resources

- Northflank Docs: https://northflank.com/docs
- Northflank Support: https://northflank.com/support
- Project GitHub: https://github.com/YetiPanda/jade-spa-marketplace

---

**Generated**: 2025-10-21
**Last Updated**: 2025-10-21
**Status**: Ready for deployment
