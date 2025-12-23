# @jade/feature-flags

Feature flags package for the JADE ecosystem. Controls visibility and availability of applications and features.

## Installation

```bash
pnpm add @jade/feature-flags
```

## Usage

### Check if an app is enabled

```typescript
import { isAppEnabled } from '@jade/feature-flags';

if (isAppEnabled('aura')) {
  // Aura spa dashboard is enabled
  console.log('Aura is available');
}
```

### Get app configuration

```typescript
import { getAppConfig } from '@jade/feature-flags';

const config = getAppConfig('sanctuary');
console.log(config.label); // "Sanctuary Community"
console.log(config.description); // "Community platform for beauty enthusiasts"
```

### Get all enabled apps

```typescript
import { getEnabledApps } from '@jade/feature-flags';

const apps = getEnabledApps();
console.log(apps); // ['curated', 'aura', 'sanctuary']
```

### Using the manager directly

```typescript
import { FeatureFlagsManager } from '@jade/feature-flags';

const manager = new FeatureFlagsManager();

// Check if app is enabled
const isEnabled = manager.isAppEnabled('curated');

// Get all enabled apps
const enabledApps = manager.getEnabledApps();

// Update flags dynamically
manager.updateFlags({
  apps: {
    aura: {
      enabled: false,
      label: 'Aura Spa Dashboard',
      description: 'Dashboard for spa owners and managers',
    },
  },
});
```

## Environment Variables

Feature flags can be controlled via environment variables:

```bash
# Enable/disable specific apps
FEATURE_FLAG_CURATED=true
FEATURE_FLAG_AURA=true
FEATURE_FLAG_SANCTUARY=false
```

The package will automatically read these variables when creating the default manager instance.

## Available Apps

| App Name | Label | Description |
|----------|-------|-------------|
| `curated` | Curated Marketplace | E-commerce marketplace for curated beauty products |
| `aura` | Aura Spa Dashboard | Dashboard for spa owners and managers |
| `sanctuary` | Sanctuary Community | Community platform for beauty enthusiasts |

## Default Configuration

By default, all apps are enabled. You can override this behavior using:
- Environment variables (recommended for production)
- Custom FeatureFlagsManager instance (recommended for testing)

## TypeScript

Full TypeScript support with type definitions included.

```typescript
import type { AppName, FeatureFlags } from '@jade/feature-flags';
```
