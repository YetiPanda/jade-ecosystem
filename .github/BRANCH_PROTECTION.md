# Branch Protection Rules

This document describes the branch protection rules that should be configured for the JADE ecosystem repository.

## Overview

Branch protection rules enforce code quality standards, ensure proper review processes, and prevent accidental changes to critical branches.

## Protected Branches

### `main` Branch

The `main` branch is the primary production branch. All production deployments are triggered from this branch.

**Protection Rules**:

#### Required Reviews
- **Require pull request reviews before merging**: ✅ Enabled
- **Required number of approvals**: 2
- **Dismiss stale pull request approvals when new commits are pushed**: ✅ Enabled
- **Require review from Code Owners**: ✅ Enabled
  - Uses `.github/CODEOWNERS` file
  - Automatically requests reviews from appropriate teams
- **Restrict who can dismiss pull request reviews**: ✅ Enabled
  - Only @jade-team/maintainers can dismiss reviews

#### Status Checks
- **Require status checks to pass before merging**: ✅ Enabled
- **Require branches to be up to date before merging**: ✅ Enabled

**Required Status Checks** (from `.github/workflows/ci.yml`):
- `lint` - ESLint and Prettier checks
- `typecheck` - TypeScript type checking
- `build` - Build all packages and apps
- `test` - Run all tests

#### Additional Protections
- **Require conversation resolution before merging**: ✅ Enabled
  - All PR comments must be resolved
- **Require signed commits**: ⚠️ Recommended (optional)
  - Ensures commit authenticity
- **Require linear history**: ✅ Enabled
  - Prevents merge commits
  - Enforces rebase or squash merges
- **Allow force pushes**: ❌ Disabled
  - Prevents rewriting history
- **Allow deletions**: ❌ Disabled
  - Prevents accidental branch deletion

#### Merge Options
- **Allow merge commits**: ❌ Disabled
- **Allow squash merging**: ✅ Enabled (recommended)
  - Creates clean linear history
  - Single commit per feature
- **Allow rebase merging**: ✅ Enabled
  - Preserves commit history when needed

#### Administrative Overrides
- **Do not allow bypassing the above settings**: ✅ Enabled
  - Even admins must follow the rules
- **Exceptions**: Only for emergency hotfixes with incident commander approval

---

### `develop` Branch (If Using Gitflow)

If using Gitflow workflow, protect the `develop` branch similarly to `main`.

**Protection Rules**:
- Required reviews: 1 approval (less strict than main)
- Required status checks: Same as main
- Require branches to be up to date: ✅ Enabled
- Allow force pushes: ❌ Disabled

---

## Feature Branch Requirements

Feature branches don't have protection rules but must follow naming conventions:

### Branch Naming Convention
```
feature/[number]-[short-description]
bugfix/[issue-number]-[short-description]
hotfix/[issue-number]-[short-description]
```

**Examples**:
- `feature/011-vendor-portal`
- `feature/012-ecosystem-separation`
- `bugfix/123-fix-order-calculation`
- `hotfix/456-critical-auth-issue`

### Branch Lifecycle
1. Create feature branch from `main`
2. Develop and commit changes
3. Open pull request to `main`
4. Pass all status checks
5. Get required approvals
6. Merge (squash or rebase)
7. Delete feature branch automatically

---

## Setting Up Branch Protection

### GitHub UI Configuration

1. **Navigate to Settings**
   - Go to repository on GitHub
   - Click **Settings** tab
   - Click **Branches** in left sidebar

2. **Add Branch Protection Rule**
   - Click **Add rule** button
   - Enter branch name pattern: `main`

3. **Configure Protection Settings**

   **Pull Request Requirements**:
   - ✅ Require a pull request before merging
   - Required approvals: `2`
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require review from Code Owners

   **Status Check Requirements**:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date before merging
   - Search and add required checks:
     - `lint`
     - `typecheck`
     - `build`
     - `test`

   **Additional Rules**:
   - ✅ Require conversation resolution before merging
   - ✅ Require linear history
   - ❌ Allow force pushes
   - ❌ Allow deletions

   **Merge Options** (Repository Settings → General):
   - ❌ Allow merge commits
   - ✅ Allow squash merging
   - ✅ Allow rebase merging
   - ✅ Automatically delete head branches

