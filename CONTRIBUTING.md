# Contributing to JADE Ecosystem

Thank you for your interest in contributing to the JADE Ecosystem! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Pull Request Process](#pull-request-process)
- [Constitutional Governance](#constitutional-governance)
- [Getting Help](#getting-help)

---

## Code of Conduct

### Our Standards

- **Be respectful**: Treat all contributors with respect and professionalism
- **Be constructive**: Provide helpful, actionable feedback
- **Be collaborative**: Work together to achieve common goals
- **Be patient**: Help others learn and grow
- **Be inclusive**: Welcome contributors of all backgrounds and experience levels

### Unacceptable Behavior

- Harassment, discrimination, or offensive language
- Personal attacks or insults
- Trolling or inflammatory comments
- Publishing private information without permission
- Other unprofessional conduct

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js**: Version 20 or higher
- **pnpm**: Version 8.15 or higher
- **Git**: Version 2.40 or higher
- **GitHub Account**: With access to the repository
- **Code Editor**: VS Code recommended

### Initial Setup

1. **Fork the Repository** (external contributors):
   ```bash
   # Click "Fork" on GitHub
   # Clone your fork
   git clone https://github.com/YOUR_USERNAME/jade-ecosystem.git
   cd jade-ecosystem
   ```

2. **Clone the Repository** (team members):
   ```bash
   git clone https://github.com/YetiPanda/jade-ecosystem.git
   cd jade-ecosystem
   ```

3. **Install Dependencies**:
   ```bash
   pnpm install
   ```

4. **Verify Setup**:
   ```bash
   # Run linting
   pnpm lint

   # Run type checking
   pnpm typecheck

   # Build all packages
   pnpm build

   # Run tests
   pnpm test
   ```

   All commands should pass before you start contributing.

### Required Reading

Before making your first contribution, read:

1. **[README.md](./README.md)** - Project overview and architecture
2. **[CONSTITUTION.md](./CONSTITUTION.md)** - Governance framework and principles
3. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - Development workflow and common tasks
4. **[.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md)** - Branch protection rules
5. **[SPECKIT Methodology](./specs/README.md)** - If working on features

---

## Development Workflow

### Branch Strategy

We use a feature branch workflow:

```
main                              # Production-ready code
├── feature/[number]-[name]       # New features
├── bugfix/[issue]-[description]  # Bug fixes
└── hotfix/[issue]-[description]  # Critical production fixes
```

### Creating a Feature Branch

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/[number]-[short-description]

# Example:
git checkout -b feature/013-user-notifications
```

### Branch Naming Convention

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/[number]-[description]` | `feature/013-user-notifications` |
| Bug Fix | `bugfix/[issue]-[description]` | `bugfix/456-fix-order-total` |
| Hotfix | `hotfix/[issue]-[description]` | `hotfix/789-critical-auth-bug` |

### Making Changes

1. **Make Your Changes**:
   ```bash
   # Edit files
   # Add new files as needed
   ```

2. **Follow Coding Standards** (see below)

3. **Write Tests** (required):
   - Minimum 80% code coverage for new code
   - All tests must pass locally

4. **Verify Your Changes**:
   ```bash
   # Lint your code
   pnpm lint

   # Fix auto-fixable issues
   pnpm lint:fix

   # Type check
   pnpm typecheck

   # Build
   pnpm build

   # Run tests
   pnpm test

   # Run tests for specific package
   pnpm test --filter=@jade/ui
   ```

### Commit Convention

We use conventional commits with the following format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring (no functionality change)
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `chore`: Maintenance tasks (dependencies, config)
- `perf`: Performance improvements
- `style`: Code style changes (formatting, whitespace)
- `ci`: CI/CD changes

**Examples**:

```bash
# Feature commit
git commit -m "feat(vendor-portal): add analytics dashboard

- Implement revenue chart component
- Add order metrics display
- Create date range selector

Refs: #123"

# Bug fix commit
git commit -m "fix(curated): resolve order total calculation

The order total was not including tax correctly when
shipping address was in a different state.

Fixes: #456"

# Refactor commit
git commit -m "refactor(ui): extract button variants to constants

No functional changes, improves maintainability."

# Test commit
git commit -m "test(feature-flags): add tests for environment variable parsing

Increases coverage to 95%"
```

### Pushing Changes

```bash
# Push to your feature branch
git push origin feature/013-user-notifications

# If you need to update after review
git push origin feature/013-user-notifications
```

---

## Coding Standards

### TypeScript

- **Use TypeScript strict mode**: All code must pass strict type checking
- **Avoid `any` type**: Use proper types or `unknown` when necessary
- **Use type inference**: Let TypeScript infer types when obvious
- **Export types**: Share types between packages when needed

**Good**:
```typescript
// Good: Proper typing
interface User {
  id: string;
  name: string;
  email: string;
}

function getUserById(id: string): Promise<User | null> {
  // Implementation
}
```

**Bad**:
```typescript
// Bad: Using any
function getUserById(id: any): any {
  // Implementation
}
```

### React

- **Use functional components**: No class components
- **Use hooks**: Follow React hooks rules
- **Use TypeScript with React**: Properly type props and state
- **Extract components**: Keep components focused and reusable

**Good**:
```typescript
// Good: Typed functional component
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({
  label,
  onClick,
  variant = 'primary',
  disabled = false
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

### Code Style

We use ESLint and Prettier for code formatting:

```bash
# Run linting
pnpm lint

# Fix auto-fixable issues
pnpm lint:fix

# Format code
pnpm format
```

**Key Rules**:
- **2 spaces** for indentation (not tabs)
- **Single quotes** for strings (except JSX)
- **Semicolons** required
- **Trailing commas** in multiline objects/arrays
- **Max line length**: 100 characters
- **Arrow functions** preferred over `function` keyword

### File Organization

```typescript
// 1. Imports (external first, then internal)
import { useState } from 'react';
import { Button } from '@jade/ui';

import { useAuth } from '../hooks/useAuth';
import type { User } from '../types';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Constants
const DEFAULT_LIMIT = 10;

// 4. Component/Function
export function Component({ }: ComponentProps) {
  // Implementation
}

// 5. Helper functions (non-exported)
function helperFunction() {
  // Implementation
}
```

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `UserProfile`, `OrderList` |
| Functions | camelCase | `getUserById`, `calculateTotal` |
| Hooks | camelCase with `use` prefix | `useAuth`, `useToast` |
| Constants | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRIES` |
| Types/Interfaces | PascalCase | `User`, `OrderStatus` |
| Files | kebab-case | `user-profile.tsx`, `order-list.tsx` |

### Comments

- **Write self-documenting code**: Good variable/function names reduce need for comments
- **Comment "why" not "what"**: Explain reasoning, not obvious logic
- **Use JSDoc for public APIs**: Document exported functions and types
- **Keep comments updated**: Remove or update obsolete comments

**Good**:
```typescript
// Good: Explains why, not what
// Use exponential backoff to avoid overwhelming the API during outages
const retryDelay = Math.pow(2, retryCount) * 1000;

/**
 * Calculates the total price including tax and shipping.
 *
 * Tax is calculated based on the shipping address state.
 * Some states have special handling for digital goods.
 *
 * @param items - Cart items to calculate total for
 * @param shippingAddress - Address to ship to (affects tax)
 * @returns Total price in cents
 */
export function calculateTotal(
  items: CartItem[],
  shippingAddress: Address
): number {
  // Implementation
}
```

**Bad**:
```typescript
// Bad: States the obvious
// Increment i by 1
i++;

// Loop through users
for (const user of users) {
  // ...
}
```

---

## Testing Requirements

### Test Coverage

- **Minimum 80% coverage** for new code
- **100% coverage** for critical paths (authentication, payments, etc.)
- **All public APIs** must have tests

### Test Types

1. **Unit Tests**: Test individual functions and components
2. **Integration Tests**: Test interactions between modules
3. **E2E Tests**: Test complete user workflows (where applicable)

### Writing Tests

We use Vitest for testing:

```typescript
// Example unit test
import { describe, it, expect } from 'vitest';
import { calculateTotal } from './calculations';

describe('calculateTotal', () => {
  it('should calculate total with tax', () => {
    const items = [
      { price: 1000, quantity: 2 }, // $20
      { price: 500, quantity: 1 },  // $5
    ];
    const address = { state: 'CA' }; // 9.5% tax

    const total = calculateTotal(items, address);

    expect(total).toBe(2738); // $27.38
  });

  it('should handle empty cart', () => {
    const total = calculateTotal([], { state: 'CA' });
    expect(total).toBe(0);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm test --filter=@jade/ui

# Run tests with coverage
pnpm test:coverage
```

### Test Requirements Checklist

- [ ] All new functions have unit tests
- [ ] All new components have tests
- [ ] Edge cases are tested
- [ ] Error conditions are tested
- [ ] Tests are deterministic (no flaky tests)
- [ ] Tests run fast (< 100ms per test when possible)
- [ ] Test names describe what they test

---

## Pull Request Process

### Before Opening a PR

1. **Ensure All Tests Pass**:
   ```bash
   pnpm test
   ```

2. **Ensure Linting Passes**:
   ```bash
   pnpm lint
   ```

3. **Ensure Type Checking Passes**:
   ```bash
   pnpm typecheck
   ```

4. **Ensure Build Succeeds**:
   ```bash
   pnpm build
   ```

5. **Update Documentation**: If your changes affect usage, update docs

### Opening a Pull Request

1. **Push Your Branch**:
   ```bash
   git push origin feature/013-user-notifications
   ```

2. **Open PR on GitHub**:
   - Go to the repository on GitHub
   - Click "Pull requests" → "New pull request"
   - Select your branch
   - Choose appropriate PR template:
     - **Default**: For most PRs
     - **Feature**: For new features
     - **Bugfix**: For bug fixes
     - **Hotfix**: For critical production issues

3. **Fill Out PR Template**:
   - Provide clear description
   - Link to related issues
   - List all changes made
   - Describe testing performed
   - Check all applicable boxes

4. **Mark as Draft** (if not ready for review):
   - Click "Create draft pull request"
   - Convert to ready when complete

### PR Requirements

Your PR must meet these requirements before merging:

#### Automated Checks
- [ ] ✅ All CI jobs pass (lint, typecheck, build, test)
- [ ] ✅ Branch is up to date with `main`
- [ ] ✅ No merge conflicts

#### Code Review
- [ ] ✅ At least 2 approvals from team members
- [ ] ✅ Code owner approval (for owned paths)
- [ ] ✅ All conversations resolved

#### Quality Standards
- [ ] ✅ Code follows style guidelines
- [ ] ✅ Tests added for new functionality
- [ ] ✅ Test coverage meets minimum 80%
- [ ] ✅ Documentation updated

#### Governance Compliance
- [ ] ✅ Follows SPECKIT methodology (for features)
- [ ] ✅ No breaking changes (or properly documented)
- [ ] ✅ Constitutional principles followed

### PR Review Process

1. **Automated Checks Run**: CI workflow runs automatically
2. **Code Owners Notified**: Based on `.github/CODEOWNERS`
3. **Reviewers Assigned**: Code owners auto-assigned
4. **Review Period**: Reviewers have up to 24 hours to review
5. **Feedback Addressed**: Make requested changes
6. **Re-review**: Request re-review after changes
7. **Approval**: Get required approvals
8. **Merge**: Squash and merge to `main`

### Responding to Feedback

- **Be receptive**: Consider all feedback objectively
- **Ask questions**: If feedback is unclear, ask for clarification
- **Explain reasoning**: If you disagree, explain your perspective
- **Make changes**: Address feedback promptly
- **Mark resolved**: Resolve conversations after addressing

### Merging

Once approved:

1. **Ensure branch is up to date**:
   ```bash
   git checkout main
   git pull
   git checkout your-branch
   git rebase main
   git push --force-with-lease
   ```

2. **Merge PR**:
   - Click "Squash and merge"
   - Edit commit message if needed
   - Confirm merge

3. **Delete Branch**:
   - GitHub will offer to delete automatically
   - Or manually: `git push origin --delete your-branch`

---

## Constitutional Governance

The JADE Ecosystem operates under a [Constitutional Framework](./CONSTITUTION.md). All contributions must adhere to these principles:

### Article VIII: UI Stability Protection

**No breaking UI changes**:
- Don't modify existing component prop interfaces
- GraphQL changes must be additive only
- New fields require deprecation notice before removal

**Example of violation**:
```typescript
// ❌ BAD: Breaking change
interface ButtonProps {
  label: string;        // Changed from 'text'
  variant: 'new-style'; // Removed old variants
}
```

**Example of compliance**:
```typescript
// ✅ GOOD: Backward compatible
interface ButtonProps {
  text?: string;        // Deprecated but still supported
  label?: string;       // New preferred property
  variant?: 'primary' | 'secondary' | 'new-style'; // Additive
}
```

### Article IX: Package Contract Stability

**Follow semantic versioning**:
- **Patch** (0.0.x): Bug fixes only
- **Minor** (0.x.0): New features, backward compatible
- **Major** (x.0.0): Breaking changes

**2-week deprecation notice** required before removing functionality.

### Article III: Test-Driven Development

**Write tests BEFORE implementation**:
1. Write failing test
2. Implement feature
3. Test passes

**Minimum 80% coverage** for new code.

---

## Getting Help

### Resources

- **[README.md](./README.md)**: Project overview
- **[DEVELOPMENT.md](./DEVELOPMENT.md)**: Development workflows
- **[.github/BRANCH_PROTECTION.md](./.github/BRANCH_PROTECTION.md)**: Branch protection rules
- **[.github/CI_CD_TESTING.md](./.github/CI_CD_TESTING.md)**: CI/CD testing guide

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: Questions and discussions
- **Pull Request Comments**: Code-specific questions

### Common Questions

**Q: How do I add a new package?**

A: See [Adding a New Package](./DEVELOPMENT.md#adding-a-new-package) in DEVELOPMENT.md

**Q: Why is my PR failing CI?**

A: Check the workflow logs in the Actions tab. Common issues:
- Linting errors: Run `pnpm lint:fix`
- Type errors: Run `pnpm typecheck`
- Test failures: Run `pnpm test` locally

**Q: How do I test my changes?**

A: See [CI/CD Testing Guide](./.github/CI_CD_TESTING.md)

**Q: Can I work on multiple features at once?**

A: Yes, but use separate feature branches for each. Don't mix unrelated changes in one PR.

**Q: How do I update my branch with latest main?**

A:
```bash
git checkout your-branch
git fetch origin
git rebase origin/main
git push --force-with-lease
```

---

## Recognition

We appreciate all contributions! Contributors will be:

- Listed in release notes
- Acknowledged in commit history
- Credited in relevant documentation

Significant contributors may be invited to join the core team.

---

## License

By contributing to the JADE Ecosystem, you agree that your contributions will be licensed under the same license as the project (Proprietary - All Rights Reserved).

---

**Thank you for contributing to the JADE Ecosystem!** 🙏

Your contributions help build better tools for the professional skincare industry.
