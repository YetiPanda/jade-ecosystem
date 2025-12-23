# Feature 012: JADE Ecosystem Separation
## Monorepo Architecture with Turborepo

**Document Version**: 1.0.0  
**Created**: December 23, 2025  
**Status**: APPROVED  
**Author**: Jesse Garza  
**Prepared by**: AI Development Assistant

---

## 1. Executive Summary

### 1.1 Purpose
Transform the JADE proof-of-concept application into a scalable monorepo ecosystem supporting three distinct applications: **Curated by Jade** (marketplace), **Aura by Jade** (spa operations), and **Spa-ce Sanctuary** (professional community).

### 1.2 Approved Approach
**Monorepo with Turborepo** — A unified repository structure with workspace isolation, shared packages, and independent deployment pipelines.

### 1.3 Key Outcomes
- Three independently deployable applications
- Shared design system and component library
- Unified authentication and user identity
- Constitutional governance across all applications
- Progressive extraction without disruption to active development

---

## 2. Background

### 2.1 Current State
The jade-spa-marketplace repository currently contains a proof-of-concept demonstrating all three JADE ecosystem applications within a single codebase. Active development is focused on:
- **Feature 010**: SKA MACH Evolution (ON HOLD)
- **Feature 011**: Vendor Portal MVP (ACTIVE - Sprint A.1)

### 2.2 Problem Statement
The current architecture creates several challenges:
1. **Coupling**: All three applications share the same codebase without clear boundaries
2. **Deployment Risk**: Changes to one app can affect others
3. **Scalability**: Cannot scale applications independently
4. **Team Parallelization**: Difficult for multiple developers to work on different apps

### 2.3 Strategic Context
The JADE ecosystem serves three distinct user personas:
| Application | Primary Users | Core Function |
|-------------|---------------|---------------|
| **Curated by Jade** | Spa owners, Vendors | B2B skincare marketplace |
| **Aura by Jade** | Spa staff, Clients | Spa operations & booking |
| **Spa-ce Sanctuary** | Professionals | Education & community |

---

## 3. Solution Architecture

### 3.1 Monorepo Structure

```
jade-ecosystem/                          # Root monorepo
├── package.json                         # Workspace root (pnpm workspaces)
├── pnpm-workspace.yaml                  # Workspace configuration
├── turbo.json                           # Turborepo orchestration
├── tsconfig.base.json                   # Shared TypeScript config
├── .github/
│   └── workflows/
│       ├── ci.yml                       # Unified CI pipeline
│       ├── deploy-curated.yml           # Curated-specific deployment
│       ├── deploy-aura.yml              # Aura-specific deployment
│       └── deploy-sanctuary.yml         # Sanctuary-specific deployment
├── CONSTITUTION.md                      # Governance (applies to ALL apps)
│
├── apps/
│   ├── curated/                         # 🛒 Marketplace (ACTIVE)
│   │   ├── marketplace-frontend/        # Consumer-facing shop
│   │   ├── vendor-portal/               # Seller dashboard
│   │   └── vendure-backend/             # E-commerce engine
│   │
│   ├── aura/                            # ✨ Spa Operations (SCAFFOLD)
│   │   ├── spa-dashboard/               # Spa owner portal
│   │   ├── treatment-builder/           # Protocol management
│   │   └── client-booking/              # Appointment system
│   │
│   └── sanctuary/                       # 🏛️ Professional Community (SCAFFOLD)
│       ├── community-frontend/          # Forum/discussion
│       ├── learning-platform/           # Education content
│       └── certification-tracker/       # Professional development
│
├── packages/                            # Shared libraries
│   ├── ska-ontology/                    # ✅ Already exists
│   ├── jade-ui/                         # Shared design system
│   │   ├── src/
│   │   │   ├── components/              # Button, Input, Card, Modal
│   │   │   ├── tokens/                  # Colors, spacing, typography
│   │   │   ├── hooks/                   # Shared React hooks
│   │   │   └── utils/                   # Utility functions
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── jade-graphql-types/              # Generated TypeScript types
│   ├── jade-auth/                       # Authentication utilities
│   ├── jade-analytics/                  # Event tracking
│   └── jade-config/                     # Shared configuration
│
├── services/                            # Shared microservices (Future)
│   ├── identity-service/                # User/auth across all apps
│   ├── notification-service/            # Email/SMS/push
│   └── media-service/                   # Image optimization
│
├── infrastructure/                      # AWS IaC
│   ├── shared/                          # VPC, Cognito, CDN
│   ├── curated/                         # Curated-specific resources
│   ├── aura/                            # Aura-specific resources
│   └── sanctuary/                       # Sanctuary-specific resources
│
└── specs/                               # SPECKIT specifications
    ├── 010-ska-mach-evolution/
    ├── 011-vendor-portal/
    └── 012-ecosystem-separation/        # This feature
```

