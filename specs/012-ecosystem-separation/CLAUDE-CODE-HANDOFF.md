# CLAUDE-CODE-HANDOFF.md
## Feature 012: JADE Ecosystem Separation

**Handoff Date**: December 23, 2025  
**From**: Claude (Chat Interface)  
**To**: Claude Code  
**Priority**: HIGH - Begin immediately after reading

---

## 🎯 Mission Brief

You are implementing **Feature 012: JADE Ecosystem Separation** — transforming the JADE proof-of-concept into a scalable monorepo with three independently deployable applications.

### The Big Picture
Think of this as converting a food court (shared everything) into a restaurant group (shared kitchen, separate storefronts).

**Three Apps**:
1. **Curated by Jade** (Marketplace) — ACTIVE, Feature 011 in progress
2. **Aura by Jade** (Spa Operations) — SCAFFOLD ONLY
3. **Spa-ce Sanctuary** (Professional Community) — SCAFFOLD ONLY

**Approved Approach**: Monorepo with Turborepo

---

## 📚 Required Reading (In Order)

Before writing ANY code, read these files:

1. **This handoff** (`CLAUDE-CODE-HANDOFF.md`) — You're here
2. **Specification** (`spec.md`) — Full requirements and architecture
3. **Plan** (`plan.md`) — 5-week implementation timeline
4. **Tasks** (`tasks.md`) — 68 detailed tasks with acceptance criteria
5. **Checklist** (`checklist.md`) — Track completion status

**Also Reference**:
- Original CLAUDE.md for Feature 010/011 context
- `recommendation.md` (project files) for migration philosophy

---

## ⚠️ Critical Constraints

### Constitutional Compliance (MUST FOLLOW)

**Article VIII: UI Stability Protection**
```
The UI is immutable. Backend services MUST adapt to existing UI contracts.
- Never modify existing component prop interfaces
- GraphQL changes must be additive only
- New fields require 2-week deprecation notice before removal
```

**Article IX: Package Contracts (NEW)**
```
Shared packages are stability contracts.
- All packages MUST follow semver
- Breaking changes require deprecation cycle
- CI must validate cross-app compatibility
```

### Feature 011 Protection
**Feature 011 (Vendor Portal) is actively in development.**

You MUST ensure:
- ✅ Feature 011 development can continue uninterrupted
- ✅ All existing builds still work after Phase 1
- ✅ No breaking changes to marketplace-frontend
- ❌ Do NOT modify Vendor Portal code unless explicitly needed

---

## 🚀 Quick Start Commands

### Session Initialization
```bash
# 1. Navigate to working directory
cd /Users/jessegarza/JADE/

# 2. Verify current repos exist
ls -la jade-spa-marketplace/
ls -la Five-Rings-Temp/

# 3. Create new ecosystem repo
mkdir jade-ecosystem && cd jade-ecosystem
git init
pnpm init
```

### Phase 1 Bootstrap
```bash
# Install Turborepo
pnpm add -D turbo

# Create workspace structure
mkdir -p apps/curated packages specs

# Create configuration files
# (See spec.md Appendix A & B for contents)
```

---

## 📋 Sprint 1.1 Tasks (Start Here)

**Objective**: Create the monorepo shell without breaking existing functionality.

### Task 1.1.1: Create jade-ecosystem repository
```bash
# Create repo on GitHub
gh repo create jade-ecosystem --public --clone

# OR if already in directory:
git init
gh repo create jade-ecosystem --source=. --public
```

**Acceptance Criteria**:
- [ ] Repository exists on GitHub
- [ ] Local clone ready
- [ ] Default branch is `main`

---

### Task 1.1.2: Initialize pnpm workspace

Create `pnpm-workspace.yaml`:
```yaml
packages:
  - 'apps/**'
  - 'packages/*'
  - 'services/*'
```

Create `package.json`:
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

**Acceptance Criteria**:
- [ ] `pnpm install` succeeds
- [ ] No errors in console

---

### Task 1.1.3: Add Turborepo configuration

Create `turbo.json`:
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

### Task 1.1.4: Create base tsconfig.json

Create `tsconfig.base.json`:
```json
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

## 🗂️ Directory Structure Target

After Phase 1, your structure should look like:

```
jade-ecosystem/
├── .github/
│   └── workflows/          # CI/CD (Phase 4)
├── apps/
│   └── curated/
│       ├── marketplace-frontend/   # Migrated from jade-spa-marketplace
│       ├── vendor-portal/          # Feature 011 continues here
│       └── vendure-backend/        # Backend services
├── packages/
│   ├── ska-ontology/       # Moved from existing
│   └── jade-ui/            # Phase 2
├── services/               # Future microservices
├── specs/
│   ├── 010-ska-mach-evolution/
│   ├── 011-vendor-portal/
│   └── 012-ecosystem-separation/
├── infrastructure/         # AWS IaC (Future)
├── CONSTITUTION.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── turbo.json
└── README.md
```

---

## 🔄 Migration Path for Existing Code

### Moving jade-spa-marketplace

```bash
# From jade-ecosystem root:

