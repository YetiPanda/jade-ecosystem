# JADE Ecosystem Migration Notes

**Feature**: 012 - Ecosystem Separation
**Phase**: 1 - Monorepo Shell
**Date**: December 23, 2025

---

## Migration Summary

Successfully migrated the JADE proof-of-concept from `jade-spa-marketplace` to the new `jade-ecosystem` monorepo structure using Turborepo and pnpm workspaces.

### What Was Migrated

#### Applications
- `apps/marketplace-frontend` → `apps/curated/marketplace-frontend` ✅
- `apps/vendure-backend` → `apps/curated/vendure-backend` ✅

#### Packages
- `packages/ska-ontology` ✅
- `packages/shared-types` ✅
- `packages/shared-layouts` ✅
- `packages/shared-utils` ✅
- `packages/ui-components` ✅
- `packages/vector-db` ⚠️ (see known issues)

#### Specifications
- All specs from `010-ska-mach-evolution` ✅
- All specs from `011-vendor-portal` ✅
- New specs for `012-ecosystem-separation` ✅

---

## Build Status

### Successful Builds ✅
- `curated-marketplace-frontend` - Built successfully
- `curated-vendure-backend` - Built successfully
- `@jade/shared-types` - Built successfully
- `@jade/shared-layouts` - Built successfully
- `@jade/shared-utils` - Built successfully
- `@jade/ui-components` - Built successfully
- `@jade/ska-ontology` - No build required (ontology files)

### Known Issues ⚠️

#### Issue 1: @jade/vector-db Build Failures

**Status**: Non-blocking for Phase 1

**Description**:
The `@jade/vector-db` package fails to build due to TypeScript errors related to Milvus SDK API changes:

```
src/collections/product-embeddings.ts(207,39): error TS2345:
Argument of type '{ collection_name: string; vector: number[]; ... }'
is not assignable to parameter of type 'SearchReq | SearchSimpleReq | HybridSearchReq'.
Property 'data' is missing but required in type 'SearchSimpleReq'.
```

**Root Cause**:
The Milvus SDK (`@zilliz/milvus2-sdk-node`) has updated its API, and the search method now requires a `data` property instead of individual `collection_name` and `vector` properties.

**Impact**:
- Vector search functionality is currently unavailable
- Does NOT affect core marketplace functionality
- Does NOT affect vendor portal functionality
- Does NOT block Feature 011 development

**Workaround**:
For now, vector-db can be excluded from builds using:
```bash
pnpm build --filter=!@jade/vector-db
```

**Resolution Plan**:
Update the vector-db package to use the new Milvus SDK API in a future sprint (not part of Phase 1).

---

## Configuration Changes Made

### 1. Turborepo Configuration

**File**: `turbo.json`

**Change**: Updated `pipeline` → `tasks` for Turborepo 2.x compatibility

```json
{
  "tasks": {  // Was "pipeline" in older versions
    "build": { ... },
    "dev": { ... }
  }
}
```

### 2. TypeScript Configuration

**Files Created**:
- Root `tsconfig.json` with path aliases
- Maintained `tsconfig.base.json` for shared compiler options

**Files Updated**:
- `packages/vector-db/tsconfig.json` - Updated module settings for ES2022 compatibility

### 3. Package Names

Updated package names to follow monorepo convention:
- `@jade/marketplace-frontend` → `curated-marketplace-frontend`
- `@jade/vendure-backend` → `curated-vendure-backend`
- All `@jade/*` packages maintained their scoped names

---

## Workspace Structure

```
jade-ecosystem/
├── apps/curated/              # Curated by Jade applications
│   ├── marketplace-frontend/  # Consumer marketplace
│   ├── vendor-portal/         # Seller dashboard (placeholder)
│   └── vendure-backend/       # E-commerce backend
├── packages/                  # Shared libraries
│   ├── eslint-config/         # Shared ESLint rules
│   ├── ska-ontology/          # Semantic Knowledge Atoms
│   ├── shared-types/          # TypeScript types
│   ├── shared-layouts/        # Layout components
│   ├── shared-utils/          # Utility functions
│   ├── ui-components/         # UI component library
│   └── vector-db/             # Vector search (build issues)
└── specs/                     # SPECKIT specifications
```

---

## Dependencies

### Workspace Dependencies Installed
- Total packages: 9 workspace packages
- External dependencies: ~2000+ packages
- Installation time: ~25 seconds
- pnpm version: 8.15.0
- Node version: 20.x

### Peer Dependency Warnings

Minor peer dependency mismatches in `curated-vendure-backend`:
```
@nestjs/testing 11.1.10
├── ✕ unmet peer @nestjs/common@^11.0.0: found 10.4.20
└── ✕ unmet peer @nestjs/core@^11.0.0: found 10.4.20
```

**Impact**: Low - These are development dependencies for testing
**Action Required**: None for Phase 1

---

## Next Steps

### Sprint 1.3 Remaining Tasks
- [ ] Task 1.3.3: Verify `pnpm dev` starts development servers
- [ ] Task 1.3.4: Run existing test suites
- [ ] Task 1.3.6: Create recovery tag `pre-ecosystem-migration`

### Phase 1 Completion Criteria
- [x] Monorepo structure established
- [x] All critical apps build successfully
- [x] Workspace dependencies resolved
- [ ] Development servers start correctly
- [ ] Existing tests pass
- [ ] Recovery tag created

### Future Work (Not Phase 1)
- Fix `@jade/vector-db` Milvus SDK compatibility
- Extract `@jade/ui` design system (Phase 2)
- Create Aura and Sanctuary scaffolds (Phase 3)
- Set up CI/CD pipelines (Phase 4)

---

## Rollback Instructions

If issues arise, rollback to the original repository:

```bash
# The original jade-spa-marketplace repo is untouched
cd /Users/jessegarza/JADE/jade-spa-marketplace

# Recovery tag will be created at:
git checkout pre-ecosystem-migration
```

---

## Validation Checklist

| Check | Status | Notes |
|-------|--------|-------|
| Repository created | ✅ | https://github.com/YetiPanda/jade-ecosystem |
| pnpm workspace configured | ✅ | 9 packages in workspace |
| Turborepo configured | ✅ | Using tasks (v2.x) |
| Marketplace frontend builds | ✅ | dist/ directory created |
| Vendure backend builds | ✅ | dist/ directory created |
| Shared packages build | ✅ | Except vector-db |
| Dependencies installed | ✅ | No critical errors |
| TypeScript compiles | ✅ | For critical packages |
| Development servers start | ⏳ | Pending verification |
| Tests pass | ⏳ | Pending verification |

---

**Last Updated**: December 23, 2025
**Author**: Claude Code
**Reviewer**: Jesse Garza (pending)
