# Feature 012: Task Breakdown
## JADE Ecosystem Separation - Detailed Tasks

**Document Version**: 1.0.0  
**Created**: December 23, 2025  
**Total Tasks**: 68  
**Total Hours**: 200

---

## Task Legend

| Symbol | Meaning |
|--------|---------|
| ⭕ | Not Started |
| 🔄 | In Progress |
| ✅ | Complete |
| ⏸️ | Blocked |
| 🔴 | Critical Path |

---

## Phase 1: Monorepo Shell (40 hours)

### Sprint 1.1: Repository Initialization (14 hours)

#### Task 1.1.1: Create jade-ecosystem repository 🔴
**Hours**: 1  
**Dependencies**: None  
**Assignee**: Claude Code  

**Description**:
Create new GitHub repository for the JADE ecosystem monorepo.

**Acceptance Criteria**:
- [ ] Repository created on GitHub
- [ ] Default branch set to `main`
- [ ] Branch protection enabled for `main`
- [ ] Repository cloned locally

**Commands**:
```bash
gh repo create jade-ecosystem --public --clone
cd jade-ecosystem
```

---

#### Task 1.1.2: Initialize pnpm workspace 🔴
**Hours**: 2  
**Dependencies**: 1.1.1  
**Assignee**: Claude Code  

**Description**:
Set up pnpm as package manager with workspace configuration.

**Acceptance Criteria**:
- [ ] pnpm-workspace.yaml created
- [ ] Root package.json created with workspaces
- [ ] pnpm-lock.yaml generated
- [ ] Node version specified (>=20)

