# JADE Ecosystem

A unified monorepo containing three distinct applications serving the professional skincare industry.

## Applications

### 🛒 Curated by Jade
**B2B Skincare Marketplace**
- Wholesale marketplace connecting spas with premium skincare vendors
- Vendor portal for sellers
- Product discovery and ordering
- **Status**: Active Development

[View Curated Documentation →](./apps/curated/README.md)

### ✨ Aura by Jade
**Spa Operations Platform**
- Spa management dashboard
- Treatment protocol builder
- Client booking system
- **Status**: Scaffold Phase

[View Aura Documentation →](./apps/aura/README.md)

### 🏛️ Spa-ce Sanctuary
**Professional Community**
- Industry discussion forums
- Educational content platform
- Professional certification tracking
- **Status**: Scaffold Phase

[View Sanctuary Documentation →](./apps/sanctuary/README.md)

---

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 8.15+
- Git 2.40+

### Installation

```bash
# Clone the repository
git clone https://github.com/YetiPanda/jade-ecosystem.git
cd jade-ecosystem

# Install dependencies
pnpm install

# Build all packages and apps
pnpm build

# Start development servers
pnpm dev
```

---

## Common Commands

### Development

```bash
# Start all apps in development mode
pnpm dev

# Start a specific app
pnpm dev --filter=curated-marketplace-frontend
pnpm dev --filter=aura-spa-dashboard
pnpm dev --filter=sanctuary-community-frontend
```

### Building

```bash
# Build all packages and apps
pnpm build

# Build a specific package
pnpm build --filter=@jade/ui
pnpm build --filter=curated-marketplace-frontend
```

### Testing

```bash
# Run all tests
pnpm test

# Run tests for changed packages only
pnpm test --filter=...[origin/main]

# Run tests for a specific package
pnpm test --filter=@jade/ui
```

### Linting & Type Checking

```bash
# Lint all packages
pnpm lint

# Type check everything
pnpm typecheck
```

---

## Repository Structure

```
jade-ecosystem/
├── apps/
│   ├── curated/              # Marketplace applications
│   │   ├── marketplace-frontend/
│   │   ├── vendor-portal/
│   │   └── vendure-backend/
│   ├── aura/                 # Spa operations apps
│   │   └── spa-dashboard/
│   └── sanctuary/            # Professional community apps
│       └── community-frontend/
│
├── packages/                 # Shared libraries
│   ├── ska-ontology/         # Semantic Knowledge Atoms
│   ├── vector-db/            # Vector database integration
│   ├── jade-ui/              # Design system & components
│   ├── feature-flags/        # Feature flag management
│   ├── shared-types/         # Shared TypeScript types
│   └── (future packages...)  # Auth, analytics, config
│
├── services/                 # Shared microservices (Future)
│   ├── identity-service/
│   ├── notification-service/
│   └── media-service/
│
├── specs/                    # SPECKIT specifications
│   ├── 010-ska-mach-evolution/
│   ├── 011-vendor-portal/
│   └── 012-ecosystem-separation/
│
├── CONSTITUTION.md           # Governance framework
├── package.json              # Workspace configuration
├── pnpm-workspace.yaml       # pnpm workspaces
├── turbo.json                # Turborepo configuration
└── tsconfig.base.json        # Shared TypeScript config
```

---

## Shared Packages

### @jade/ui
Shared design system and component library used across all applications.

- Design tokens (colors, spacing, typography)
- Base components (Button, Input, Card, Modal, etc.)
- Layout components (Container, Grid, Stack)
- React hooks (useToast, useModal, etc.)
- **Status**: Production-ready

### @jade/feature-flags
Runtime feature flag management for controlling app visibility and features.

- FeatureFlagsManager with app visibility controls
- Environment variable support (FEATURE_FLAG_*)
- TypeScript types for type-safe feature checks
- Singleton pattern for global configuration
- **Status**: Production-ready

### @jade/ska-ontology
Semantic Knowledge Atoms for AI governance and ingredient intelligence.

- SKA meta-schema (ska-meta-schema.ttl)
- Regulatory compliance atoms (NIST, ISO 42001, EU AI Act)
- Agentic extension for appreciating assets
- SPARQL query utilities
- **Status**: Production-ready