4. **Save Changes**
   - Click **Create** or **Save changes**

### Verification

After setting up, verify by:

1. **Test with a Draft PR**:
   ```bash
   git checkout -b test/branch-protection
   echo "test" > test.txt
   git add test.txt
   git commit -m "test: branch protection"
   git push origin test/branch-protection
   ```

2. **Open Pull Request**:
   - Navigate to GitHub
   - Open PR to `main`
   - Mark as draft initially

3. **Verify Checks**:
   - ✅ Status checks appear
   - ✅ Required reviewers requested
   - ✅ Merge button disabled until checks pass
   - ✅ 2 approvals required

4. **Clean Up**:
   ```bash
   git push origin --delete test/branch-protection
   git checkout main
   git branch -D test/branch-protection
   ```

---

## Status Check Configuration

Status checks come from `.github/workflows/ci.yml`:

```yaml
name: CI

on:
  pull_request:
  push:
    branches: [main]

jobs:
  lint:
    name: Lint
    # Runs ESLint and Prettier

  typecheck:
    name: Type Check
    # Runs TypeScript compiler

  build:
    name: Build
    # Builds all packages and apps

  test:
    name: Test
    # Runs all test suites
```

### Adding New Required Checks

To add a new required status check:

1. Add job to `.github/workflows/ci.yml`
2. Wait for job to run at least once
3. Add job name to branch protection required checks
4. Update this documentation

---

## Deployment Protection

Deployment workflows use GitHub Environments for additional protection.

### Environment Configuration

**Environments**:
- `curated-production`
- `curated-backend`
- `aura-production`
- `sanctuary-production`

**Environment Protection Rules** (Settings → Environments):

1. **Required Reviewers**:
   - Add: @jade-team/devops
   - Add: @jade-team/maintainers
   - Approvals required: 1

2. **Wait Timer** (optional):
   - 5 minutes for automated testing
   - Allows time to cancel if needed

3. **Deployment Branches**:
   - Only `main` branch
   - Prevents deploying from feature branches

### Setting Up Environment Protection

1. Go to **Settings** → **Environments**
2. Click on environment name (e.g., `curated-production`)
3. Configure protection rules:
   - ✅ Required reviewers: @jade-team/devops
   - ✅ Wait timer: 5 minutes (optional)
   - ✅ Deployment branches: Only main
4. Save

---

## Code Owner Configuration

The `.github/CODEOWNERS` file defines automatic reviewer assignment.

### How It Works

1. Developer opens PR
2. GitHub analyzes changed files
3. Automatically requests reviews from code owners
4. PR cannot merge without code owner approval

### CODEOWNERS Structure

```
# Global ownership
* @jade-team/maintainers

# CI/CD and Infrastructure
/.github/ @jade-team/devops

# Shared Packages
/packages/ @jade-team/platform
/packages/jade-ui/ @jade-team/design @jade-team/frontend

# Applications
/apps/curated/ @jade-team/curated
/apps/aura/ @jade-team/aura
/apps/sanctuary/ @jade-team/sanctuary
```

### Updating Code Owners

1. Edit `.github/CODEOWNERS`
2. Follow the pattern: `path @team-name`
3. Commit and push
4. Takes effect immediately

---

## Emergency Procedures

### Hotfix Process

For critical production issues:

1. **Create Hotfix Branch**:
   ```bash
   git checkout main
   git pull
   git checkout -b hotfix/[issue-number]-[description]
   ```

2. **Make Minimal Fix**:
   - Only change what's necessary
   - Add regression tests
   - Document in PR using `hotfix.md` template

3. **Fast-Track Review**:
   - Use `hotfix.md` PR template
   - Tag incident commander
   - Request expedited review
   - Minimum 1 approval (instead of 2)

4. **Deploy**:
   - Merge to `main`
   - Monitor deployment closely
   - Update incident tracking

