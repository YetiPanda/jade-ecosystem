/**
 * JADE Ecosystem Feature Flags
 *
 * Simple feature flag system for controlling app visibility and features
 * across the JADE ecosystem.
 */

export type AppName = 'curated' | 'aura' | 'sanctuary';

export interface FeatureFlags {
  apps: {
    curated: {
      enabled: boolean;
      label: string;
      description: string;
    };
    aura: {
      enabled: boolean;
      label: string;
      description: string;
    };
    sanctuary: {
      enabled: boolean;
      label: string;
      description: string;
    };
  };
}

/**
 * Default feature flags configuration
 */
export const defaultFlags: FeatureFlags = {
  apps: {
    curated: {
      enabled: true,
      label: 'Curated Marketplace',
      description: 'E-commerce marketplace for curated beauty products',
    },
    aura: {
      enabled: true,
      label: 'Aura Spa Dashboard',
      description: 'Dashboard for spa owners and managers',
    },
    sanctuary: {
      enabled: true,
      label: 'Sanctuary Community',
      description: 'Community platform for beauty enthusiasts',
    },
  },
};

/**
 * Feature flags manager
 */
export class FeatureFlagsManager {
  private flags: FeatureFlags;

  constructor(flags: FeatureFlags = defaultFlags) {
    this.flags = flags;
  }

  /**
   * Check if an app is enabled
   */
  isAppEnabled(appName: AppName): boolean {
    return this.flags.apps[appName]?.enabled ?? false;
  }

  /**
   * Get app configuration
   */
  getAppConfig(appName: AppName) {
    return this.flags.apps[appName];
  }

  /**
   * Get all enabled apps
   */
  getEnabledApps(): AppName[] {
    return (Object.keys(this.flags.apps) as AppName[]).filter((appName) =>
      this.isAppEnabled(appName)
    );
  }

  /**
   * Update feature flags
   */
  updateFlags(flags: Partial<FeatureFlags>): void {
    this.flags = {
      ...this.flags,
      ...flags,
      apps: {
        ...this.flags.apps,
        ...flags.apps,
      },
    };
  }

  /**
   * Load flags from environment variables
   *
   * Expected format:
   * - FEATURE_FLAG_CURATED=true|false
   * - FEATURE_FLAG_AURA=true|false
   * - FEATURE_FLAG_SANCTUARY=true|false
   */
  static fromEnvironment(): FeatureFlagsManager {
    const flags = { ...defaultFlags };

    // Check environment variables
    if (typeof process !== 'undefined' && process.env) {
      const curatedFlag = process.env.FEATURE_FLAG_CURATED;
      const auraFlag = process.env.FEATURE_FLAG_AURA;
      const sanctuaryFlag = process.env.FEATURE_FLAG_SANCTUARY;

      if (curatedFlag !== undefined) {
        flags.apps.curated.enabled = curatedFlag === 'true';
      }
      if (auraFlag !== undefined) {
        flags.apps.aura.enabled = auraFlag === 'true';
      }
      if (sanctuaryFlag !== undefined) {
        flags.apps.sanctuary.enabled = sanctuaryFlag === 'true';
      }
    }

    return new FeatureFlagsManager(flags);
  }
}

/**
 * Create a singleton instance
 */
export const featureFlags = FeatureFlagsManager.fromEnvironment();

/**
 * Convenience functions
 */
export const isAppEnabled = (appName: AppName): boolean =>
  featureFlags.isAppEnabled(appName);

export const getAppConfig = (appName: AppName) =>
  featureFlags.getAppConfig(appName);

export const getEnabledApps = (): AppName[] =>
  featureFlags.getEnabledApps();