### 3.2 Package Dependency Graph

```
                    ┌─────────────────┐
                    │  jade-config    │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
      ┌───────────┐  ┌───────────┐  ┌───────────┐
      │ jade-auth │  │  jade-ui  │  │jade-analytics│
      └─────┬─────┘  └─────┬─────┘  └──────┬──────┘
            │              │               │
            └──────────────┼───────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐      ┌─────────┐      ┌───────────┐
    │ Curated │      │  Aura   │      │ Sanctuary │
    └─────────┘      └─────────┘      └───────────┘
```

### 3.3 Turborepo Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

---

## 4. Technical Specifications

### 4.1 Shared Design System (@jade/ui)

#### Component Inventory
Extract from existing marketplace-frontend:

| Component | Status | Priority |
|-----------|--------|----------|
| Button | Extract | P0 |
| Input | Extract | P0 |
| Card | Extract | P0 |
| Modal/Dialog | Extract | P0 |
| Navigation | Extract | P0 |
| Layout | Extract | P0 |
| ProductCard | Keep in Curated | - |
| VendorCard | Keep in Curated | - |
| SpaCard | Create for Aura | - |

#### Design Tokens
```typescript
// packages/jade-ui/src/tokens/colors.ts
export const colors = {
  // Primary palette
  jade: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    900: '#14532d',
  },
  // Semantic colors
  background: 'var(--jade-background)',
  foreground: 'var(--jade-foreground)',
  primary: 'var(--jade-primary)',
  secondary: 'var(--jade-secondary)',
  muted: 'var(--jade-muted)',
  accent: 'var(--jade-accent)',
} as const;
```

### 4.2 Authentication Package (@jade/auth)

```typescript
// packages/jade-auth/src/index.ts
export { AuthProvider, useAuth } from './provider';
export { withAuth } from './hoc';
export { authGuard } from './guard';
export type { User, AuthState, AuthConfig } from './types';
```

#### Cross-App Authentication Flow
```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Curated    │    │     Aura     │    │  Sanctuary   │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │   @jade/auth    │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  AWS Cognito    │
                  │  (Single Pool)  │
                  └─────────────────┘
```

### 4.3 GraphQL Types Package (@jade/graphql-types)

```typescript
// packages/jade-graphql-types/src/index.ts
// Auto-generated from schemas

// Shared types
export type { User, Asset, Address } from './shared';

// Curated-specific (re-exported for convenience)
export type { Product, Order, Vendor } from './curated';

// Aura-specific
export type { Spa, Treatment, Booking } from './aura';

// Sanctuary-specific
export type { Community, Course, Certificate } from './sanctuary';
```

---

## 5. Migration Strategy

### 5.1 Progressive Extraction Phases

| Phase | Focus | Duration | Risk |
|-------|-------|----------|------|
| **Phase 1** | Monorepo Shell | 1 week | Low |
| **Phase 2** | Package Extraction | 2 weeks | Medium |
| **Phase 3** | App Scaffolds | 1 week | Low |
| **Phase 4** | CI/CD Setup | 1 week | Medium |

### 5.2 Phase 1: Monorepo Shell (Week 1)

**Objective**: Create the monorepo structure without breaking existing functionality.

1. Create new `jade-ecosystem` repository
2. Initialize pnpm workspaces
3. Add Turborepo configuration
4. Move `jade-spa-marketplace` as `apps/curated/`
5. Verify existing builds still work

**Critical Path**: Zero disruption to Feature 011 development.

### 5.3 Phase 2: Package Extraction (Weeks 2-3)

**Objective**: Extract shared code into packages.

1. Create `@jade/ui` package
2. Extract design tokens and base components
3. Update import paths in Curated apps
4. Create `@jade/auth` package (placeholder)
5. Create `@jade/analytics` package (placeholder)
6. Move `ska-ontology` to `packages/`

### 5.4 Phase 3: App Scaffolds (Week 4)

**Objective**: Create empty shells for future applications.

1. Scaffold `apps/aura/spa-dashboard`
2. Scaffold `apps/sanctuary/community-frontend`
3. Configure shared dependencies
4. Implement feature flags

### 5.5 Phase 4: CI/CD Setup (Week 5)

**Objective**: Independent deployment pipelines.

