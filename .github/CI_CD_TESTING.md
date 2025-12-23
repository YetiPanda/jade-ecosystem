# CI/CD Testing Guide

This guide explains how to test GitHub Actions workflows for the JADE ecosystem.

## Table of Contents

- [Overview](#overview)
- [Pre-Testing Setup](#pre-testing-setup)
- [Testing CI Workflow](#testing-ci-workflow)
- [Testing Deployment Workflows](#testing-deployment-workflows)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Overview

The JADE ecosystem uses GitHub Actions for:
- **Continuous Integration**: Automated testing on all PRs
- **Continuous Deployment**: Automated deployment to Vercel and Northflank

### Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| `ci.yml` | PR, push to main | Lint, typecheck, build, test |
| `deploy-curated.yml` | Push to main (Curated changes) | Deploy Curated to production |
| `deploy-aura.yml` | Push to main (Aura changes) | Deploy Aura to production |
| `deploy-sanctuary.yml` | Push to main (Sanctuary changes) | Deploy Sanctuary to production |

---

## Pre-Testing Setup

### 1. Verify Secrets Are Configured

Before testing any workflows, ensure all required secrets are set up.

#### Check Required Secrets

Go to **Settings** → **Secrets and variables** → **Actions** and verify:

**Turborepo** (required for all workflows):
- [ ] `TURBO_TOKEN`
- [ ] `TURBO_TEAM`

**Vercel** (required for deployment workflows):
- [ ] `VERCEL_TOKEN`
- [ ] `VERCEL_ORG_ID`
- [ ] `VERCEL_CURATED_PROJECT_ID`
- [ ] `VERCEL_AURA_PROJECT_ID`
- [ ] `VERCEL_SANCTUARY_PROJECT_ID`

**Northflank** (required for Curated backend):
- [ ] `NORTHFLANK_API_TOKEN`
- [ ] `NORTHFLANK_PROJECT_ID`
- [ ] `NORTHFLANK_CURATED_SERVICE_ID`

**Application Environment Variables**:
- [ ] `CURATED_API_URL`
- [ ] `CURATED_GRAPHQL_URL`
- [ ] `AURA_API_URL`
- [ ] `SANCTUARY_API_URL`

> See [`.github/SECRETS.md`](.github/SECRETS.md) for detailed setup instructions.

### 2. Verify GitHub Environments

Go to **Settings** → **Environments** and verify these environments exist:

- [ ] `curated-production`
- [ ] `curated-backend`
- [ ] `aura-production`
- [ ] `sanctuary-production`

Each should have:
- Required reviewers: `@jade-team/devops`
- Deployment branches: Only `main`

### 3. Local Testing

Before pushing to GitHub, test locally:

```bash
# Install dependencies
pnpm install

# Run linting
pnpm lint

# Run type checking
pnpm typecheck

# Build all packages and apps
pnpm build

# Run tests
pnpm test
```

All commands should pass before pushing.

---

## Testing CI Workflow

The CI workflow runs on all pull requests and pushes to `main`.

### Test Method 1: Create a Test PR

This is the recommended method for testing CI without affecting production.

#### Step 1: Create Test Branch

```bash
# Create a test branch from main
git checkout main
git pull
git checkout -b test/ci-workflow

# Make a trivial change
echo "# CI Test" > TEST.md
git add TEST.md
git commit -m "test: verify CI workflow"

# Push to remote
git push origin test/ci-workflow
```

#### Step 2: Open Pull Request

1. Go to GitHub repository
2. Click **Pull requests** → **New pull request**
3. Base: `main`, Compare: `test/ci-workflow`
4. Click **Create pull request**
5. Mark as **Draft** initially

#### Step 3: Monitor Workflow

1. Go to **Actions** tab
2. Find your workflow run
3. Click on the run to see details

**Expected Results**:
- ✅ All 4 jobs appear: `lint`, `typecheck`, `build`, `test`
- ✅ Jobs run in parallel
- ✅ All jobs complete successfully (green checkmarks)
- ✅ Total run time: 3-5 minutes

#### Step 4: Verify Each Job

Click on each job to verify:

**Lint Job**:
```
✓ Checkout code
✓ Setup Node.js
✓ Setup pnpm
✓ Get pnpm store directory
✓ Setup pnpm cache
✓ Install dependencies
✓ Run linter
```

**Typecheck Job**:
```
✓ Checkout code
✓ Setup Node.js
✓ Setup pnpm
✓ Get pnpm store directory
✓ Setup pnpm cache
✓ Install dependencies
✓ Run type checking
```

**Build Job**:
```
✓ Checkout code
✓ Setup Node.js
✓ Setup pnpm
✓ Setup Turborepo cache
✓ Install dependencies
✓ Build all packages and apps
✓ Upload build artifacts
```

**Test Job**:
```
✓ Checkout code
✓ Setup Node.js
✓ Setup pnpm
✓ Install dependencies
✓ Download build artifacts
✓ Run tests
✓ Upload coverage reports (if configured)
```

#### Step 5: Verify Turborepo Caching

On the **second run**, verify caching is working:

```bash
# Make another trivial change
echo "# CI Test 2" >> TEST.md
git add TEST.md
git commit -m "test: verify turborepo cache"
git push
```

In the new workflow run, check build job logs for:
```
✓ Setup Turborepo cache
  Cache hit: true
```

Build time should be significantly faster (30-60% reduction).

#### Step 6: Cleanup

```bash
# Close the PR without merging
# Then delete the branch
git checkout main
git branch -D test/ci-workflow
git push origin --delete test/ci-workflow
```

### Test Method 2: Manual Workflow Dispatch

Some workflows support manual triggering.

#### Step 1: Trigger Workflow

1. Go to **Actions** tab
2. Select **CI** workflow
3. Click **Run workflow** dropdown
4. Select branch: `main`
5. Click **Run workflow**

#### Step 2: Monitor

Same as Test Method 1, Step 3-4.

---

## Testing Deployment Workflows

**⚠️ WARNING**: Deployment workflows deploy to production. Test carefully.

### Safe Testing Approach

Use `workflow_dispatch` to trigger deployments manually without pushing to main.

### Test Curated Deployment

#### Prerequisites

- [ ] All secrets configured
- [ ] Environments configured with required approvals
- [ ] You have approval from `@jade-team/devops`

#### Step 1: Prepare Test Changes

```bash
# Create test branch
git checkout main
git pull
git checkout -b test/deploy-curated

# Make a trivial change in Curated app
echo "// Test comment" >> apps/curated/marketplace-frontend/src/main.tsx
git add .
git commit -m "test: curated deployment"
git push origin test/deploy-curated
```

#### Step 2: Trigger Workflow

1. Go to **Actions** tab
2. Select **Deploy Curated** workflow
3. Click **Run workflow**
4. Select branch: `test/deploy-curated`
5. Click **Run workflow**

#### Step 3: Monitor Workflow

Watch for two jobs:
1. **Deploy Curated Frontend**
2. **Deploy Curated Backend**

**Frontend Job Expected Steps**:
```
✓ Checkout code
✓ Setup Node.js
✓ Setup pnpm
✓ Install dependencies
✓ Build Curated frontend
⏳ Waiting for required approvals... (if environment protection enabled)
✓ Deploy to Vercel
✓ Notify deployment
```

**Backend Job Expected Steps**:
```
✓ Checkout code
✓ Setup Node.js
✓ Setup pnpm
✓ Install dependencies
✓ Build Curated backend
⏳ Waiting for required approvals... (if environment protection enabled)
✓ Deploy to Northflank
```

#### Step 4: Approve Deployment (If Required)

If environment protection is enabled:

1. Workflow will pause at deployment step
2. Notification sent to required approvers
3. Go to workflow run page
4. Click **Review deployments**
5. Select environments to approve
6. Click **Approve and deploy**

#### Step 5: Verify Deployment

**Verify Frontend**:
1. Wait for deployment to complete
2. Visit: https://curated.jade-beauty.com
3. Check browser console for errors
4. Verify app loads correctly

**Verify Backend**:
1. Wait for deployment to complete
2. Visit: https://api.curated.jade-beauty.com/graphql
3. Verify GraphQL playground loads
4. Run a test query

**Check Vercel Dashboard**:
1. Go to Vercel dashboard
2. Find Curated project
3. Verify new deployment appears
4. Check deployment logs

**Check Northflank Dashboard**:
1. Go to Northflank dashboard
2. Find Curated service
3. Verify new deployment appears
4. Check service logs

#### Step 6: Rollback (If Needed)

If deployment causes issues:

**Rollback Vercel**:
1. Go to Vercel dashboard
2. Find previous deployment
3. Click **Promote to Production**

**Rollback Northflank**:
1. Go to Northflank dashboard
2. Find previous deployment
3. Click **Redeploy**

#### Step 7: Cleanup

```bash
git checkout main
git branch -D test/deploy-curated
git push origin --delete test/deploy-curated
```

### Test Aura Deployment

Similar to Curated, but simpler (frontend only):

```bash
# Create test branch
git checkout -b test/deploy-aura

# Make trivial change
echo "// Test" >> apps/aura/spa-dashboard/src/main.tsx
git add .
git commit -m "test: aura deployment"
git push origin test/deploy-aura

# Trigger workflow manually
# Go to Actions → Deploy Aura → Run workflow
```

**Verify**:
- Visit: https://aura.jade-beauty.com
- Check Vercel dashboard

### Test Sanctuary Deployment

Similar to Aura:

```bash
# Create test branch
git checkout -b test/deploy-sanctuary

# Make trivial change
echo "// Test" >> apps/sanctuary/community-frontend/src/main.tsx
git add .
git commit -m "test: sanctuary deployment"
git push origin test/deploy-sanctuary

# Trigger workflow manually
# Go to Actions → Deploy Sanctuary → Run workflow
```

**Verify**:
- Visit: https://sanctuary.jade-beauty.com
- Check Vercel dashboard

---

## Troubleshooting

### Common Issues

#### Issue 1: Workflow Not Triggering

**Symptoms**:
- Push to branch, no workflow appears in Actions tab

**Possible Causes**:
1. Path filters don't match changed files
2. Branch name doesn't match trigger
3. Workflow file has syntax errors

**Solutions**:

**Check Path Filters**:
```bash
# For Curated deployment to trigger, you must change files in:
apps/curated/**
packages/**
pnpm-lock.yaml

# For Aura deployment:
apps/aura/**
packages/jade-ui/**
packages/feature-flags/**
pnpm-lock.yaml

# For Sanctuary deployment:
apps/sanctuary/**
packages/jade-ui/**
packages/feature-flags/**
pnpm-lock.yaml
```

**Check Branch**:
- Deployment workflows only trigger on `main` branch
- CI workflow triggers on all branches

**Validate Workflow**:
```bash
# Use GitHub's workflow validation
# Go to Actions → Select workflow → Edit
# GitHub will show syntax errors
```

#### Issue 2: Build Fails

**Symptoms**:
- Build job fails with compilation errors

**Common Causes**:
1. TypeScript errors
2. Missing dependencies
3. Environment variables not set

**Solutions**:

**Fix TypeScript Errors**:
```bash
# Run typecheck locally
pnpm typecheck

# Fix all type errors before pushing
```

**Fix Dependencies**:
```bash
# Ensure lockfile is committed
pnpm install
git add pnpm-lock.yaml
git commit -m "chore: update lockfile"
```

**Check Environment Variables**:
```yaml
# In workflow file, verify all required env vars
env:
  TURBO_TOKEN: ${{ secrets.TURBO_TOKEN }}
  TURBO_TEAM: ${{ secrets.TURBO_TEAM }}
  VITE_API_URL: ${{ secrets.CURATED_API_URL }}
```

#### Issue 3: Cache Not Working

**Symptoms**:
- Build takes same time every run
- Cache hit: false in logs

**Solutions**:

**Verify Turbo Secrets**:
```bash
# Check secrets are set
# Settings → Secrets → Actions
# TURBO_TOKEN and TURBO_TEAM must exist
```

**Check Turbo Config**:
```json
// turbo.json
{
  "remoteCache": {
    "signature": true
  }
}
```

**Clear Cache** (if corrupted):
1. Go to Actions tab
2. Click **Caches** in sidebar
3. Delete corrupted caches

#### Issue 4: Deployment Stuck on Approval

**Symptoms**:
- Workflow waits indefinitely for approval

**Solutions**:

1. **Check Environment Protection**:
   - Settings → Environments → [environment]
   - Verify required reviewers are correct
   - Ensure reviewers have repository access

2. **Approve Deployment**:
   - Go to workflow run
   - Click **Review deployments**
   - Select environments
   - Click **Approve and deploy**

3. **Bypass (Emergency Only)**:
   - Settings → Environments → [environment]
   - Temporarily remove required reviewers
   - Re-enable after emergency

#### Issue 5: Vercel Deployment Fails

**Symptoms**:
- Deploy to Vercel step fails with 401 or 404

**Solutions**:

**Verify Vercel Secrets**:
```bash
# All must be set:
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_CURATED_PROJECT_ID  # or AURA/SANCTUARY
```

**Get Project ID**:
1. Go to Vercel dashboard
2. Select project
3. Settings → General
4. Copy Project ID

**Verify Token**:
1. Go to Vercel account settings
2. Tokens section
3. Create new token if expired
4. Update GitHub secret

#### Issue 6: Northflank Deployment Fails

**Symptoms**:
- Deploy to Northflank step fails

**Solutions**:

**Verify Northflank Secrets**:
```bash
NORTHFLANK_API_TOKEN
NORTHFLANK_PROJECT_ID
NORTHFLANK_CURATED_SERVICE_ID
```

**Get Service ID**:
1. Go to Northflank dashboard
2. Select project
3. Select service
4. Copy service ID from URL or settings

**Test API Token**:
```bash
curl -X GET "https://api.northflank.com/v1/projects" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Should return list of projects
```

#### Issue 7: Tests Failing in CI But Pass Locally

**Symptoms**:
- Tests pass locally but fail in CI

**Common Causes**:
1. Environment differences
2. Missing environment variables
3. Timing issues
4. File system differences

**Solutions**:

**Match CI Environment**:
```bash
# Use same Node version as CI
nvm use 20

# Use same package manager version
pnpm --version  # Should match CI

# Clear caches
pnpm store prune
rm -rf node_modules
pnpm install
```

**Check Test Logs**:
- Download test artifacts from workflow run
- Check detailed error messages
- Look for timing/race conditions

**Add Debug Logging**:
```yaml
# In workflow file
- name: Run tests
  run: pnpm test
  env:
    DEBUG: '*'  # Enable debug mode
```

---

## Best Practices

### 1. Test Before Merging

Always verify CI passes before merging:

```bash
# Open draft PR
# Wait for CI to pass
# Request reviews
# Merge only when green
```

### 2. Monitor Deployments

After merging to main:

1. Watch deployment workflow
2. Verify successful completion
3. Check deployed app
4. Monitor error rates for 30 minutes

### 3. Use Feature Flags

For risky changes:

```typescript
import { FeatureFlagsManager } from '@jade/feature-flags';

const flags = FeatureFlagsManager.fromEnvironment();

if (flags.isFeatureEnabled('new-feature')) {
  // New code
} else {
  // Old code
}
```

Deploy feature flag off, then enable gradually.

### 4. Staged Rollouts

For major changes:

1. Deploy to staging first (if available)
2. Test thoroughly
3. Deploy to production
4. Monitor closely
5. Have rollback plan ready

### 5. Workflow Optimization

**Speed Up CI**:
- Keep dependencies updated
- Use Turborepo caching
- Run jobs in parallel
- Cache node_modules

**Reduce Deployment Time**:
- Use path filtering
- Only deploy changed apps
- Optimize build process

### 6. Documentation

Document all changes:

```bash
# Good commit message
feat(curated): add product filtering

- Implement filter by category
- Add filter UI components
- Update GraphQL queries

Refs: #123
```

### 7. Security

**Protect Secrets**:
- Never log secret values
- Rotate tokens regularly
- Use environment-specific secrets
- Review secret access periodically

**Review Workflows**:
```yaml
# Always use specific versions
uses: actions/checkout@v4  # ✓ Good
uses: actions/checkout@main  # ✗ Bad (unpredictable)
```

---

## Testing Checklist

Use this checklist when setting up or modifying CI/CD:

### Initial Setup
- [ ] All secrets configured
- [ ] All environments created
- [ ] Required approvers added
- [ ] Branch protection enabled
- [ ] CODEOWNERS file created

### Before First Deployment
- [ ] Test CI workflow with draft PR
- [ ] Verify all jobs pass
- [ ] Check Turborepo caching works
- [ ] Test deployment to staging (if available)
- [ ] Verify rollback process works

### Regular Testing
- [ ] CI passes on all PRs
- [ ] Deployments complete successfully
- [ ] Apps load correctly after deployment
- [ ] No errors in production logs
- [ ] Caching working efficiently

### After Changes
- [ ] Test modified workflows
- [ ] Update documentation
- [ ] Notify team of changes
- [ ] Monitor first few runs

---

## Resources

### GitHub Actions Documentation
- [Workflow syntax](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions)
- [Environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)
- [Caching dependencies](https://docs.github.com/en/actions/using-workflows/caching-dependencies-to-speed-up-workflows)

### Platform Documentation
- [Vercel deployments](https://vercel.com/docs/deployments/overview)
- [Northflank API](https://northflank.com/docs/v1/api)
- [Turborepo remote caching](https://turbo.build/repo/docs/core-concepts/remote-caching)

### Internal Documentation
- [SECRETS.md](.github/SECRETS.md) - Secret configuration
- [BRANCH_PROTECTION.md](.github/BRANCH_PROTECTION.md) - Branch rules
- [CODEOWNERS](.github/CODEOWNERS) - Code ownership

---

## Getting Help

### Workflow Failures

1. Check workflow logs for errors
2. Search GitHub Actions documentation
3. Review this guide
4. Ask in #devops channel
5. Create issue with `ci/cd` label

### Deployment Issues

1. Check deployment logs
2. Verify secrets are correct
3. Test deployment manually
4. Review platform status pages
5. Contact platform support if needed

### Emergency Support

For production incidents:
1. Alert incident commander
2. Check #incidents channel
3. Follow hotfix process
4. Document in post-mortem

---

**Last Updated**: December 23, 2025
**Maintained by**: @jade-team/devops
