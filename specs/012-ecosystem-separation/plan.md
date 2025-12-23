# Feature 012: Implementation Plan
## JADE Ecosystem Separation - 5-Week Roadmap

**Document Version**: 1.0.0  
**Created**: December 23, 2025  
**Status**: APPROVED

---

## Timeline Overview

```
Week 1                 Week 2                 Week 3                 Week 4                 Week 5
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  PHASE 1         │  │  PHASE 2         │  │  PHASE 2         │  │  PHASE 3         │  │  PHASE 4         │
│  Monorepo Shell  │  │  Package Extract │  │  Package Extract │  │  App Scaffolds   │  │  CI/CD Setup     │
│                  │  │  (Part 1)        │  │  (Part 2)        │  │                  │  │                  │
│  - Init turbo    │  │  - @jade/ui      │  │  - @jade/auth    │  │  - Aura shell    │  │  - GH Actions    │
│  - Move curated  │  │  - Design tokens │  │  - @jade/config  │  │  - Sanctuary     │  │  - Remote cache  │
│  - Validate      │  │  - Base comps    │  │  - Analytics     │  │  - Feature flags │  │  - Documentation │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
        │                     │                     │                     │                     │
        ▼                     ▼                     ▼                     ▼                     ▼
   Gate: Build OK        Gate: Imports OK     Gate: Auth works     Gate: Apps load      Gate: Deploy OK
```

---

## Phase 1: Monorepo Shell (Week 1)

### Objective
Establish the monorepo structure without modifying any existing code.

### Duration
5 days (40 hours)

### Sprint 1.1: Repository Initialization (Days 1-2)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 1.1.1 | Create `jade-ecosystem` repository | 1 | - |
| 1.1.2 | Initialize pnpm workspace | 2 | 1.1.1 |
| 1.1.3 | Add Turborepo configuration | 2 | 1.1.2 |
| 1.1.4 | Create base tsconfig.json | 2 | 1.1.2 |
| 1.1.5 | Add .gitignore and .npmrc | 1 | 1.1.2 |
| 1.1.6 | Create CONSTITUTION.md | 2 | 1.1.1 |
| 1.1.7 | Create README.md | 1 | 1.1.1 |
| 1.1.8 | Set up ESLint shared config | 2 | 1.1.2 |
| 1.1.9 | Set up Prettier shared config | 1 | 1.1.2 |

**Sprint 1.1 Total**: 14 hours

### Sprint 1.2: Code Migration (Days 3-4)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 1.2.1 | Create apps/curated/ directory structure | 1 | 1.1.3 |
| 1.2.2 | Move marketplace-frontend to apps/curated/ | 3 | 1.2.1 |
| 1.2.3 | Move vendure-backend to apps/curated/ | 3 | 1.2.1 |
| 1.2.4 | Update workspace references | 2 | 1.2.2, 1.2.3 |
| 1.2.5 | Create packages/ directory | 1 | 1.1.3 |
| 1.2.6 | Move ska-ontology to packages/ | 2 | 1.2.5 |
| 1.2.7 | Update ska-ontology package.json | 1 | 1.2.6 |
| 1.2.8 | Create specs/ directory structure | 1 | 1.1.1 |
| 1.2.9 | Move existing specs to new location | 2 | 1.2.8 |

**Sprint 1.2 Total**: 16 hours

### Sprint 1.3: Validation (Day 5)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 1.3.1 | Run `pnpm install` and verify | 2 | 1.2.* |
| 1.3.2 | Run `pnpm build` and verify | 2 | 1.3.1 |
| 1.3.3 | Run `pnpm dev` and verify | 2 | 1.3.1 |
| 1.3.4 | Run existing tests | 2 | 1.3.2 |
| 1.3.5 | Document any issues | 1 | 1.3.* |
| 1.3.6 | Create recovery tag | 1 | 1.3.4 |

**Sprint 1.3 Total**: 10 hours

### Phase 1 Gate
- [ ] `pnpm build` exits with code 0
- [ ] `pnpm dev` starts marketplace frontend
- [ ] All existing tests pass
- [ ] Feature 011 can continue development

---

## Phase 2: Package Extraction (Weeks 2-3)

### Objective
Extract shared code into reusable packages.

### Duration
10 days (80 hours)

### Sprint 2.1: @jade/ui Foundation (Week 2, Days 1-3)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 2.1.1 | Create packages/jade-ui directory | 1 | Phase 1 |
| 2.1.2 | Initialize package.json with exports | 2 | 2.1.1 |
| 2.1.3 | Set up TypeScript configuration | 2 | 2.1.2 |
| 2.1.4 | Create design tokens (colors) | 3 | 2.1.3 |
| 2.1.5 | Create design tokens (spacing) | 2 | 2.1.3 |
| 2.1.6 | Create design tokens (typography) | 2 | 2.1.3 |
| 2.1.7 | Set up CSS variables system | 3 | 2.1.4-6 |
| 2.1.8 | Add Tailwind preset | 2 | 2.1.7 |
| 2.1.9 | Create package build script | 2 | 2.1.2 |
| 2.1.10 | Write design token tests | 2 | 2.1.4-6 |

