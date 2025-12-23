# CLAUDE.md - Project Instructions for Claude Code

# JADE Ecosystem - Monorepo Architecture

> **This file is automatically read by Claude Code at the start of each session.**

---

## 🎯 Current Status

**Repository**: JADE Ecosystem Monorepo
**Primary Branch**: `main`
**Active Feature**: Feature 011 - Vendor Portal MVP
**Last Major Milestone**: Feature 012 - Ecosystem Separation ✅ COMPLETED (Dec 23, 2025)

---

## Project Overview

The JADE Ecosystem is a unified monorepo containing three independently deployable applications serving the professional skincare industry:

### Applications

1. **🛒 Curated by Jade** (`apps/curated/`)
   - B2B wholesale marketplace connecting spas with premium skincare vendors
   - Marketplace frontend (Vite + React + TypeScript)
   - Vendor portal (Vite + React + TypeScript)
   - Vendure backend (Node.js + PostgreSQL)
   - **Status**: Active development
   - **URL**: https://curated.jade-beauty.com

2. **✨ Aura by Jade** (`apps/aura/`)
   - Spa operations platform and management dashboard
   - Treatment protocol builder, client booking system
   - **Status**: Scaffold phase
   - **URL**: https://aura.jade-beauty.com

3. **🏛️ Spa-ce Sanctuary** (`apps/sanctuary/`)
   - Professional community with discussion forums
   - Educational content platform and certification tracking
   - **Status**: Scaffold phase
   - **URL**: https://sanctuary.jade-beauty.com

### Shared Packages

- **@jade/ui**: Design system and component library (production-ready)
- **@jade/feature-flags**: Runtime feature flag management (production-ready)
- **@jade/ska-ontology**: Semantic Knowledge Atoms for AI governance (production-ready)
- **@jade/vector-db**: Vector database integration (active development)
- **@jade/shared-types**: Shared TypeScript types and GraphQL schemas (active development)

---

## Quick Start for Claude Code

### 1. Read the Specs First

Before making ANY code changes, read these files in order:

```
# Core Documentation
README.md                       # Project overview and quick start
CONTRIBUTING.md                 # Contribution guidelines
CONSTITUTION.md                 # Governance framework
DEVELOPMENT.md                  # Development workflow guide

# Active Feature Specs
specs/011-vendor-portal/spec.md                    # Full specification
specs/011-vendor-portal/plan.md                    # 14-week roadmap
specs/011-vendor-portal/tasks.md                   # 171 tasks with acceptance criteria
specs/011-vendor-portal/contracts/vendor.graphql   # Vendor-facing GraphQL API
```

### 2. Current Active Work: Feature 011 - Vendor Portal MVP

**Status**: Phase A - Foundation (ACTIVE)
**Current Sprint**: A.1 - Vendor Profile Schema
**Branch**: `feature/011-vendor-portal`

**Active Tasks** (from `specs/011-vendor-portal/tasks.md`):

Sprint A.1 tasks focus on creating the vendor profile database schema, including:
- VendorProfile TypeORM entity with brand identity fields
- VendorValue enum with 25 value types
- VendorCertification entity with 13 certification types
- Database migrations and Zod validation schemas
- Unit tests for profile entities

**Sprint A.1 Total**: 26 hours / 12 tasks

### 3. Feature 012 Completion Summary

**Feature 012: Ecosystem Separation** was successfully completed on December 23, 2025.

**Delivered**:
- ✅ Monorepo structure with Turborepo and pnpm workspaces
- ✅ Three independently deployable applications
- ✅ Shared component library (@jade/ui)
- ✅ Feature flag system (@jade/feature-flags)
- ✅ Complete CI/CD infrastructure with GitHub Actions
- ✅ Branch protection and code ownership policies
- ✅ Comprehensive documentation and testing guides

**Key Files Created**:
- `.github/workflows/ci.yml` - Continuous integration
- `.github/workflows/deploy-*.yml` - Deployment pipelines
- `.github/CODEOWNERS` - Code ownership
- `.github/BRANCH_PROTECTION.md` - Branch protection setup
- `.github/CI_CD_TESTING.md` - CI/CD testing guide
- `.github/SECRETS.md` - Secrets configuration
- `CONTRIBUTING.md` - Contribution guidelines
- `DEVELOPMENT.md` - Development workflow

---

## Constitutional Constraints (MUST FOLLOW)

### Article VIII: UI Stability Protection

**The UI is immutable.** Backend services MUST adapt to existing UI contracts.

- Never modify existing component prop interfaces
- GraphQL changes must be additive only (no breaking changes)
- New fields require 2-week deprecation notice before removal

### Article IX: Package Contract Stability

**Follow semantic versioning strictly**:
- Patch (0.0.x): Bug fixes only
- Minor (0.x.0): New features, backward compatible
- Major (x.0.0): Breaking changes (requires approval)

### Article III: Test-Driven Development

