/**
 * User Settings GraphQL Resolvers
 *
 * Resolvers for user settings queries and mutations including
 * profile, notifications, and app preferences.
 */

import { userSettingsService } from '../services/user-settings.service';
import { UserSettings } from '../plugins/spa-management/entities/user-settings.entity';
import { logger } from '../lib/logger';

/**
 * GraphQL context interface
 */
export interface GraphQLContext {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

/**
 * Transform entity to GraphQL response
 */
function transformSettings(settings: UserSettings) {
  return {
    id: settings.id,
    userId: settings.userId,
    profile: {
      displayName: settings.profile.displayName,
      timezone: settings.profile.timezone,
      language: settings.profile.language,
      dateFormat: settings.profile.dateFormat,
      timeFormat: settings.profile.timeFormat,
      phoneNumber: settings.profile.phoneNumber,
      phoneVerified: settings.profile.phoneVerified,
    },
    notifications: {
      emailEnabled: settings.notifications.emailEnabled,
      pushEnabled: settings.notifications.pushEnabled,
      smsEnabled: settings.notifications.smsEnabled,
      appointmentReminders: settings.notifications.appointmentReminders,
      reminderHours: settings.notifications.reminderHours,
      orderUpdates: settings.notifications.orderUpdates,
      marketingEmails: settings.notifications.marketingEmails,
      weeklyDigest: settings.notifications.weeklyDigest,
      productAnnouncements: settings.notifications.productAnnouncements,
      communityActivity: settings.notifications.communityActivity,
    },
    preferences: {
      theme: settings.preferences.theme,
      defaultView: settings.preferences.defaultView,
      sidebarCollapsed: settings.preferences.sidebarCollapsed,
      showPricesWithTax: settings.preferences.showPricesWithTax,
      currency: settings.preferences.currency,
      itemsPerPage: settings.preferences.itemsPerPage,
      keyboardShortcuts: settings.preferences.keyboardShortcuts,
      compactMode: settings.preferences.compactMode,
    },
    createdAt: settings.createdAt,
    updatedAt: settings.updatedAt,
  };
}

/**
 * Create success result
 */
function createSuccessResult(settings: UserSettings) {
  return {
    success: true,
    settings: transformSettings(settings),
    errors: null,
  };
}

/**
 * Create error result
 */
function createErrorResult(message: string, code = 'SETTINGS_ERROR') {
  return {
    success: false,
    settings: null,
    errors: [{ code, message, field: null }],
  };
}

/**
 * Get current user ID from context or throw
 */
function requireAuth(context: GraphQLContext): string {
  if (!context.user?.id) {
    throw new Error('Authentication required');
  }
  return context.user.id;
}

/**
 * Query resolvers for user settings
 */
export const userSettingsQueryResolvers = {
  /**
   * Get current user's settings
   */
  mySettings: async (_: any, __: any, context: GraphQLContext) => {
    try {
      const userId = requireAuth(context);
      const settings = await userSettingsService.getOrCreate(userId);
      return transformSettings(settings);
    } catch (error) {
      logger.error('mySettings error:', error);
      throw new Error(`Failed to get settings: ${(error as Error).message}`);
    }
  },

  /**
   * Get user settings by user ID (admin only)
   */
  userSettings: async (
    _: any,
    { userId }: { userId: string },
    context: GraphQLContext
  ) => {
    try {
      requireAuth(context);

      // Check if user is admin
      if (context.user?.role !== 'ADMIN') {
        throw new Error('Admin access required');
      }

      const settings = await userSettingsService.findByUserId(userId);
      return settings ? transformSettings(settings) : null;
    } catch (error) {
      logger.error('userSettings error:', error);
      throw new Error(`Failed to get user settings: ${(error as Error).message}`);
    }
  },
};

/**
 * Mutation resolvers for user settings
 */
export const userSettingsMutationResolvers = {
  /**
   * Update profile settings
   */
  updateProfileSettings: async (
    _: any,
    {
      input,
    }: {
      input: {
        displayName?: string;
        timezone?: string;
        language?: string;
        dateFormat?: string;
        timeFormat?: string;
        phoneNumber?: string;
      };
    },
    context: GraphQLContext
  ) => {
    try {
      const userId = requireAuth(context);
      const settings = await userSettingsService.updateProfileSettings(userId, input);
      return createSuccessResult(settings);
    } catch (error) {
      logger.error('updateProfileSettings error:', error);
      return createErrorResult((error as Error).message, 'PROFILE_UPDATE_ERROR');
    }
  },

  /**
   * Update notification settings
   */
  updateNotificationSettings: async (
    _: any,
    {
      input,
    }: {
      input: {
        emailEnabled?: boolean;
        pushEnabled?: boolean;
        smsEnabled?: boolean;
        appointmentReminders?: boolean;
        reminderHours?: number;
        orderUpdates?: boolean;
        marketingEmails?: boolean;
        weeklyDigest?: boolean;
        productAnnouncements?: boolean;
        communityActivity?: boolean;
      };
    },
    context: GraphQLContext
  ) => {
    try {
      const userId = requireAuth(context);
      const settings = await userSettingsService.updateNotificationSettings(userId, input);
      return createSuccessResult(settings);
    } catch (error) {
      logger.error('updateNotificationSettings error:', error);
      return createErrorResult((error as Error).message, 'NOTIFICATION_UPDATE_ERROR');
    }
  },

  /**
   * Update app preferences
   */
  updateAppPreferences: async (
    _: any,
    {
      input,
    }: {
      input: {
        theme?: string;
        defaultView?: string;
        sidebarCollapsed?: boolean;
        showPricesWithTax?: boolean;
        currency?: string;
        itemsPerPage?: number;
        keyboardShortcuts?: boolean;
        compactMode?: boolean;
      };
    },
    context: GraphQLContext
  ) => {
    try {
      const userId = requireAuth(context);
      const settings = await userSettingsService.updateAppPreferences(userId, input);
      return createSuccessResult(settings);
    } catch (error) {
      logger.error('updateAppPreferences error:', error);
      return createErrorResult((error as Error).message, 'PREFERENCES_UPDATE_ERROR');
    }
  },

  /**
   * Update all user settings at once
   */
  updateUserSettings: async (
    _: any,
    {
      input,
    }: {
      input: {
        profile?: {
          displayName?: string;
          timezone?: string;
          language?: string;
          dateFormat?: string;
          timeFormat?: string;
          phoneNumber?: string;
        };
        notifications?: {
          emailEnabled?: boolean;
          pushEnabled?: boolean;
          smsEnabled?: boolean;
          appointmentReminders?: boolean;
          reminderHours?: number;
          orderUpdates?: boolean;
          marketingEmails?: boolean;
          weeklyDigest?: boolean;
          productAnnouncements?: boolean;
          communityActivity?: boolean;
        };
        preferences?: {
          theme?: string;
          defaultView?: string;
          sidebarCollapsed?: boolean;
          showPricesWithTax?: boolean;
          currency?: string;
          itemsPerPage?: number;
          keyboardShortcuts?: boolean;
          compactMode?: boolean;
        };
      };
    },
    context: GraphQLContext
  ) => {
    try {
      const userId = requireAuth(context);
      const settings = await userSettingsService.updateAllSettings(userId, input);
      return createSuccessResult(settings);
    } catch (error) {
      logger.error('updateUserSettings error:', error);
      return createErrorResult((error as Error).message, 'SETTINGS_UPDATE_ERROR');
    }
  },

  /**
   * Reset user settings to defaults
   */
  resetUserSettings: async (_: any, __: any, context: GraphQLContext) => {
    try {
      const userId = requireAuth(context);
      const settings = await userSettingsService.resetToDefaults(userId);
      return createSuccessResult(settings);
    } catch (error) {
      logger.error('resetUserSettings error:', error);
      return createErrorResult((error as Error).message, 'SETTINGS_RESET_ERROR');
    }
  },
};

/**
 * Combined user settings resolvers
 */
export const userSettingsResolvers = {
  Query: userSettingsQueryResolvers,
  Mutation: userSettingsMutationResolvers,
};
