# Feature 012: Compliance Checklist
## JADE Ecosystem Separation - Verification

**Document Version**: 1.0.0  
**Created**: December 23, 2025  
**Last Updated**: December 23, 2025

---

## Checklist Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not Started |
| 🟨 | In Progress |
| ✅ | Complete |
| ❌ | Failed/Blocked |
| 🔵 | Verified |

---

## Phase 1: Monorepo Shell

### 1.1 Repository Initialization

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 1.1.1 jade-ecosystem repo created | `gh repo view jade-ecosystem` |
| ⬜ | 1.1.2 pnpm workspace configured | `pnpm -v && cat pnpm-workspace.yaml` |
| ⬜ | 1.1.3 Turborepo configured | `npx turbo --version && cat turbo.json` |
| ⬜ | 1.1.4 Base tsconfig created | `cat tsconfig.base.json` |
| ⬜ | 1.1.5 Ignore files created | `cat .gitignore && cat .npmrc` |
| ⬜ | 1.1.6 CONSTITUTION.md created | `cat CONSTITUTION.md` |
| ⬜ | 1.1.7 README.md created | `cat README.md` |
| ⬜ | 1.1.8 ESLint config created | `cat packages/eslint-config/index.js` |
| ⬜ | 1.1.9 Prettier config created | `cat .prettierrc` |

### 1.2 Code Migration

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 1.2.1 apps/curated structure exists | `ls -la apps/curated/` |
| ⬜ | 1.2.2 marketplace-frontend moved | `ls apps/curated/marketplace-frontend/src` |
| ⬜ | 1.2.3 vendure-backend moved | `ls apps/curated/vendure-backend/src` |
| ⬜ | 1.2.4 Workspace references updated | `pnpm ls --depth 0` |
| ⬜ | 1.2.5 packages/ directory exists | `ls packages/` |
| ⬜ | 1.2.6 ska-ontology moved | `ls packages/ska-ontology/` |
| ⬜ | 1.2.7 ska-ontology package.json | `cat packages/ska-ontology/package.json` |
| ⬜ | 1.2.8 specs/ structure exists | `ls specs/` |
| ⬜ | 1.2.9 Existing specs moved | `ls specs/010-* specs/011-*` |

### 1.3 Validation

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 1.3.1 pnpm install succeeds | `pnpm install && echo $?` |
| ⬜ | 1.3.2 pnpm build succeeds | `pnpm build && echo $?` |
| ⬜ | 1.3.3 pnpm dev starts apps | `pnpm dev` (manual check) |
| ⬜ | 1.3.4 All tests pass | `pnpm test && echo $?` |
| ⬜ | 1.3.5 Issues documented | `cat MIGRATION.md` |
| ⬜ | 1.3.6 Recovery tag created | `git tag -l pre-ecosystem-migration` |

### Phase 1 Gate Verification

| Status | Criterion |
|--------|-----------|
| ⬜ | `pnpm build` exits with code 0 |
| ⬜ | `pnpm dev` starts marketplace frontend |
| ⬜ | All existing tests pass |
| ⬜ | Feature 011 can continue development |

---

## Phase 2: Package Extraction

### 2.1 @jade/ui Foundation

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 2.1.1 jade-ui directory exists | `ls packages/jade-ui/` |
| ⬜ | 2.1.2 package.json configured | `cat packages/jade-ui/package.json` |
| ⬜ | 2.1.3 TypeScript configured | `cat packages/jade-ui/tsconfig.json` |
| ⬜ | 2.1.4 Color tokens defined | `cat packages/jade-ui/src/tokens/colors.ts` |
| ⬜ | 2.1.5 Spacing tokens defined | `cat packages/jade-ui/src/tokens/spacing.ts` |
| ⬜ | 2.1.6 Typography tokens defined | `cat packages/jade-ui/src/tokens/typography.ts` |
| ⬜ | 2.1.7 CSS variables work | Build and check CSS output |
| ⬜ | 2.1.8 Tailwind preset created | `cat packages/jade-ui/tailwind.preset.js` |
| ⬜ | 2.1.9 Build script works | `pnpm --filter @jade/ui build` |
| ⬜ | 2.1.10 Token tests pass | `pnpm --filter @jade/ui test` |