1. Create GitHub Actions workflows
2. Configure Turborepo remote caching
3. Set up deployment triggers per app
4. Implement branch protection rules

---

## 6. Constitutional Compliance

### 6.1 Article VIII: UI Stability Protection
**APPLIES TO ALL APPLICATIONS**

The extraction of `@jade/ui` creates immutable UI contracts:
- Component prop interfaces become package API contracts
- Changes require semantic versioning
- Breaking changes require deprecation cycle

### 6.2 New Constitutional Addition

```markdown
# Amendment 002: Multi-App Governance

## Article IX: Package Contract Stability

### Principle
Shared packages (`@jade/*`) are stability contracts that all applications depend upon.
Breaking changes in shared packages affect the entire ecosystem.

### Rules

1. **Semantic Versioning Required**
   - All packages MUST follow semver
   - Breaking changes increment MAJOR version
   - New features increment MINOR version
   - Bug fixes increment PATCH version

2. **Deprecation Cycle**
   - 2 sprint (4 week) notice before removal
   - Console warnings in deprecated code
   - Migration guide required

3. **Testing Requirements**
   - Package changes require tests in ALL consuming apps
   - CI must validate cross-app compatibility

### Enforcement
- Turborepo validates dependency graph
- GitHub Actions prevent breaking package releases
- Package changelogs are mandatory
```

---

## 7. Development Workflow

### 7.1 Daily Development Commands

```bash
# Start all apps in development
pnpm dev

# Start specific app
pnpm dev --filter=curated-marketplace-frontend

# Build all packages and apps
pnpm build

# Build specific package
pnpm build --filter=@jade/ui

# Run tests for changed packages only
pnpm test --filter=...[origin/main]

# Type check everything
pnpm typecheck
```

### 7.2 Adding a New Package

```bash
# Create new package
mkdir packages/jade-new-package
cd packages/jade-new-package
pnpm init

# Add to workspace
# (automatically detected by pnpm-workspace.yaml glob)

# Install in an app
pnpm add @jade/new-package --filter=curated-marketplace-frontend
```

### 7.3 Branch Strategy

```
main                    # Production-ready code
├── feature/012-*       # Ecosystem separation work
├── feature/011-*       # Vendor Portal (continues parallel)
├── feature/010-*       # SKA MACH (on hold)
└── release/*           # Release candidates
```

---

## 8. Risk Assessment

### 8.1 High Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Breaking Feature 011 development | High | Phase 1 moves code without modification |
| Import path changes break builds | High | Automated codemods for path updates |
| CI/CD complexity | Medium | Start with simple workflows, iterate |

### 8.2 Rollback Strategy

If issues arise, the original `jade-spa-marketplace` repository remains untouched until Phase 1 is validated. A recovery tag exists: `pre-ecosystem-migration`.

---

## 9. Success Criteria

### 9.1 Phase 1 Complete When:
- [ ] `jade-ecosystem` repo initialized with Turborepo
- [ ] `apps/curated/` contains migrated marketplace code
- [ ] `pnpm build` succeeds for all apps
- [ ] `pnpm dev` starts marketplace as before
- [ ] Feature 011 development can continue uninterrupted

### 9.2 Phase 2 Complete When:
- [ ] `@jade/ui` package published to workspace
- [ ] Curated apps import from `@jade/ui`
- [ ] Design tokens centralized
- [ ] 80% test coverage on extracted components

### 9.3 Phase 3 Complete When:
- [ ] Aura app scaffold created
- [ ] Sanctuary app scaffold created
- [ ] Both scaffolds share `@jade/ui` components
- [ ] Feature flags control app visibility

### 9.4 Phase 4 Complete When:
- [ ] Independent deployment pipelines functional
- [ ] Turborepo remote caching enabled
- [ ] Branch protection rules active
- [ ] Documentation complete

---

## 10. Appendices

### Appendix A: Package.json Template

```json
{
  "name": "jade-ecosystem",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.3.0"
  },
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=20.0.0"
  }
}
```

### Appendix B: pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'apps/curated/*'
  - 'apps/aura/*'
  - 'apps/sanctuary/*'
  - 'packages/*'
  - 'services/*'
```

### Appendix C: Related Documents

- `plan.md` - 5-week implementation timeline
- `tasks.md` - Detailed task breakdown
- `checklist.md` - Compliance verification
- `CLAUDE-CODE-HANDOFF.md` - Implementation handoff

---

**Document Status**: APPROVED  
**Approved by**: Jesse Garza  
**Approval Date**: December 23, 2025
