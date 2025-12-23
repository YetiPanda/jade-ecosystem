# CLAUDE.md - Project Instructions for Claude Code
# JADE Ecosystem - Multi-Feature Development

> **This file is automatically read by Claude Code at the start of each session.**

---

## 🎯 Active Features

### Feature 012: Ecosystem Separation ⭐ **NEW - PRIORITY**
**Status**: Phase 1 - Monorepo Shell
**Current Sprint**: 1.1 - Repository Initialization
**Branch**: `feature/012-ecosystem-separation`

### Feature 011: Vendor Portal MVP
**Status**: Phase A - Foundation (ACTIVE)
**Current Sprint**: A.1 - Vendor Profile Schema
**Branch**: `feature/011-vendor-portal`

### Feature 010: SKA MACH Evolution
**Status**: Phase 1 - Foundation (ON HOLD)
**Current Sprint**: 1.1 - Constraint Relations Database
**Branch**: `feature/010-ska-mach-evolution`

---

## 🆕 Latest Handoff: Feature 012 - Ecosystem Separation

**Date**: December 23, 2025  
**Status**: APPROVED - Ready for implementation  
**Priority**: HIGH - Begin immediately

### Core Objective
Transform the JADE proof-of-concept into a scalable monorepo with three independently deployable applications using Turborepo.

### Applications
| App | Purpose | Status |
|-----|---------|--------|
| **Curated by Jade** | B2B Skincare Marketplace | ACTIVE - Migrate first |
| **Aura by Jade** | Spa Operations Platform | SCAFFOLD ONLY |
| **Spa-ce Sanctuary** | Professional Community | SCAFFOLD ONLY |

### Handoff Documents (Read These First)
| Document | Location | Purpose |
|----------|----------|---------|
| **CLAUDE-CODE-HANDOFF.md** | `specs/012-ecosystem-separation/` | Implementation guide |
| **spec.md** | `specs/012-ecosystem-separation/` | Full specification |
| **plan.md** | `specs/012-ecosystem-separation/` | 5-week timeline |
| **tasks.md** | `specs/012-ecosystem-separation/` | 68 detailed tasks |
| **checklist.md** | `specs/012-ecosystem-separation/` | Compliance tracking |

---

## Quick Start for Feature 012

### 1. Read the Handoff First
```
specs/012-ecosystem-separation/CLAUDE-CODE-HANDOFF.md
```

### 2. Current Sprint: 1.1 - Repository Initialization

**Active Tasks**:
- [ ] Task 1.1.1: Create jade-ecosystem repository (1 hour)
- [ ] Task 1.1.2: Initialize pnpm workspace (2 hours)
- [ ] Task 1.1.3: Add Turborepo configuration (2 hours)
- [ ] Task 1.1.4: Create base tsconfig.json (2 hours)
- [ ] Task 1.1.5: Add .gitignore and .npmrc (1 hour)
- [ ] Task 1.1.6: Create CONSTITUTION.md (2 hours)
- [ ] Task 1.1.7: Create README.md (1 hour)
- [ ] Task 1.1.8: Set up ESLint shared config (2 hours)
- [ ] Task 1.1.9: Set up Prettier shared config (1 hour)

**Sprint 1.1 Total**: 14 hours

### 3. Target Directory Structure