- Write tests BEFORE implementation
- Minimum 80% coverage for new code
- All acceptance criteria must have corresponding tests

### SPECKIT Methodology

- All work must trace back to tasks in `tasks.md`
- Update implementation progress as tasks complete
- Document deviations in spec.md

---

## Architecture Context

### Current Stack

```
Frontend: React 18 + Vite + TypeScript + Apollo GraphQL
Backend:  Vendure e-commerce framework (Curated only)
Database: PostgreSQL (with pgvector for Curated)
Hosting:  Vercel (frontends) + Northflank (Curated backend)
CI/CD:    GitHub Actions with Turborepo caching
```

### Repository Structure

```
jade-ecosystem/
├── apps/
│   ├── curated/              # Curated marketplace applications
│   │   ├── marketplace-frontend/
│   │   ├── vendor-portal/
│   │   └── vendure-backend/
│   ├── aura/                 # Aura spa operations
│   │   └── spa-dashboard/
│   └── sanctuary/            # Sanctuary community
│       └── community-frontend/
│
├── packages/                 # Shared libraries
│   ├── ska-ontology/         # @jade/ska-ontology
│   ├── vector-db/            # @jade/vector-db
│   ├── jade-ui/              # @jade/ui
│   ├── feature-flags/        # @jade/feature-flags
│   └── shared-types/         # @jade/shared-types
│
├── specs/                    # SPECKIT specifications
│   ├── 010-ska-mach-evolution/
│   ├── 011-vendor-portal/
│   └── 012-ecosystem-separation/
│
├── .github/                  # CI/CD and governance
│   ├── workflows/
│   ├── CODEOWNERS
│   ├── BRANCH_PROTECTION.md
│   ├── CI_CD_TESTING.md
│   └── SECRETS.md
│
├── CONSTITUTION.md           # Governance framework
├── CONTRIBUTING.md           # Contribution guide
├── DEVELOPMENT.md            # Development workflow
└── README.md                 # Project overview
```

---

## Working with This Project

### Development Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev                                    # Start all apps
pnpm dev --filter=curated-marketplace-frontend  # Start specific app

# Building
pnpm build                                  # Build all packages and apps
pnpm build --filter=@jade/ui                # Build specific package

# Testing
pnpm test                                   # Run all tests
pnpm test --filter=@jade/ui                 # Test specific package
pnpm test:watch                             # Watch mode

# Quality Checks
pnpm lint                                   # Lint all code
pnpm lint:fix                               # Auto-fix linting issues
pnpm typecheck                              # TypeScript type checking
```

### Branch Strategy

```bash
# Feature branches
git checkout -b feature/[number]-[description]

# Bug fixes
git checkout -b bugfix/[issue]-[description]

# Hotfixes
git checkout -b hotfix/[issue]-[description]
```

**Examples**:
- `feature/011-vendor-portal`
- `bugfix/456-fix-order-total`
- `hotfix/789-critical-auth-bug`

### Commit Convention

```
<type>(<scope>): <description>

[optional body]

Refs: #issue-number
```

**Examples**:
```bash
git commit -m "feat(vendor-portal): add analytics dashboard

- Implement revenue chart component
- Add order metrics display

Refs: #123"

git commit -m "fix(curated): resolve order total calculation

Fixes: #456"
```

---

## CI/CD Infrastructure

### Continuous Integration

**Workflow**: `.github/workflows/ci.yml`

**Triggers**: All pull requests and pushes to `main`

**Jobs**:
- `lint`: ESLint and Prettier checks
- `typecheck`: TypeScript type checking
- `build`: Build all packages and apps
- `test`: Run all test suites

**All jobs must pass** before PRs can be merged.

### Deployment Workflows

| App | Workflow | Trigger | Destination |
|-----|----------|---------|-------------|
| Curated Frontend | `deploy-curated.yml` | Push to main (Curated changes) | Vercel |
| Curated Backend | `deploy-curated.yml` | Push to main (Curated changes) | Northflank |
| Aura | `deploy-aura.yml` | Push to main (Aura changes) | Vercel |
| Sanctuary | `deploy-sanctuary.yml` | Push to main (Sanctuary changes) | Vercel |

**Path-based triggers** ensure only affected apps deploy.

### GitHub Environments

- `curated-production` - Curated frontend
- `curated-backend` - Curated backend
- `aura-production` - Aura spa dashboard
- `sanctuary-production` - Sanctuary community

**All environments require approval** from `@jade-team/devops` before deployment.

---

## Git Safety (CRITICAL)

### Branch Protection

**Protected Branch**: `main`

**Requirements**:
- ✅ 2 required approvals
- ✅ Code owner approval
- ✅ All status checks passing
- ✅ Branch up to date
- ✅ All conversations resolved
- ❌ No force pushes
- ❌ No deletions

### Pre-Commit Checklist

```bash
# Verify correct branch
git branch --show-current  # Must NOT be 'main'

