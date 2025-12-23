# @jade/ui

Shared design system and component library for the JADE ecosystem.

## Installation

```bash
pnpm add @jade/ui
```

## Usage

### Design Tokens

```typescript
import { colors, spacing, fontSize } from '@jade/ui/tokens';

// Use design tokens
const primaryColor = colors.jade[500];
const mediumSpacing = spacing.md;
```

### Utilities

```typescript
import { cn } from '@jade/ui/utils';

// Merge CSS classes
const className = cn('base-class', conditionalClass && 'conditional', 'override-class');
```

### Tailwind Preset

Add the JADE UI preset to your Tailwind configuration:

```javascript
// tailwind.config.js
module.exports = {
  presets: [require('@jade/ui/tailwind.preset')],
  // ...your config
};
```

## Design Tokens

### Colors

- **Jade Palette**: Primary brand colors (`jade-50` through `jade-950`)
- **Semantic Colors**: `primary`, `secondary`, `success`, `warning`, `error`, `info`
- **Neutrals**: Gray scale for text and backgrounds

### Spacing

- **Base Scale**: 0, 0.5, 1, 1.5, 2, 2.5, 3... up to 96
- **Semantic**: `xs`, `sm`, `md`, `lg`, `xl`, `2xl`...

### Typography

- **Font Families**: `sans`, `serif`, `mono`
- **Font Sizes**: `xs`, `sm`, `base`, `lg`, `xl`... up to `9xl`
- **Font Weights**: `thin` through `black`
- **Line Heights**: `none`, `tight`, `snug`, `normal`, `relaxed`, `loose`

## Components

Components will be added in Sprint 2.2.

## Development

```bash
# Build the package
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

## License

MIT
