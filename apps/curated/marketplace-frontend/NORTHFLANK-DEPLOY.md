# Northflank Deployment Guide - Marketplace Frontend

This guide explains how to deploy the JADE Spa Marketplace frontend to Northflank.

## Prerequisites

- ✅ Backend API deployed and running on Northflank
- ✅ Backend GraphQL endpoint URL (e.g., `https://your-backend.code.run/graphql`)
- ✅ Northflank account with project created

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│  Docker Multi-Stage Build                  │
├─────────────────────────────────────────────┤
│  Stage 1: Builder                           │
│  • Install dependencies with pnpm           │
│  • Build shared-types package               │
│  • Build React app with Vite                │
│                                             │
│  Stage 2: Runtime                           │
│  • Nginx Alpine (lightweight)              │
│  • Serves static files                      │
│  • SPA routing configured                   │
│  • Runtime env injection                    │
└─────────────────────────────────────────────┘
```

---

## Step 1: Create Combined Service on Northflank

Unlike the backend, the frontend is deployed as a **Combined Service** (Build + Runtime in one).

1. **Navigate to your Northflank project**
2. **Click "Create Service" → "Combined Service"**
3. **Configure the service:**

### Basic Settings
- **Name**: `jade-marketplace-frontend`
- **Description**: React frontend for JADE Spa Marketplace
- **Repository**: `https://github.com/YetiPanda/jade-spa-marketplace`
- **Branch**: `main`

### Build Settings
- **Build Method**: Dockerfile
- **Dockerfile Path**: `/apps/marketplace-frontend/Dockerfile`
- **Build Context**: `/` (repository root - required for monorepo)
- **Build Arguments** (Optional):
  ```
  VITE_GRAPHQL_ENDPOINT=https://your-backend-url.code.run/graphql
  ```

### Runtime Settings
- **Port**: `8080`
- **Health Check Path**: `/health`
- **Health Check Port**: `8080`

---

## Step 2: Configure Environment Variables

Add these environment variables in Northflank:

### Required Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `VITE_GRAPHQL_ENDPOINT` | `https://your-backend-url.code.run/graphql` | Backend GraphQL API URL |

**⚠️ Important**: Replace `your-backend-url.code.run` with your actual backend URL from the previous deployment.

### Pre-GA Access Control Variables

| Variable | Default Value | Description |
|----------|---------------|-------------|
| `AUTH_USERNAME` | `jade` | Basic Auth username (change for production) |
| `AUTH_PASSWORD` | `jade2025preview` | Basic Auth password (change for production) |

**🔒 Security Note**:
- Basic Authentication is enabled by default for pre-GA access control
- Change the default credentials in production
- Remove Basic Auth section from nginx.conf when ready for public launch

---

## Step 3: Configure Resources

### Recommended Settings

- **CPU**: 0.2 vCPU
- **Memory**: 256 MB
- **Replicas**: 1 (or 2+ for high availability)
- **Auto-scaling**: Optional (scale based on CPU/Memory)

**Note**: Frontend uses much fewer resources than backend since it's just serving static files.

---

## Step 4: Deploy

1. **Review all settings**
2. **Click "Create Service"**
3. **Monitor the build logs**

### Expected Build Time
- First build: ~3-5 minutes
- Subsequent builds: ~2-3 minutes (with Docker cache)

### Build Process
```
1. Installing dependencies...
2. Building shared-types package...
3. Building React application with Vite...
4. Creating production image with Nginx...
5. Pushing image to registry...
6. Deploying to Northflank...
```

---

## Step 5: Verify Deployment

### 1. Check Build Logs
Look for:
```
✓ built in XXXms
✓ 123 modules transformed
✓ dist/index.html created
```

### 2. Check Runtime Logs
After deployment, you should see:
```
Setting up Basic Auth for user: jade
Runtime config generated:
window.ENV = {
  VITE_GRAPHQL_ENDPOINT: "https://your-backend-url.code.run/graphql"
};
Starting nginx with Basic Auth enabled...
```

### 3. Access the Frontend
Navigate to your frontend URL (shown in Northflank):
```
https://your-frontend-url.northflank.app
```

**You will see a browser authentication prompt:**
- **Username**: `jade` (or your custom AUTH_USERNAME)
- **Password**: `jade2025preview` (or your custom AUTH_PASSWORD)

This protects your pre-GA application from public access and search engine crawlers.

### 4. Open Browser Console
Check that the GraphQL endpoint is correctly configured:
```javascript
console.log(window.ENV.VITE_GRAPHQL_ENDPOINT);
// Should output: "https://your-backend-url.code.run/graphql"
```

### 5. Test GraphQL Connection
Open your browser's Network tab and navigate through the app. You should see GraphQL requests going to your backend.

---

## Troubleshooting

### Build Fails: "Cannot find module '@jade/shared-types'"

**Cause**: Monorepo dependency not found
**Solution**: Verify build context is set to `/` (repository root)

### Runtime Error: "Network error: Failed to fetch"

**Cause**: GraphQL endpoint not configured or CORS issue
**Solution**:
1. Check `VITE_GRAPHQL_ENDPOINT` environment variable
2. Verify backend CORS allows frontend domain
3. Check browser console for actual error

### Blank Page After Deployment