**Sprint 2.1 Total**: 21 hours

### Sprint 2.2: Component Extraction (Week 2, Days 4-5)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 2.2.1 | Extract Button component | 3 | 2.1.* |
| 2.2.2 | Extract Input component | 3 | 2.1.* |
| 2.2.3 | Extract Card component | 2 | 2.1.* |
| 2.2.4 | Extract Modal/Dialog component | 3 | 2.1.* |
| 2.2.5 | Create component barrel exports | 1 | 2.2.1-4 |
| 2.2.6 | Write Button tests | 2 | 2.2.1 |
| 2.2.7 | Write Input tests | 2 | 2.2.2 |
| 2.2.8 | Update Curated imports | 3 | 2.2.5 |

**Sprint 2.2 Total**: 19 hours

### Sprint 2.3: Additional Components (Week 3, Days 1-2)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 2.3.1 | Extract Layout components | 4 | Sprint 2.2 |
| 2.3.2 | Extract Navigation components | 4 | Sprint 2.2 |
| 2.3.3 | Extract Form components (Select, Checkbox) | 4 | Sprint 2.2 |
| 2.3.4 | Extract Loading/Skeleton components | 2 | Sprint 2.2 |
| 2.3.5 | Create shared hooks (useMediaQuery, etc.) | 3 | Sprint 2.2 |
| 2.3.6 | Update all Curated imports | 3 | 2.3.1-5 |

**Sprint 2.3 Total**: 20 hours

### Sprint 2.4: Supporting Packages (Week 3, Days 3-5)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 2.4.1 | Create @jade/config package | 4 | Phase 1 |
| 2.4.2 | Create @jade/auth package (placeholder) | 3 | Phase 1 |
| 2.4.3 | Create @jade/analytics package (placeholder) | 3 | Phase 1 |
| 2.4.4 | Create @jade/graphql-types package | 4 | Phase 1 |
| 2.4.5 | Add codegen for graphql-types | 3 | 2.4.4 |
| 2.4.6 | Integration testing all packages | 3 | 2.4.1-5 |

**Sprint 2.4 Total**: 20 hours

### Phase 2 Gate
- [ ] `@jade/ui` exports all shared components
- [ ] Curated apps use package imports (not relative)
- [ ] All packages build successfully
- [ ] 80% test coverage on @jade/ui
- [ ] No TypeScript errors

---

## Phase 3: App Scaffolds (Week 4)

### Objective
Create empty shells for Aura and Sanctuary applications.

### Duration
5 days (40 hours)

### Sprint 3.1: Aura Scaffold (Days 1-2)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 3.1.1 | Create apps/aura/ directory | 1 | Phase 2 |
| 3.1.2 | Scaffold spa-dashboard with Vite | 3 | 3.1.1 |
| 3.1.3 | Configure TypeScript for Aura | 2 | 3.1.2 |
| 3.1.4 | Install @jade/ui dependency | 1 | 3.1.3 |
| 3.1.5 | Create basic layout using @jade/ui | 3 | 3.1.4 |
| 3.1.6 | Add placeholder pages | 2 | 3.1.5 |
| 3.1.7 | Configure routing | 2 | 3.1.6 |
| 3.1.8 | Add to Turborepo pipeline | 1 | 3.1.7 |

**Sprint 3.1 Total**: 15 hours

### Sprint 3.2: Sanctuary Scaffold (Days 3-4)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 3.2.1 | Create apps/sanctuary/ directory | 1 | Phase 2 |
| 3.2.2 | Scaffold community-frontend with Vite | 3 | 3.2.1 |
| 3.2.3 | Configure TypeScript for Sanctuary | 2 | 3.2.2 |
| 3.2.4 | Install @jade/ui dependency | 1 | 3.2.3 |
| 3.2.5 | Create basic layout using @jade/ui | 3 | 3.2.4 |
| 3.2.6 | Add placeholder pages | 2 | 3.2.5 |
| 3.2.7 | Configure routing | 2 | 3.2.6 |
| 3.2.8 | Add to Turborepo pipeline | 1 | 3.2.7 |

**Sprint 3.2 Total**: 15 hours

### Sprint 3.3: Feature Flags & Integration (Day 5)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 3.3.1 | Create feature flags package | 3 | Sprint 3.1, 3.2 |
| 3.3.2 | Implement app visibility flags | 2 | 3.3.1 |
| 3.3.3 | Test all three apps run together | 2 | 3.3.2 |
| 3.3.4 | Document app development workflow | 3 | 3.3.3 |