# Run quality checks
pnpm lint
pnpm typecheck
pnpm build
pnpm test

# Commit only if all pass
git add .
git commit -m "..."
git push origin your-branch
```

### Emergency Procedures

For critical production issues, use the **hotfix process**:

1. Create hotfix branch from `main`
2. Make minimal fix with tests
3. Use `hotfix.md` PR template
4. Request expedited review (1 approval instead of 2)
5. Deploy and monitor closely
6. Create post-mortem issue

**Never bypass branch protection** except with incident commander authorization.

---

## Session Continuity

When starting a new Claude Code session:

1. ✅ Claude Code automatically reads this CLAUDE.md file
2. ✅ Reference specific tasks by number (e.g., "Working on Task A.1.1")
3. ✅ Check specs for current completion status
4. ✅ Update task status as you complete work

### Context Handoff

**Previous Session**: Completed Feature 012 - Ecosystem Separation
- Created monorepo infrastructure
- Set up CI/CD pipelines
- Established governance policies
- Comprehensive documentation

**Current Session**: Continue with Feature 011 - Vendor Portal MVP
- Working on Phase A (Foundation)
- Sprint A.1 (Vendor Profile Schema)
- 12 tasks remaining in current sprint

---

## Important Reminders

### NEVER Commit:
- ❌ AWS credentials or API keys
- ❌ `.env` files with secrets
- ❌ `node_modules/` directories
- ❌ Build artifacts (`dist/`, `.turbo/`)
- ❌ IDE-specific files (except `.vscode/settings.json` if team-shared)

### ALWAYS:
- ✅ Write tests before implementation
- ✅ Run `pnpm lint && pnpm typecheck && pnpm test` before committing
- ✅ Update documentation when changing APIs
- ✅ Follow the SPECKIT methodology for features
- ✅ Request code owner review on PRs
- ✅ Use descriptive commit messages with issue references

### Documentation Updates:
When you make changes that affect:
- **APIs**: Update relevant GraphQL contracts
- **Components**: Update component documentation
- **Packages**: Update package README.md
- **Architecture**: Update CLAUDE.md and DEVELOPMENT.md
- **Workflows**: Update CI_CD_TESTING.md

---

## Getting Help

### Documentation

- **[README.md](./README.md)**: Quick start and overview
- **[CONTRIBUTING.md](./CONTRIBUTING.md)**: Contribution guidelines
- **[DEVELOPMENT.md](./DEVELOPMENT.md)**: Development workflows
- **[.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md)**: Branch protection
- **[.github/CI_CD_TESTING.md](./.github/CI_CD_TESTING.md)**: CI/CD testing
- **[CONSTITUTION.md](./CONSTITUTION.md)**: Governance framework

### Specifications

All feature specs are in `specs/[feature-number]-[feature-name]/`:
- `spec.md` - Full requirements and architecture
- `plan.md` - Implementation timeline and phases
- `tasks.md` - Detailed task breakdown with acceptance criteria
- `contracts/*.graphql` - GraphQL API contracts

### Team Communication

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and technical discussions
- **Pull Request Comments**: Code-specific feedback

---

## Next Actions

### For Feature 011 (ACTIVE):

1. **Continue Sprint A.1**: Vendor Profile Schema
   - Task A.1.1: Create VendorProfile TypeORM entity
   - Task A.1.5: Create VendorValue enum with 25 values
   - Task A.1.7: Create CertificationType enum
   - Task A.1.8: Create VendorCertification entity
   - Task A.1.10: Create database migration
   - Task A.1.11: Add Zod validation schemas
   - Task A.1.12: Write unit tests

2. **Follow SPECKIT**:
   - Reference `specs/011-vendor-portal/tasks.md`
   - Update progress as tasks complete
   - Ensure 80% test coverage
   - Follow acceptance criteria exactly

3. **Prepare for Sprint A.2**: GraphQL Contracts
   - Review `specs/011-vendor-portal/contracts/vendor.graphql`
   - Plan resolver implementations
   - Design mutation validation

---

## Feature Roadmap

### Completed Features

- ✅ **Feature 012**: Ecosystem Separation (Dec 23, 2025)
  - Monorepo infrastructure
  - Shared packages
  - CI/CD pipelines
  - Complete documentation

### Active Features

- 🔄 **Feature 011**: Vendor Portal MVP (In Progress)
  - Phase A: Foundation (Current)
  - Phase B: Core Portal
  - Phase C: Communication
  - Phase D: Discovery
  - Phase E: Admin Tools
  - **Timeline**: 14 weeks

### Planned Features

- ⏳ **Feature 010**: SKA MACH Evolution (On Hold)
  - AI governance integration
  - Vector search
  - Multi-signal ranking
  - **Status**: Deferred until after Feature 011

---

Ready to build! 🚀

**Remember**: Quality over speed. Follow the constitutional principles, write comprehensive tests, and maintain clear documentation. The JADE ecosystem serves real businesses in the professional skincare industry.