### 2.2 Component Extraction

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 2.2.1 Button extracted | `cat packages/jade-ui/src/components/Button.tsx` |
| ⬜ | 2.2.2 Input extracted | `cat packages/jade-ui/src/components/Input.tsx` |
| ⬜ | 2.2.3 Card extracted | `cat packages/jade-ui/src/components/Card.tsx` |
| ⬜ | 2.2.4 Modal extracted | `cat packages/jade-ui/src/components/Modal.tsx` |
| ⬜ | 2.2.5 Barrel exports created | `cat packages/jade-ui/src/index.ts` |
| ⬜ | 2.2.6 Button tests pass | Component test run |
| ⬜ | 2.2.7 Input tests pass | Component test run |
| ⬜ | 2.2.8 Curated imports updated | `grep -r "@jade/ui" apps/curated/` |

### 2.3 Additional Components

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 2.3.1 Layout components extracted | Import verification |
| ⬜ | 2.3.2 Navigation components extracted | Import verification |
| ⬜ | 2.3.3 Form components extracted | Import verification |
| ⬜ | 2.3.4 Loading components extracted | Import verification |
| ⬜ | 2.3.5 Shared hooks created | Hook test run |
| ⬜ | 2.3.6 All Curated imports updated | Build verification |

### 2.4 Supporting Packages

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 2.4.1 @jade/config created | `cat packages/jade-config/package.json` |
| ⬜ | 2.4.2 @jade/auth created | `cat packages/jade-auth/package.json` |
| ⬜ | 2.4.3 @jade/analytics created | `cat packages/jade-analytics/package.json` |
| ⬜ | 2.4.4 @jade/graphql-types created | `cat packages/jade-graphql-types/package.json` |
| ⬜ | 2.4.5 GraphQL codegen works | `pnpm --filter @jade/graphql-types generate` |
| ⬜ | 2.4.6 Integration tests pass | Full build verification |

### Phase 2 Gate Verification

| Status | Criterion |
|--------|-----------|
| ⬜ | `@jade/ui` exports all shared components |
| ⬜ | Curated apps use package imports only |
| ⬜ | All packages build successfully |
| ⬜ | 80% test coverage on @jade/ui |
| ⬜ | No TypeScript errors |

---

## Phase 3: App Scaffolds

### 3.1 Aura Scaffold

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 3.1.1 aura directory exists | `ls apps/aura/` |
| ⬜ | 3.1.2 spa-dashboard scaffolded | `ls apps/aura/spa-dashboard/` |
| ⬜ | 3.1.3 TypeScript configured | `cat apps/aura/spa-dashboard/tsconfig.json` |
| ⬜ | 3.1.4 @jade/ui installed | `pnpm ls @jade/ui --filter aura-spa-dashboard` |
| ⬜ | 3.1.5 Basic layout renders | Dev server check |
| ⬜ | 3.1.6 Placeholder pages exist | Route check |
| ⬜ | 3.1.7 Routing works | Navigation check |
| ⬜ | 3.1.8 Turborepo integration | `pnpm build --filter aura-spa-dashboard` |

### 3.2 Sanctuary Scaffold

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 3.2.1 sanctuary directory exists | `ls apps/sanctuary/` |
| ⬜ | 3.2.2 community-frontend scaffolded | `ls apps/sanctuary/community-frontend/` |
| ⬜ | 3.2.3 TypeScript configured | Config check |
| ⬜ | 3.2.4 @jade/ui installed | Dependency check |
| ⬜ | 3.2.5 Basic layout renders | Dev server check |
| ⬜ | 3.2.6 Placeholder pages exist | Route check |
| ⬜ | 3.2.7 Routing works | Navigation check |
| ⬜ | 3.2.8 Turborepo integration | Build check |

### 3.3 Feature Flags & Integration

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 3.3.1 Feature flags package exists | `cat packages/jade-feature-flags/` |
| ⬜ | 3.3.2 App visibility flags work | Flag toggle test |
| ⬜ | 3.3.3 All apps run together | `pnpm dev` |
| ⬜ | 3.3.4 Workflow documented | Documentation review |