### @jade/vector-db
Vector database integration for semantic search and AI features.

- pgvector integration
- Embedding generation utilities
- Semantic search queries
- **Status**: Active development

### @jade/shared-types
Shared TypeScript types and GraphQL schemas.

- Common domain types
- GraphQL type definitions
- Generated TypeScript from GraphQL
- **Status**: Active development

---

## Development Workflow

### Adding a New Package

```bash
# Create package directory
mkdir packages/jade-new-package
cd packages/jade-new-package

# Initialize package.json
pnpm init

# Package is automatically detected by pnpm-workspace.yaml
```

### Using a Package in an App

```bash
# From the app directory
pnpm add @jade/new-package --filter=curated-marketplace-frontend
```

### Branch Strategy

```
main                    # Production-ready code
├── feature/012-*       # Ecosystem separation work
├── feature/011-*       # Vendor Portal (active)
├── feature/010-*       # SKA MACH (on hold)
└── release/*           # Release candidates
```

---

## Constitutional Governance

This repository operates under the [JADE Ecosystem Constitution](./CONSTITUTION.md), which establishes:

- **Article VIII**: UI Stability Protection (no breaking UI changes)
- **Article IX**: Package Contract Stability (semver enforcement)
- **Article X**: Deployment Independence (isolated deployments)
- **Article XI**: Shared Package Ownership (core team governance)

All contributors must adhere to constitutional principles.

---

## Active Features

### Feature 011: Vendor Portal MVP
**Status**: Phase A - Foundation (ACTIVE)
**Branch**: `feature/011-vendor-portal`

Vendor-facing features for brand identity, analytics, order management, and messaging.

[View Feature 011 Specs →](./specs/011-vendor-portal/)

### Feature 012: Ecosystem Separation
**Status**: ✅ COMPLETED
**Completion Date**: December 23, 2025

Successfully transformed the JADE POC into a production-ready monorepo with:

- Three independently deployable applications (Curated, Aura, Sanctuary)
- Shared component library (@jade/ui)
- Feature flag system (@jade/feature-flags)
- Complete CI/CD infrastructure with GitHub Actions
- Branch protection and code ownership policies

[View Feature 012 Specs →](./specs/012-ecosystem-separation/)

---

## Contributing

### Prerequisites
1. Read the [CONSTITUTION.md](./CONSTITUTION.md)
2. Review the [SPECKIT methodology](./specs/README.md)
3. Ensure tests pass: `pnpm test`
4. Follow TypeScript strict mode

### Workflow
1. Create feature branch from `main`
2. Make changes following SPECKIT
3. Write tests (80% coverage minimum)
4. Run `pnpm typecheck` and `pnpm lint`
5. Submit pull request
6. Address review feedback

### Commit Convention
```
feat(scope): add feature description

- Implementation details
- Related changes

Refs: feature-number
```

---

## Deployment

### CI/CD Infrastructure

All applications use GitHub Actions for continuous integration and deployment.

**Continuous Integration** (`.github/workflows/ci.yml`):

- Runs on all pull requests and pushes to `main`
- Parallel jobs: lint, typecheck, build, test
- Turborepo remote caching for fast builds
- Required status checks before merge

**Deployment Workflows**:

- **Curated**: `.github/workflows/deploy-curated.yml` (Vercel + Northflank)
- **Aura**: `.github/workflows/deploy-aura.yml` (Vercel)
- **Sanctuary**: `.github/workflows/deploy-sanctuary.yml` (Vercel)

**Deployment Protection**:

- GitHub Environments with required approvals
- Environment-specific secrets
- Path-based deployment triggers (only deploy changed apps)
- Deployment only from `main` branch

**Documentation**:

- [Secrets Configuration](.github/SECRETS.md)
- [Branch Protection](.github/BRANCH_PROTECTION.md)
- [CI/CD Testing Guide](.github/CI_CD_TESTING.md)
- [Code Owners](.github/CODEOWNERS)

---

## License

Proprietary - All Rights Reserved

---

## Contact

**Project Owner**: Jesse Garza
**Repository**: [https://github.com/YetiPanda/jade-ecosystem](https://github.com/YetiPanda/jade-ecosystem)

For questions or support, please open an issue in the repository.
