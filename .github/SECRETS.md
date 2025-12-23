# GitHub Secrets Configuration

This document lists all GitHub secrets required for CI/CD workflows.

## Required Secrets

### Turborepo Remote Caching

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `TURBO_TOKEN` | Turborepo remote cache token | [Vercel Dashboard](https://vercel.com/account/tokens) → Turborepo |
| `TURBO_TEAM` | Turborepo team slug | Vercel Dashboard → Turborepo settings |

### Vercel Deployment

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `VERCEL_TOKEN` | Vercel deployment token | [Vercel Account Settings](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel organization ID | Project Settings → General → Project ID |
| `VERCEL_CURATED_PROJECT_ID` | Curated project ID | Curated project settings |
| `VERCEL_AURA_PROJECT_ID` | Aura project ID | Aura project settings |
| `VERCEL_SANCTUARY_PROJECT_ID` | Sanctuary project ID | Sanctuary project settings |

### Northflank Deployment (Backend)

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `NORTHFLANK_API_TOKEN` | Northflank API token | [Northflank Dashboard](https://app.northflank.com) → API tokens |
| `NORTHFLANK_PROJECT_ID` | Northflank project ID | Project settings |
| `NORTHFLANK_CURATED_SERVICE_ID` | Curated backend service ID | Service settings |

### Application Environment Variables

#### Curated

| Secret | Description | Example |
|--------|-------------|---------|
| `CURATED_API_URL` | Curated API URL | `https://api.curated.jade-beauty.com` |
| `CURATED_GRAPHQL_URL` | GraphQL endpoint URL | `https://api.curated.jade-beauty.com/graphql` |

#### Aura

| Secret | Description | Example |
|--------|-------------|---------|
| `AURA_API_URL` | Aura API URL | `https://api.aura.jade-beauty.com` |

#### Sanctuary

| Secret | Description | Example |
|--------|-------------|---------|
| `SANCTUARY_API_URL` | Sanctuary API URL | `https://api.sanctuary.jade-beauty.com` |

### Code Coverage (Optional)

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `CODECOV_TOKEN` | Codecov upload token | [Codecov.io](https://codecov.io) → Repository settings |

## How to Add Secrets

### GitHub Repository Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Enter the secret name and value
5. Click **Add secret**

### Environment Secrets

For deployment workflows, secrets can also be set at the environment level:

1. Go to **Settings** → **Environments**
2. Create or edit an environment (e.g., `curated-production`)
3. Add environment-specific secrets

**Environments**:
- `curated-production` (for Curated frontend)
- `curated-backend` (for Curated backend)
- `aura-production` (for Aura)
- `sanctuary-production` (for Sanctuary)

## Verification

After adding secrets, verify they work by:

1. **Triggering a workflow manually**:
   - Go to **Actions** tab
   - Select a workflow
   - Click **Run workflow**

2. **Check workflow logs**:
   - Ensure no "secret not found" errors
   - Verify builds complete successfully

3. **Test deployments**:
   - Push to `main` branch
   - Verify deployment succeeds
   - Check deployed app URLs

## Security Best Practices

✅ **DO**:
- Use environment-specific secrets for production
- Rotate tokens regularly (every 90 days)
- Use least-privilege access tokens
- Document secret rotation procedures

❌ **DON'T**:
- Commit secrets to the repository
- Share secrets via insecure channels
- Use production secrets in development
- Log secret values in workflows

## Troubleshooting

### Secret not found error

**Error**: `Secret TURBO_TOKEN not found`

**Solution**: Add the secret in GitHub repository settings

### Deployment fails with 401 Unauthorized

**Error**: `Error: Deployment failed with status 401`

**Solution**:
1. Verify token is correct
2. Check token hasn't expired
3. Ensure token has correct permissions

### Turborepo cache not working

**Error**: Cache always shows "miss"

**Solution**:
1. Verify `TURBO_TOKEN` and `TURBO_TEAM` are set
2. Check Vercel Turborepo dashboard for cache hits
3. Ensure tokens have cache access permissions

## Quick Setup Checklist

- [ ] Add `TURBO_TOKEN` and `TURBO_TEAM`
- [ ] Add Vercel tokens and project IDs
- [ ] Add Northflank API token (if using)
- [ ] Add app-specific environment variables
- [ ] Create GitHub environments
- [ ] Test CI workflow on a PR
- [ ] Test deployment workflow manually
- [ ] Verify deployed apps are accessible

## Support

For help with:
- **Vercel**: https://vercel.com/support
- **Northflank**: https://northflank.com/docs
- **Turborepo**: https://turbo.build/repo/docs/core-concepts/remote-caching
- **GitHub Actions**: https://docs.github.com/en/actions