5. **Follow-Up**:
   - Create post-mortem issue
   - Schedule root cause analysis
   - Plan permanent fix if needed

### Breaking Glass

For extreme emergencies only:

1. **Incident Commander Authorization Required**
2. **Document Decision**:
   - Create incident issue
   - Explain why normal process bypassed
   - Document actions taken

3. **Post-Incident**:
   - Immediate post-mortem
   - Update runbooks
   - Improve safeguards

---

## Team Configuration

### Required Teams

Create these teams in GitHub organization:

| Team | Purpose | Members |
|------|---------|---------|
| @jade-team/maintainers | Overall codebase ownership | Tech leads, architects |
| @jade-team/devops | CI/CD and infrastructure | DevOps engineers |
| @jade-team/platform | Shared packages and tooling | Platform engineers |
| @jade-team/frontend | Frontend architecture | Frontend leads |
| @jade-team/backend | Backend services | Backend leads |
| @jade-team/design | UI/UX and design system | Design team |
| @jade-team/curated | Curated marketplace | Curated product team |
| @jade-team/aura | Aura spa dashboard | Aura product team |
| @jade-team/sanctuary | Sanctuary community | Sanctuary product team |
| @jade-team/data | Data and AI | Data engineers, ML engineers |
| @jade-team/ai | AI and ontology | AI/ML specialists |

### Creating Teams

1. Go to Organization **Settings** → **Teams**
2. Click **New team**
3. Enter team name (e.g., `maintainers`)
4. Set visibility: **Visible**
5. Add members
6. Set permissions:
   - Read for most teams
   - Write for maintainers
   - Admin for DevOps (limited)

---

## Troubleshooting

### Status Check Not Appearing

**Problem**: Required status check doesn't show up

**Solution**:
1. Verify workflow runs on pull requests
2. Check workflow job name matches exactly
3. Wait for at least one successful run
4. Re-add to branch protection rules

### Can't Merge Despite Approvals

**Problem**: Merge button disabled despite having approvals

**Solutions**:
- Check all status checks are passing (green)
- Ensure branch is up to date with main
- Verify all conversations are resolved
- Check if Code Owners have approved

### Code Owner Not Requested

**Problem**: Code owner not automatically requested for review

**Solutions**:
- Verify CODEOWNERS file syntax
- Check team names match exactly (including @)
- Ensure code owner has repository access
- Refresh the PR page

### Linear History Violation

**Problem**: Can't merge due to linear history requirement

**Solution**:
```bash
# Update your branch with rebase
git checkout your-feature-branch
git fetch origin
git rebase origin/main

# Resolve any conflicts
# Then force push (only to feature branch!)
git push --force-with-lease
```

---

## Best Practices

### For Developers

1. **Keep Branches Updated**:
   - Regularly rebase on main
   - Resolve conflicts early
   - Don't let branches get stale

2. **Small, Focused PRs**:
   - One feature per PR
   - Easier to review
   - Faster to merge

3. **Write Good Descriptions**:
   - Use PR templates
   - Link to issues/specs
   - Explain the "why"

4. **Respond to Reviews**:
   - Address feedback promptly
   - Explain your reasoning
   - Mark conversations resolved

### For Reviewers

1. **Timely Reviews**:
   - Review within 24 hours
   - Unblock teammates quickly
   - Use draft PRs for WIP

2. **Constructive Feedback**:
   - Be specific
   - Suggest alternatives
   - Approve when good enough

3. **Check Against Specs**:
   - Verify acceptance criteria
   - Check task completion
   - Validate test coverage

---

## Maintenance

### Quarterly Review

Every 3 months, review:
- Are protection rules still appropriate?
- Are required checks still relevant?
- Are teams properly configured?
- Are there recurring issues?

### Updates

When updating branch protection:
1. Document changes in this file
2. Announce to team
3. Update training materials
4. Monitor for issues

---

## References

- [GitHub Branch Protection Documentation](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [GitHub Code Owners Documentation](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [GitHub Environments Documentation](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment)

---

**Last Updated**: December 23, 2025
**Owner**: @jade-team/devops