# 1. Copy marketplace-frontend
cp -r ../jade-spa-marketplace/apps/marketplace-frontend apps/curated/

# 2. Copy vendure-backend
cp -r ../jade-spa-marketplace/apps/vendure-backend apps/curated/

# 3. Copy ska-ontology (if exists)
cp -r ../jade-spa-marketplace/packages/ska-ontology packages/

# 4. Copy specs
cp -r ../jade-spa-marketplace/specs/* specs/

# 5. Update package names
# Edit apps/curated/marketplace-frontend/package.json
# Change "name" to "curated-marketplace-frontend"
```

### Verification After Migration
```bash
# Install all dependencies
pnpm install

# Build everything
pnpm build

# Start development
pnpm dev
```

---

## 🔧 Common Issues & Solutions

### Issue: Import paths break after migration
**Solution**: Update TypeScript paths in each app's tsconfig.json:
```json
{
  "compilerOptions": {
    "paths": {
      "@jade/ui": ["../../packages/jade-ui/src"],
      "@jade/ska-ontology": ["../../packages/ska-ontology/src"]
    }
  }
}
```

### Issue: pnpm install fails with peer dependency errors
**Solution**: Add to `.npmrc`:
```
strict-peer-dependencies=false
auto-install-peers=true
```

### Issue: Turborepo doesn't detect packages
**Solution**: Ensure each package has a valid `package.json` with:
- `name` field (must be unique)
- `version` field
- `main` or `exports` field

---

## 📊 Progress Tracking

Update `checklist.md` as you complete tasks:

```markdown
| ✅ | 1.1.1 jade-ecosystem repo created | `gh repo view jade-ecosystem` |
| ✅ | 1.1.2 pnpm workspace configured | `pnpm -v && cat pnpm-workspace.yaml` |
| 🟨 | 1.1.3 Turborepo configured | `npx turbo --version && cat turbo.json` |
```

Commit after each sprint:
```bash
git add .
git commit -m "feat(012): complete Sprint 1.1 - Repository Initialization

- Task 1.1.1: Created jade-ecosystem repository
- Task 1.1.2: Initialized pnpm workspace
- Task 1.1.3: Added Turborepo configuration
...

Refs: 012-ecosystem-separation"
```

---

## 📞 Escalation Points

### If You Get Stuck:
1. **Build failures**: Check that all dependencies are installed
2. **TypeScript errors**: Verify tsconfig extends base correctly
3. **Turborepo issues**: Run `turbo clean` and rebuild
4. **Path resolution**: Check pnpm-workspace.yaml globs

### If Feature 011 Breaks:
1. **STOP** immediately
2. Create a recovery branch: `git checkout -b recovery/pre-012-changes`
3. Document the issue in `MIGRATION.md`
4. Consider if Phase 1 needs adjustment

### Recovery Tag:
```bash
# Create before making changes
git tag -a pre-ecosystem-migration -m "Before Feature 012 migration"
git push origin pre-ecosystem-migration

# To recover if needed
git checkout pre-ecosystem-migration
```

---

## 🎯 Phase 1 Success Criteria

You have successfully completed Phase 1 when:

| Criterion | How to Verify |
|-----------|---------------|
| `pnpm build` exits with code 0 | Run command, check exit code |
| `pnpm dev` starts marketplace | Open http://localhost:5173 |
| All existing tests pass | `pnpm test` |
| Feature 011 can continue | Check vendor-portal builds |
| Recovery tag exists | `git tag -l pre-ecosystem-migration` |

---

## 📅 Timeline Reminder

| Phase | Duration | Your Focus |
|-------|----------|------------|
| **Phase 1** | Week 1 | Repository setup, migration |
| Phase 2 | Weeks 2-3 | Package extraction (@jade/ui) |
| Phase 3 | Week 4 | Aura & Sanctuary scaffolds |
| Phase 4 | Week 5 | CI/CD pipelines |

**Start with Phase 1, Sprint 1.1.**

---

## 🤝 Handoff Complete

You now have everything needed to implement Feature 012. 

**Remember**:
1. Read the spec documents first
2. Work on one task at a time
3. Update the checklist after each task
4. Commit frequently with good messages
5. Protect Feature 011 at all costs

**Good luck, and happy building! 🚀**

---

**Handoff Author**: Claude (Chat Interface)  
**Implementation**: Claude Code  
**Review Required**: Jesse Garza (after each phase)