### Phase 3 Gate Verification

| Status | Criterion |
|--------|-----------|
| ⬜ | `pnpm dev --filter=aura-spa-dashboard` starts |
| ⬜ | `pnpm dev --filter=sanctuary-community-frontend` starts |
| ⬜ | Both scaffolds use @jade/ui components |
| ⬜ | Feature flags control visibility |
| ⬜ | Documentation updated |

---

## Phase 4: CI/CD Setup

### 4.1 GitHub Actions

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 4.1.1 CI workflow created | `cat .github/workflows/ci.yml` |
| ⬜ | 4.1.2 Remote caching enabled | Turbo cache check |
| ⬜ | 4.1.3 Curated deploy workflow | Workflow file check |
| ⬜ | 4.1.4 Aura deploy workflow | Workflow file check |
| ⬜ | 4.1.5 Sanctuary deploy workflow | Workflow file check |
| ⬜ | 4.1.6 Secrets configured | GitHub secrets check |

### 4.2 Branch Protection

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 4.2.1 Protection rules active | GitHub settings check |
| ⬜ | 4.2.2 Status checks required | Settings verification |
| ⬜ | 4.2.3 CODEOWNERS created | `cat CODEOWNERS` |
| ⬜ | 4.2.4 PR templates exist | `cat .github/PULL_REQUEST_TEMPLATE.md` |
| ⬜ | 4.2.5 Deploy approvals configured | Environment settings |
| ⬜ | 4.2.6 Full pipeline tested | End-to-end test run |

### 4.3 Documentation

| Status | Task | Verification Method |
|--------|------|---------------------|
| ⬜ | 4.3.1 Root README updated | Content review |
| ⬜ | 4.3.2 CONTRIBUTING.md created | Content review |
| ⬜ | 4.3.3 Workflows documented | Documentation review |
| ⬜ | 4.3.4 CLAUDE.md updated | Content review |
| ⬜ | 4.3.5 Video walkthrough (optional) | Link check |

### Phase 4 Gate Verification

| Status | Criterion |
|--------|-----------|
| ⬜ | CI runs on every PR |
| ⬜ | Deployment pipelines functional |
| ⬜ | Remote caching reduces build times 50%+ |
| ⬜ | Documentation complete |
| ⬜ | Team onboarding guide available |

---

## Constitutional Compliance

### Article VIII: UI Stability

| Status | Check |
|--------|-------|
| ⬜ | No existing component interfaces modified |
| ⬜ | All @jade/ui components maintain backward compatibility |
| ⬜ | GraphQL changes are additive only |
| ⬜ | No breaking changes to existing apps |

### Article IX: Package Contracts (New)

| Status | Check |
|--------|-------|
| ⬜ | All packages follow semver |
| ⬜ | Changelogs created for packages |
| ⬜ | Deprecation notices for removed code |
| ⬜ | Cross-app compatibility verified |

### SPECKIT Methodology

| Status | Check |
|--------|-------|
| ⬜ | All tasks traced to spec.md |
| ⬜ | plan.md timeline followed |
| ⬜ | Deviations documented |
| ⬜ | Checklist updated as work progresses |

---

## Final Sign-Off

### Technical Review

| Reviewer | Date | Status |
|----------|------|--------|
| Claude Code | | ⬜ |
| Jesse Garza | | ⬜ |

### Quality Gates Passed

| Gate | Date Passed |
|------|-------------|
| Phase 1 Complete | |
| Phase 2 Complete | |
| Phase 3 Complete | |
| Phase 4 Complete | |

### Feature Complete

| Status | Criterion |
|--------|-----------|
| ⬜ | All 68 tasks complete |
| ⬜ | All phase gates passed |
| ⬜ | Constitutional compliance verified |
| ⬜ | Documentation reviewed |
| ⬜ | Ready for production |

---

**Checklist Maintained by**: Claude Code  
**Review Frequency**: After each sprint completion
