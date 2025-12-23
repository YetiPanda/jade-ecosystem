# Shared Packages

This directory contains shared libraries used across all JADE ecosystem applications.

## Available Packages

### @jade/ui
Shared design system and component library.
- Design tokens (colors, spacing, typography)
- Base components (Button, Input, Card, Modal)
- Layout components
- React hooks

### @jade/auth
Unified authentication utilities.
- AWS Cognito integration
- Auth provider and hooks
- Authentication guards

### @jade/ska-ontology
Semantic Knowledge Atoms for AI governance and ingredient intelligence.
- SKA meta-schema
- Regulatory compliance atoms
- Agentic extensions

### @jade/graphql-types
Auto-generated TypeScript types from GraphQL schemas.

### @jade/config
Shared configuration utilities.

### @jade/analytics
Event tracking and analytics.

### @jade/eslint-config
Shared ESLint configuration for all packages and apps.

---

## Creating a New Package

```bash
# Create package directory
mkdir packages/jade-new-package
cd packages/jade-new-package

# Initialize package
pnpm init

# Set package name to @jade/new-package
# Add exports field for public API
```

## Package Guidelines

1. **Name Convention**: Use `@jade/package-name` format
2. **Versioning**: Follow semantic versioning strictly
3. **Exports**: Define clear public API via `exports` field
4. **Tests**: Minimum 80% coverage required
5. **Documentation**: Include README.md with usage examples
