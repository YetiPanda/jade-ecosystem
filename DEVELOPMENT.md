# JADE Ecosystem - Development Workflow

This document describes the development workflow for the JADE ecosystem monorepo.

## Prerequisites

- **Node.js**: 20.x or higher
- **pnpm**: 8.15.0 or higher
- **Git**: 2.40.0 or higher

## Repository Structure

```
jade-ecosystem/
├── apps/
│   ├── curated/
│   │   ├── marketplace-frontend/    # Curated e-commerce marketplace
│   │   ├── vendure-backend/         # Vendure backend
│   │   └── vendor-portal/           # Vendor portal (planned)
│   ├── aura/
│   │   └── spa-dashboard/           # Aura spa dashboard
│   └── sanctuary/
│       └── community-frontend/      # Sanctuary community platform
├── packages/
│   ├── jade-ui/                     # Shared UI component library
│   ├── feature-flags/               # Feature flags system
│   ├── ska-ontology/                # SKA ontology package
│   └── [other packages]/
└── specs/                           # Feature specifications
```

## Getting Started

### 1. Install Dependencies

```bash
# Install all dependencies across the monorepo
pnpm install
```

This will install dependencies for all packages and applications using pnpm workspaces.

### 2. Build Packages

```bash
# Build all packages
pnpm build

# Build a specific package
pnpm --filter @jade/ui build
pnpm --filter @jade/feature-flags build
```

### 3. Development Mode

Run applications in development mode with hot module replacement:

```bash
# Run Curated marketplace
pnpm --filter curated-marketplace-frontend dev

# Run Aura spa dashboard
pnpm --filter aura-spa-dashboard dev

# Run Sanctuary community
pnpm --filter sanctuary-community-frontend dev
```

**Pro tip**: You can run multiple apps simultaneously in separate terminal windows.

## Available Applications

### Curated Marketplace
- **Package**: `curated-marketplace-frontend`
- **Port**: Default Vite port (usually 5173)
- **Description**: E-commerce marketplace for curated beauty products

### Aura Spa Dashboard
- **Package**: `aura-spa-dashboard`
- **Port**: Default Vite port (usually 5174)
- **Description**: Dashboard application for spa owners and managers
- **Pages**: Dashboard, Analytics, Settings

### Sanctuary Community
- **Package**: `sanctuary-community-frontend`
- **Port**: Default Vite port (usually 5175)
- **Description**: Community platform for beauty enthusiasts
- **Pages**: Community Feed, Events, Profile

## Working with Packages

### @jade/ui Component Library

The shared UI component library used by all applications.

```bash
# Build the UI library
pnpm --filter @jade/ui build

# Watch mode for development
pnpm --filter @jade/ui dev
```

**Available components**: Button, Card, Input, Dialog, Sidebar, Badge, and many more.

### @jade/feature-flags

Feature flags system for controlling app visibility and features.

```bash
# Build feature flags package
pnpm --filter @jade/feature-flags build
```

**Usage**:
```typescript
import { isAppEnabled, getEnabledApps } from '@jade/feature-flags';

if (isAppEnabled('aura')) {
  // Aura is enabled
}
```

## Turborepo Commands

The monorepo uses Turborepo for build orchestration and caching.

```bash
# Build all packages and apps
pnpm build

# Build with cache disabled
pnpm build --force

# Build a specific app and its dependencies
pnpm --filter aura-spa-dashboard build

# Run tests across the monorepo
pnpm test

# Lint all code
pnpm lint
```

### Turborepo Caching

Turborepo automatically caches build outputs. Benefits:
- **Faster builds**: Skip rebuilding unchanged packages
- **Smart dependencies**: Only rebuild what's necessary
- **Remote caching**: Share cache across team (when configured)

## Making Changes

### Adding a New Component to @jade/ui

1. Create the component file in `packages/jade-ui/src/components/`
2. Export it from `packages/jade-ui/src/components/index.ts`
3. Build the package: `pnpm --filter @jade/ui build`
4. Use it in your app: `import { YourComponent } from '@jade/ui'`

### Creating a New Page

**For Aura:**
```bash
# Create new page file
touch apps/aura/spa-dashboard/src/pages/NewPage.tsx

# Add route in App.tsx
# <Route path="new-page" element={<NewPage />} />
```

**For Sanctuary:**
```bash
# Create new page file
touch apps/sanctuary/community-frontend/src/pages/NewPage.tsx

# Add route in App.tsx
# <Route path="new-page" element={<NewPage />} />
```

### Adding Dependencies

```bash
# Add to a specific app
pnpm --filter aura-spa-dashboard add package-name

# Add to @jade/ui
pnpm --filter @jade/ui add package-name

# Add as dev dependency
pnpm --filter aura-spa-dashboard add -D package-name
```

## Feature Flags

Control which apps are enabled using environment variables:

```bash
# .env file
FEATURE_FLAG_CURATED=true
FEATURE_FLAG_AURA=true
FEATURE_FLAG_SANCTUARY=false
```

By default, all apps are enabled.

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific app
pnpm --filter aura-spa-dashboard test

# Run tests in watch mode
pnpm --filter @jade/ui test --watch
```

## Building for Production

```bash
# Build all apps and packages
pnpm build

# Build specific app
pnpm --filter curated-marketplace-frontend build
pnpm --filter aura-spa-dashboard build
pnpm --filter sanctuary-community-frontend build
```

**Build outputs**:
- **Curated**: `apps/curated/marketplace-frontend/dist/`
- **Aura**: `apps/aura/spa-dashboard/dist/`
- **Sanctuary**: `apps/sanctuary/community-frontend/dist/`

## Common Tasks

### Update All Dependencies

```bash
# Update all workspace dependencies
pnpm up -r --latest
```

### Clear Build Cache

```bash
# Clean all build outputs
pnpm clean

# Or manually
rm -rf packages/*/dist apps/*/dist
```

### Preview Production Build

```bash
# Build and preview
pnpm --filter aura-spa-dashboard build
pnpm --filter aura-spa-dashboard preview
```

## Troubleshooting

### "Package not found" errors

Run `pnpm install` from the repository root to ensure all workspace links are created.

### Build failing

1. Clean build outputs: `rm -rf node_modules/.cache`
2. Reinstall dependencies: `pnpm install`
3. Rebuild packages: `pnpm build --force`

### Type errors in apps

Ensure `@jade/ui` is built:
```bash
pnpm --filter @jade/ui build
```

## Git Workflow

### Branch Strategy

- `main`: Production-ready code
- `feature/*`: New features
- `fix/*`: Bug fixes

### Commit Convention

```bash
feat(ui): add new Button variant
fix(aura): resolve dashboard layout issue
docs(sanctuary): update events page documentation
```

### Creating Pull Requests

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit
3. Push to remote: `git push origin feature/new-feature`
4. Create PR targeting `main`

## Additional Resources

- **Turborepo Docs**: https://turbo.build/repo/docs
- **pnpm Workspaces**: https://pnpm.io/workspaces
- **Vite**: https://vite.dev/
- **React Router**: https://reactrouter.com/

## Getting Help

- Check existing specifications in `specs/`
- Review component documentation in `packages/jade-ui/src/components/`
- Refer to CLAUDE.md for project-specific instructions