```
jade-ecosystem/                     # NEW MONOREPO
├── apps/
│   ├── curated/                    # Migrated from jade-spa-marketplace
│   │   ├── marketplace-frontend/
│   │   ├── vendor-portal/
│   │   └── vendure-backend/
│   ├── aura/                       # Phase 3 scaffold
│   └── sanctuary/                  # Phase 3 scaffold
├── packages/
│   ├── ska-ontology/               # Existing, relocated
│   └── jade-ui/                    # Phase 2 extraction
├── specs/
│   ├── 010-ska-mach-evolution/
│   ├── 011-vendor-portal/
│   └── 012-ecosystem-separation/
├── CONSTITUTION.md
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

---

## Constitutional Constraints (MUST FOLLOW)

### Article VIII: UI Stability Protection
**The UI is immutable.** Backend services MUST adapt to existing UI contracts.
- Never modify existing component prop interfaces
- GraphQL changes must be additive only (no breaking changes)
- New fields require 2-week deprecation notice before removal

### Article IX: Package Contract Stability (NEW)
**Shared packages are stability contracts.**
- All packages MUST follow semver
- Breaking changes require deprecation cycle
- CI must validate cross-app compatibility

### Article III: Test-Driven Development
- Write tests BEFORE implementation
- Minimum 80% coverage for new code
- All acceptance criteria must have corresponding tests

### SPECKIT Methodology
- All work must trace back to tasks in `tasks.md`
- Update checklist.md as tasks complete
- Document deviations in spec.md

---

## Architecture Context

### Current Stack (jade-spa-marketplace)
```
Frontend: React 18 + Vite + TypeScript + Apollo GraphQL
Backend:  Vendure e-commerce framework
Database: PostgreSQL
Hosting:  Northflank.com
```

### Target Stack (jade-ecosystem)
```
Structure: Turborepo monorepo with pnpm workspaces
Apps:     Curated, Aura, Sanctuary (independently deployable)
Packages: @jade/ui, @jade/auth, @jade/config, @jade/ska-ontology
CI/CD:    GitHub Actions with Turborepo remote caching
```

---

## Working with This Project

### Directory Structure
```
/Users/jessegarza/JADE/
├── jade-ecosystem/              # NEW - Feature 012 target
├── jade-spa-marketplace/        # EXISTING - Source for migration
├── Five-Rings-Temp/             # Specs and planning
└── dermalogica-mvp/             # Reference implementation
```

### Branch Strategy for Feature 012
```bash
# Main development branch
git checkout -b feature/012-ecosystem-separation

# Sprint branches (optional)
git checkout -b feature/012-sprint-1.1-init
```

### Commit Convention
```
feat(012): complete Sprint 1.1 - Repository Initialization

- Task 1.1.1: Created jade-ecosystem repository
- Task 1.1.2: Initialized pnpm workspace
- Task 1.1.3: Added Turborepo configuration

Refs: 012-ecosystem-separation
```

---

## Critical Reminders

### Protect Feature 011
Feature 011 (Vendor Portal) is actively in development:
- ✅ All existing builds must continue working
- ✅ Feature 011 can continue development in apps/curated/vendor-portal
- ❌ Do NOT modify Vendor Portal code unless necessary

### Recovery Strategy
```bash
# Create recovery tag BEFORE making changes
git tag -a pre-ecosystem-migration -m "Before Feature 012"
git push origin pre-ecosystem-migration

# To recover if needed
git checkout pre-ecosystem-migration
```

### Phase 1 Gate Criteria
Before moving to Phase 2, verify:
- [ ] `pnpm build` exits with code 0
- [ ] `pnpm dev` starts marketplace frontend
- [ ] All existing tests pass
- [ ] Feature 011 can continue development

---

## Feature 011: Vendor Portal - Quick Reference

*Feature 011 continues in parallel within apps/curated/vendor-portal*

### Current Sprint: A.1 (Vendor Profile Schema)
- Task A.1.1: Create VendorProfile TypeORM entity
- Task A.1.5: Create VendorValue enum
- Task A.1.8: Create VendorCertification entity
- Task A.1.10: Create database migration

### Specifications
All specs in `specs/011-vendor-portal/`:
- `spec.md` - Full requirements
- `plan.md` - 14-week implementation plan
- `tasks.md` - 171 detailed tasks

---

## Feature 010: SKA MACH Evolution - Quick Reference

*Feature 010 is ON HOLD pending Feature 012 completion*

### Status
- Phase 1 Foundation work paused
- Will resume after ecosystem separation complete
- Specs remain in `specs/010-ska-mach-evolution/`

---

## Next Actions

### Feature 012 (PRIORITY)
1. ⭐ **Read handoff document**: `specs/012-ecosystem-separation/CLAUDE-CODE-HANDOFF.md`
2. ⭐ **Begin Sprint 1.1**: Repository Initialization
3. ⭐ **Update checklist** as tasks complete

### Feature 011 (CONTINUES IN PARALLEL)
1. Continue Sprint A.1 in `apps/curated/vendor-portal` after migration
2. No breaking changes to existing code

### Feature 010 (ON HOLD)
1. Resume after Feature 012 Phase 1 complete

---

## Session Continuity

When starting a new Claude Code session:
1. Claude Code will automatically read this CLAUDE.md file
2. Check Feature 012 checklist for current progress
3. Reference specific tasks by number (e.g., "Working on Task 1.1.1")
4. Update checklist.md as you complete tasks

---

Ready to build the JADE Ecosystem! 🚀