**Cause**: SPA routing not working
**Solution**: Check nginx.conf is properly configured (should be automatic)

### 404 on Page Refresh

**Cause**: Nginx not falling back to index.html
**Solution**: Verify nginx.conf has `try_files $uri $uri/ /index.html;`

---

## Architecture Details

### How Runtime Environment Variables Work

1. **Build Time**:
   - Vite builds the app
   - Static files generated in `dist/`

2. **Container Start**:
   - Docker entrypoint script runs
   - Generates `/usr/share/nginx/html/config.js` with runtime env vars
   - Nginx starts and serves files

3. **Browser Load**:
   - `index.html` loads
   - `config.js` loaded first (injects `window.ENV`)
   - React app reads from `window.ENV` or falls back to build-time env

### Why This Approach?

Vite bundles environment variables at **build time**, making them immutable. This approach allows you to:
- Build once, deploy anywhere
- Change API URLs without rebuilding
- Use the same Docker image across environments (dev, staging, prod)

---

## Updating the Frontend

### Option 1: Auto-Deploy (Recommended)
Northflank automatically rebuilds when you push to GitHub.

### Option 2: Manual Deploy
1. Go to your service in Northflank
2. Click "Redeploy"
3. Monitor build logs

---

## Security Best Practices

✅ **Implemented in this setup:**
- **Basic Authentication** (Pre-GA access control)
- **Bot blocking** via User-Agent filtering
- **robots.txt** to block search engine crawlers
- **X-Robots-Tag** header for additional crawler blocking
- Nginx security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Non-root user
- Minimal Alpine image
- Static file caching with proper headers
- Health checks

⚠️ **Additional recommendations:**
- Enable CDN (Northflank has built-in CDN support)
- Configure custom domain with SSL
- Set up monitoring and alerts
- **Before GA**: Remove Basic Auth from nginx.conf and Dockerfile

---

## Performance Optimization

### Already Configured:
- Gzip compression enabled
- Static asset caching (1 year)
- HTML/config.js no-cache (for updates)
- Nginx sendfile enabled

### Optional Improvements:
- Enable Brotli compression
- Add service worker for offline support
- Implement code splitting for large apps

---

## Removing Basic Auth for GA Launch

When you're ready to make the application publicly available, follow these steps:

### 1. Remove Basic Auth from nginx.conf

Edit [apps/marketplace-frontend/nginx.conf](apps/marketplace-frontend/nginx.conf) and remove:

```nginx
# ===================================================
# PRE-GA ACCESS CONTROL
# ===================================================
# Basic Authentication - remove when ready for public launch
auth_basic "JADE Marketplace - Pre-Release Access";
auth_basic_user_file /etc/nginx/.htpasswd;

# Block common bots and crawlers via User-Agent
if ($http_user_agent ~* (bot|crawler|spider|scraper|curl|wget|python|java|Go-http-client)) {
    return 403;
}
# ===================================================
```

Also remove:
```nginx
# Health check endpoint (bypass auth for monitoring)
location /health {
    auth_basic off;  # <- Remove this line
    ...
}
```

And remove the X-Robots-Tag header:
```nginx
add_header X-Robots-Tag "noindex, nofollow, noarchive, nosnippet" always;  # <- Remove this line
```

### 2. Remove htpasswd from Dockerfile

Edit [apps/marketplace-frontend/Dockerfile](apps/marketplace-frontend/Dockerfile):

Remove `apache2-utils` from:
```dockerfile
RUN apk add --no-cache curl apache2-utils  # Change to: curl only
```

Remove the Basic Auth setup from the entrypoint script (lines about AUTH_USERNAME, AUTH_PASSWORD, htpasswd).

### 3. Update robots.txt

Edit [apps/marketplace-frontend/public/robots.txt](apps/marketplace-frontend/public/robots.txt) to allow crawlers:

```
# JADE Marketplace - Public Release
User-agent: *
Allow: /

# Optional: Block specific paths
# Disallow: /admin
# Disallow: /api
```

### 4. Remove Environment Variables from Northflank

Delete the `AUTH_USERNAME` and `AUTH_PASSWORD` environment variables.

### 5. Deploy Changes

Commit and push the changes - Northflank will automatically rebuild and deploy.

---

## Next Steps

1. **Configure Custom Domain** (Optional)
   - Add domain in Northflank
   - Update DNS records
   - SSL automatically provisioned

2. **Set Up Monitoring**
   - Northflank provides built-in metrics
   - Monitor CPU, Memory, Response times

3. **Configure CI/CD**
   - Already automatic with GitHub integration
   - Add preview deployments for PRs (optional)

---

## Cost Estimation

**Northflank Pricing** (as of 2025):
- Static service: ~$5-10/month
- With CDN: +$5/month
- Custom domain SSL: Free

**Compared to alternatives:**
- Vercel: Free tier available
- Netlify: Free tier available
- AWS S3 + CloudFront: ~$1-5/month

---

## Support

- **Northflank Docs**: https://northflank.com/docs
- **JADE Project Issues**: https://github.com/YetiPanda/jade-spa-marketplace/issues
- **Vite Docs**: https://vitejs.dev/guide/
- **Nginx Docs**: https://nginx.org/en/docs/

---

**Deployment Status**: ⚠️ Ready to deploy (requires backend URL)

**Last Updated**: October 23, 2025