**Sprint 3.3 Total**: 10 hours

### Phase 3 Gate
- [ ] `pnpm dev --filter=aura-spa-dashboard` starts successfully
- [ ] `pnpm dev --filter=sanctuary-community-frontend` starts successfully
- [ ] Both scaffolds use @jade/ui components
- [ ] Feature flags control visibility
- [ ] Documentation updated

---

## Phase 4: CI/CD Setup (Week 5)

### Objective
Implement independent deployment pipelines.

### Duration
5 days (40 hours)

### Sprint 4.1: GitHub Actions (Days 1-2)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 4.1.1 | Create unified CI workflow | 4 | Phase 3 |
| 4.1.2 | Add Turborepo remote caching | 3 | 4.1.1 |
| 4.1.3 | Create Curated deployment workflow | 3 | 4.1.1 |
| 4.1.4 | Create Aura deployment workflow | 2 | 4.1.1 |
| 4.1.5 | Create Sanctuary deployment workflow | 2 | 4.1.1 |
| 4.1.6 | Set up environment secrets | 2 | 4.1.3-5 |

**Sprint 4.1 Total**: 16 hours

### Sprint 4.2: Branch Protection & Policies (Days 3-4)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 4.2.1 | Configure branch protection rules | 2 | Sprint 4.1 |
| 4.2.2 | Set up required status checks | 2 | 4.2.1 |
| 4.2.3 | Create CODEOWNERS file | 2 | 4.2.1 |
| 4.2.4 | Set up PR templates | 2 | 4.2.1 |
| 4.2.5 | Configure deployment approvals | 2 | 4.2.1 |
| 4.2.6 | Test full CI/CD pipeline | 4 | 4.2.1-5 |

**Sprint 4.2 Total**: 14 hours

### Sprint 4.3: Documentation & Handoff (Day 5)

| Task ID | Task | Hours | Dependencies |
|---------|------|-------|--------------|
| 4.3.1 | Update root README.md | 2 | Phase 4.1-2 |
| 4.3.2 | Create CONTRIBUTING.md | 2 | 4.3.1 |
| 4.3.3 | Document development workflows | 3 | 4.3.2 |
| 4.3.4 | Update CLAUDE.md for new structure | 2 | 4.3.3 |
| 4.3.5 | Create video walkthrough (optional) | 1 | 4.3.4 |

**Sprint 4.3 Total**: 10 hours

### Phase 4 Gate
- [ ] CI runs on every PR
- [ ] Deployment pipelines functional for all apps
- [ ] Remote caching reduces build times by 50%+
- [ ] Documentation complete
- [ ] Team onboarding guide available

---

## Resource Allocation

### Estimated Hours by Phase

| Phase | Hours | Calendar Days |
|-------|-------|---------------|
| Phase 1: Monorepo Shell | 40 | 5 days |
| Phase 2: Package Extraction | 80 | 10 days |
| Phase 3: App Scaffolds | 40 | 5 days |
| Phase 4: CI/CD Setup | 40 | 5 days |
| **Total** | **200** | **25 days (5 weeks)** |

### Parallel Work Opportunities

Feature 011 (Vendor Portal) can continue in parallel:
- Week 1: Feature 011 continues in original repo
- Week 2+: Feature 011 moves to apps/curated/vendor-portal

---

## Dependencies & Prerequisites

### Technical Prerequisites
- Node.js 20+
- pnpm 8.15+
- Git 2.40+
- GitHub account with admin access

### External Dependencies
- GitHub Actions (CI/CD)
- Vercel or Northflank (deployment targets)
- Turborepo remote cache (optional, recommended)

### Knowledge Prerequisites
- Turborepo documentation
- pnpm workspaces
- Vite build configuration
- GitHub Actions workflow syntax

---

## Risk Mitigation Timeline

| Week | Risk Check | Mitigation Action |
|------|------------|-------------------|
| 1 | Build failures after migration | Rollback to original repo |
| 2 | Import path breaks | Automated codemod script |
| 3 | Cross-package type errors | Strict tsconfig in packages |
| 4 | App isolation issues | Feature flags disable broken apps |
| 5 | Deployment failures | Manual deployment fallback |

---

## Success Metrics

### Week 1 Complete
- Monorepo structure validated
- All existing functionality preserved

### Week 3 Complete
- 5+ packages extracted
- Curated apps fully migrated to package imports

### Week 5 Complete
- Three apps deployable independently
- CI/CD pipeline < 5 minutes for changed apps
- Documentation complete for new contributors

---

**Next Document**: `tasks.md` - Detailed task breakdown with acceptance criteria