**Files to Create**:
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/**'
  - 'packages/*'
  - 'services/*'
```

```json
// package.json
{
  "name": "jade-ecosystem",
  "private": true,
  "packageManager": "pnpm@8.15.0",
  "engines": {
    "node": ">=20.0.0"
  }
}
```

---

#### Task 1.1.3: Add Turborepo configuration 🔴
**Hours**: 2  
**Dependencies**: 1.1.2  
**Assignee**: Claude Code  

**Description**:
Configure Turborepo for build orchestration and caching.

**Acceptance Criteria**:
- [ ] turbo.json created with pipeline configuration
- [ ] Build, dev, lint, test tasks defined
- [ ] Dependencies specified correctly
- [ ] Output directories configured

**Files to Create**:
```json
// turbo.json
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

#### Task 1.1.4: Create base tsconfig.json
**Hours**: 2  
**Dependencies**: 1.1.2  
**Assignee**: Claude Code  

**Description**:
Create shared TypeScript configuration for all packages.

**Acceptance Criteria**:
- [ ] tsconfig.base.json created
- [ ] Strict mode enabled
- [ ] Path aliases configured
- [ ] Module resolution set to bundler

**Files to Create**:
```json
// tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "incremental": true,
    "declaration": true,
    "declarationMap": true
  }
}
```

---

#### Task 1.1.5: Add .gitignore and .npmrc
**Hours**: 1  
**Dependencies**: 1.1.2  
**Assignee**: Claude Code  

**Description**:
Create standard ignore files for the monorepo.

**Acceptance Criteria**:
- [ ] .gitignore covers node_modules, dist, .turbo
- [ ] .npmrc configures pnpm settings
- [ ] No sensitive files committed

---

#### Task 1.1.6: Create CONSTITUTION.md
**Hours**: 2  
**Dependencies**: 1.1.1  
**Assignee**: Claude Code  

**Description**:
Establish governance document for all JADE applications.

**Acceptance Criteria**:
- [ ] Article VIII (UI Stability) included
- [ ] Article IX (Package Contracts) added
- [ ] Amendment process documented
- [ ] Enforcement mechanisms specified

---

#### Task 1.1.7: Create README.md
**Hours**: 1  
**Dependencies**: 1.1.1  
**Assignee**: Claude Code  

**Description**:
Create root documentation for the ecosystem.

**Acceptance Criteria**:
- [ ] Project overview included
- [ ] Quick start commands documented
- [ ] Package structure explained
- [ ] Links to individual app READMEs

---

#### Task 1.1.8: Set up ESLint shared config
**Hours**: 2  
**Dependencies**: 1.1.2  
**Assignee**: Claude Code  

**Description**:
Create shared ESLint configuration package.

**Acceptance Criteria**:
- [ ] packages/eslint-config created
- [ ] TypeScript rules configured
- [ ] React rules configured
- [ ] Consistent formatting rules

---

#### Task 1.1.9: Set up Prettier shared config
**Hours**: 1  
**Dependencies**: 1.1.2  
**Assignee**: Claude Code  

**Description**:
Create shared Prettier configuration.

**Acceptance Criteria**:
- [ ] .prettierrc created at root
- [ ] .prettierignore created
- [ ] Consistent with existing project style

---

### Sprint 1.2: Code Migration (16 hours)

#### Task 1.2.1: Create apps/curated/ directory structure
**Hours**: 1  
**Dependencies**: 1.1.3  
**Assignee**: Claude Code  

**Description**:
Create the directory structure for Curated applications.

**Acceptance Criteria**:
- [ ] apps/curated/marketplace-frontend created
- [ ] apps/curated/vendor-portal created
- [ ] apps/curated/vendure-backend created
- [ ] Each has placeholder README.md

---

#### Task 1.2.2: Move marketplace-frontend to apps/curated/ 🔴
**Hours**: 3  
**Dependencies**: 1.2.1  
**Assignee**: Claude Code  

**Description**:
Migrate the marketplace frontend application.

**Acceptance Criteria**:
- [ ] All source files moved
- [ ] package.json updated with new name
- [ ] tsconfig.json extends base config
- [ ] Import paths updated if needed
- [ ] Build still works

**Verification**:
```bash
pnpm --filter curated-marketplace-frontend build
```

---

#### Task 1.2.3: Move vendure-backend to apps/curated/ 🔴
**Hours**: 3  
**Dependencies**: 1.2.1  
**Assignee**: Claude Code  

**Description**:
Migrate the Vendure backend application.

**Acceptance Criteria**:
- [ ] All source files moved
- [ ] package.json updated with new name
- [ ] Configuration files updated
- [ ] Database connection maintained
- [ ] Build still works

---

#### Task 1.2.4: Update workspace references
**Hours**: 2  
**Dependencies**: 1.2.2, 1.2.3  
**Assignee**: Claude Code  

**Description**:
Update all inter-package references.

**Acceptance Criteria**:
- [ ] All workspace: references correct
- [ ] No broken imports
- [ ] pnpm install succeeds
- [ ] TypeScript resolves all paths

---

#### Task 1.2.5: Create packages/ directory
**Hours**: 1  
**Dependencies**: 1.1.3  
**Assignee**: Claude Code  

**Description**:
Initialize the shared packages directory.

**Acceptance Criteria**:
- [ ] packages/ directory created
- [ ] README.md explaining package purpose

---

#### Task 1.2.6: Move ska-ontology to packages/
**Hours**: 2  
**Dependencies**: 1.2.5  
**Assignee**: Claude Code  

**Description**:
Relocate existing ska-ontology package.

**Acceptance Criteria**:
- [ ] Package moved to packages/ska-ontology
- [ ] Package name updated to @jade/ska-ontology
- [ ] Exports verified
- [ ] Consuming apps updated

---

#### Task 1.2.7: Update ska-ontology package.json
**Hours**: 1  
**Dependencies**: 1.2.6  
**Assignee**: Claude Code  

**Description**:
Update package configuration for monorepo.

**Acceptance Criteria**:
- [ ] Name is @jade/ska-ontology
- [ ] Version follows semver
- [ ] Exports field configured
- [ ] Build script works

---

#### Task 1.2.8: Create specs/ directory structure
**Hours**: 1  
**Dependencies**: 1.1.1  
**Assignee**: Claude Code  

**Description**:
Set up specifications directory.

**Acceptance Criteria**:
- [ ] specs/ directory created
- [ ] 010, 011, 012 subdirectories exist
- [ ] SPECKIT template available

---

#### Task 1.2.9: Move existing specs to new location
**Hours**: 2  
**Dependencies**: 1.2.8  
**Assignee**: Claude Code  

**Description**:
Migrate all specification documents.

**Acceptance Criteria**:
- [ ] 010-ska-mach-evolution specs moved
- [ ] 011-vendor-portal specs moved
- [ ] 012-ecosystem-separation specs placed
- [ ] All internal links updated

---

### Sprint 1.3: Validation (10 hours)

#### Task 1.3.1: Run pnpm install and verify 🔴
**Hours**: 2  
**Dependencies**: All 1.2.*  
**Assignee**: Claude Code  

**Description**:
Verify workspace installation succeeds.

**Acceptance Criteria**:
- [ ] pnpm install exits with code 0
- [ ] No peer dependency warnings
- [ ] Lock file generated correctly
- [ ] All packages resolved

---

#### Task 1.3.2: Run pnpm build and verify 🔴
**Hours**: 2  
**Dependencies**: 1.3.1  
**Assignee**: Claude Code  

**Description**:
Verify all packages and apps build.

**Acceptance Criteria**:
- [ ] turbo build exits with code 0
- [ ] All dist/ directories created
- [ ] No TypeScript errors
- [ ] Build order correct

---

#### Task 1.3.3: Run pnpm dev and verify 🔴
**Hours**: 2  
**Dependencies**: 1.3.1  
**Assignee**: Claude Code  

**Description**:
Verify development servers start.

**Acceptance Criteria**:
- [ ] Marketplace frontend starts on port 5173
- [ ] Vendure backend starts on port 3000
- [ ] Hot reload works
- [ ] No console errors

---

#### Task 1.3.4: Run existing tests
**Hours**: 2  
**Dependencies**: 1.3.2  
**Assignee**: Claude Code  

**Description**:
Verify all existing tests pass.

**Acceptance Criteria**:
- [ ] All unit tests pass
- [ ] Coverage maintained
- [ ] No flaky tests

---

#### Task 1.3.5: Document any issues
**Hours**: 1  
**Dependencies**: 1.3.*  
**Assignee**: Claude Code  

**Description**:
Record any issues encountered during validation.

**Acceptance Criteria**:
- [ ] Issues documented in MIGRATION.md
- [ ] Workarounds noted
- [ ] Future improvements listed

---

#### Task 1.3.6: Create recovery tag
**Hours**: 1  
**Dependencies**: 1.3.4  
**Assignee**: Claude Code  

**Description**:
Create Git tag for rollback point.

**Acceptance Criteria**:
- [ ] Tag `pre-ecosystem-migration` created
- [ ] Tag pushed to remote
- [ ] Recovery instructions documented

---

## Phase 2: Package Extraction (80 hours)

### Sprint 2.1: @jade/ui Foundation (21 hours)

#### Task 2.1.1: Create packages/jade-ui directory
**Hours**: 1  
**Dependencies**: Phase 1 Complete  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] packages/jade-ui created
- [ ] Basic structure established (src/, tests/)

---

#### Task 2.1.2: Initialize package.json with exports
**Hours**: 2  
**Dependencies**: 2.1.1  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] Name is @jade/ui
- [ ] Exports field configured for ESM
- [ ] Peer dependencies defined (react, react-dom)
- [ ] Build script configured

---

#### Task 2.1.3: Set up TypeScript configuration
**Hours**: 2  
**Dependencies**: 2.1.2  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] tsconfig.json extends base
- [ ] Declaration files generated
- [ ] Source maps enabled

---

#### Task 2.1.4: Create design tokens (colors)
**Hours**: 3  
**Dependencies**: 2.1.3  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] Jade color palette defined
- [ ] Semantic colors (background, foreground, etc.)
- [ ] CSS custom properties exported
- [ ] TypeScript types generated

---

#### Task 2.1.5: Create design tokens (spacing)
**Hours**: 2  
**Dependencies**: 2.1.3  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] Spacing scale (0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32)
- [ ] Named spacing (sm, md, lg, xl)
- [ ] CSS custom properties exported

---

#### Task 2.1.6: Create design tokens (typography)
**Hours**: 2  
**Dependencies**: 2.1.3  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] Font families defined
- [ ] Font sizes scale
- [ ] Line heights configured
- [ ] Font weights specified

---

#### Task 2.1.7: Set up CSS variables system
**Hours**: 3  
**Dependencies**: 2.1.4, 2.1.5, 2.1.6  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] :root CSS variables generated
- [ ] Dark mode support structure
- [ ] Import via single CSS file

---

#### Task 2.1.8: Add Tailwind preset
**Hours**: 2  
**Dependencies**: 2.1.7  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] Tailwind preset extends design tokens
- [ ] Custom colors available (jade-500, etc.)
- [ ] Custom spacing available
- [ ] Preset exportable for apps

---

#### Task 2.1.9: Create package build script
**Hours**: 2  
**Dependencies**: 2.1.2  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] tsup or Vite library mode configured
- [ ] ESM and CJS outputs
- [ ] CSS bundled correctly
- [ ] Types generated

---

#### Task 2.1.10: Write design token tests
**Hours**: 2  
**Dependencies**: 2.1.4, 2.1.5, 2.1.6  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] All tokens have tests
- [ ] TypeScript types validated
- [ ] CSS output snapshot tested

---

### Sprint 2.2: Component Extraction (19 hours)

#### Task 2.2.1: Extract Button component
**Hours**: 3  
**Dependencies**: Sprint 2.1  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] All variants supported (primary, secondary, outline, ghost)
- [ ] All sizes supported (sm, md, lg)
- [ ] Loading state works
- [ ] Disabled state works
- [ ] Uses design tokens

---

#### Task 2.2.2: Extract Input component
**Hours**: 3  
**Dependencies**: Sprint 2.1  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] Text, password, email types supported
- [ ] Error state with message
- [ ] Disabled state
- [ ] Prefix/suffix slots
- [ ] Uses design tokens

---

#### Task 2.2.3: Extract Card component
**Hours**: 2  
**Dependencies**: Sprint 2.1  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] Header, body, footer slots
- [ ] Bordered and shadow variants
- [ ] Hover states optional
- [ ] Uses design tokens

---

#### Task 2.2.4: Extract Modal/Dialog component
**Hours**: 3  
**Dependencies**: Sprint 2.1  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] Uses Radix Dialog internally
- [ ] Controlled and uncontrolled modes
- [ ] Closes on escape
- [ ] Focus trap works
- [ ] Animations smooth

---

#### Task 2.2.5: Create component barrel exports
**Hours**: 1  
**Dependencies**: 2.2.1-4  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] index.ts exports all components
- [ ] Tree-shaking works
- [ ] Types exported

---

#### Task 2.2.6: Write Button tests
**Hours**: 2  
**Dependencies**: 2.2.1  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] All variants tested
- [ ] Click events tested
- [ ] Accessibility checked

---

#### Task 2.2.7: Write Input tests
**Hours**: 2  
**Dependencies**: 2.2.2  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] All input types tested
- [ ] Controlled input tested
- [ ] Error states tested

---

#### Task 2.2.8: Update Curated imports
**Hours**: 3  
**Dependencies**: 2.2.5  
**Assignee**: Claude Code  

**Acceptance Criteria**:
- [ ] All relative imports replaced with @jade/ui
- [ ] No duplicate component definitions
- [ ] Build succeeds
- [ ] Visual parity maintained

---

### Sprint 2.3: Additional Components (20 hours)

*(Tasks 2.3.1 - 2.3.6 follow same pattern)*

---

### Sprint 2.4: Supporting Packages (20 hours)

*(Tasks 2.4.1 - 2.4.6 follow same pattern)*

---

## Phase 3: App Scaffolds (40 hours)

### Sprint 3.1: Aura Scaffold (15 hours)

*(Tasks 3.1.1 - 3.1.8)*

---

### Sprint 3.2: Sanctuary Scaffold (15 hours)

*(Tasks 3.2.1 - 3.2.8)*

---

### Sprint 3.3: Feature Flags & Integration (10 hours)

*(Tasks 3.3.1 - 3.3.4)*

---

## Phase 4: CI/CD Setup (40 hours)

### Sprint 4.1: GitHub Actions (16 hours)

*(Tasks 4.1.1 - 4.1.6)*

---

### Sprint 4.2: Branch Protection (14 hours)

*(Tasks 4.2.1 - 4.2.6)*

---

### Sprint 4.3: Documentation (10 hours)

*(Tasks 4.3.1 - 4.3.5)*

---

## Task Summary

| Phase | Sprint | Tasks | Hours |
|-------|--------|-------|-------|
| 1 | 1.1 | 9 | 14 |
| 1 | 1.2 | 9 | 16 |
| 1 | 1.3 | 6 | 10 |
| 2 | 2.1 | 10 | 21 |
| 2 | 2.2 | 8 | 19 |
| 2 | 2.3 | 6 | 20 |
| 2 | 2.4 | 6 | 20 |
| 3 | 3.1 | 8 | 15 |
| 3 | 3.2 | 8 | 15 |
| 3 | 3.3 | 4 | 10 |
| 4 | 4.1 | 6 | 16 |
| 4 | 4.2 | 6 | 14 |
| 4 | 4.3 | 5 | 10 |
| **Total** | | **68** | **200** |

---

**Next Document**: `checklist.md` - Compliance verification checklist
