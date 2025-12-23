/**
 * User Settings Service
 *
 * Handles user settings CRUD operations including profile,
 * notifications, and app preferences.
 */

import { AppDataSource } from '../config/database';
import { NotFoundError, BadRequestError } from '../middleware/error.middleware';
import { logger } from '../lib/logger';
import {
  UserSettings,
  ProfileSettings,
  NotificationSettings,
  AppPreferences,
  DEFAULT_PROFILE_SETTINGS,
  DEFAULT_NOTIFICATION_SETTINGS,
  DEFAULT_APP_PREFERENCES,
  validateProfileSettings,
  validateNotificationSettings,
  validateAppPreferences,
  mergeSettings,
} from '../plugins/spa-management/entities/user-settings.entity';

export interface UpdateProfileSettingsInput {
  displayName?: string;
  timezone?: string;
  language?: string;
  dateFormat?: string;
  timeFormat?: string;
  phoneNumber?: string;
}

export interface UpdateNotificationSettingsInput {
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
}

export interface UpdateAppPreferencesInput {
  theme?: string;
  defaultView?: string;
  sidebarCollapsed?: boolean;
  showPricesWithTax?: boolean;
  currency?: string;
  itemsPerPage?: number;
  keyboardShortcuts?: boolean;
  compactMode?: boolean;
}

export interface UpdateUserSettingsInput {
  profile?: UpdateProfileSettingsInput;
  notifications?: UpdateNotificationSettingsInput;
  preferences?: UpdateAppPreferencesInput;
}

export class UserSettingsService {
  /**
   * Get settings by user ID
   */
  async findByUserId(userId: string): Promise<UserSettings | null> {
    try {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.user_settings WHERE user_id = $1`,
        [userId]
      );

      if (!result[0]) {
        return null;
      }

      return this.mapRowToUserSettings(result[0]);
    } catch (error) {
      logger.error('Error finding user settings', { userId, error });
      throw error;
    }
  }

  /**
   * Get settings by ID
   */
  async findById(id: string): Promise<UserSettings | null> {
    try {
      const result = await AppDataSource.query(
        `SELECT * FROM jade.user_settings WHERE id = $1`,
        [id]
      );

      if (!result[0]) {
        return null;
      }

      return this.mapRowToUserSettings(result[0]);
    } catch (error) {
      logger.error('Error finding user settings by ID', { id, error });
      throw error;
    }
  }

  /**
   * Get or create settings for a user
   * If settings don't exist, creates default settings
   */
  async getOrCreate(userId: string): Promise<UserSettings> {
    try {
      let settings = await this.findByUserId(userId);

      if (!settings) {
        settings = await this.create(userId);
      }

      return settings;
    } catch (error) {
      logger.error('Error getting or creating user settings', { userId, error });
      throw error;
    }
  }

  /**
   * Create default settings for a user
   */
  async create(userId: string): Promise<UserSettings> {
    try {
      // Check if settings already exist
      const existing = await this.findByUserId(userId);
      if (existing) {
        throw new BadRequestError('Settings already exist for this user');
      }

      const result = await AppDataSource.query(
        `INSERT INTO jade.user_settings (user_id, profile, notifications, preferences)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [
          userId,
          JSON.stringify(DEFAULT_PROFILE_SETTINGS),
          JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS),
          JSON.stringify(DEFAULT_APP_PREFERENCES),
        ]
      );

      logger.info('User settings created', { userId });
      return this.mapRowToUserSettings(result[0]);
    } catch (error) {
      logger.error('Error creating user settings', { userId, error });
      throw error;
    }
  }

  /**
   * Update profile settings
   */
  async updateProfileSettings(
    userId: string,
    input: UpdateProfileSettingsInput
  ): Promise<UserSettings> {
    try {
      const settings = await this.getOrCreate(userId);

      // Validate input
      const errors = validateProfileSettings(input as Partial<ProfileSettings>);
      if (errors.length > 0) {
        throw new BadRequestError(errors.join(', '));
      }

      // Merge with existing settings
      const updatedProfile = mergeSettings(settings.profile, input as Partial<ProfileSettings>);

      const result = await AppDataSource.query(
        `UPDATE jade.user_settings
         SET profile = $1, updated_at = NOW()
         WHERE user_id = $2
         RETURNING *`,
        [JSON.stringify(updatedProfile), userId]
      );

      logger.info('Profile settings updated', { userId });
      return this.mapRowToUserSettings(result[0]);
    } catch (error) {
      logger.error('Error updating profile settings', { userId, input, error });
      throw error;
    }
  }

  /**
   * Update notification settings
   */
  async updateNotificationSettings(
    userId: string,
    input: UpdateNotificationSettingsInput
  ): Promise<UserSettings> {
    try {
      const settings = await this.getOrCreate(userId);

      // Validate input
      const errors = validateNotificationSettings(input as Partial<NotificationSettings>);
      if (errors.length > 0) {
        throw new BadRequestError(errors.join(', '));
      }

      // Merge with existing settings
      const updatedNotifications = mergeSettings(
        settings.notifications,
        input as Partial<NotificationSettings>
      );

      const result = await AppDataSource.query(
        `UPDATE jade.user_settings
         SET notifications = $1, updated_at = NOW()
         WHERE user_id = $2
         RETURNING *`,
        [JSON.stringify(updatedNotifications), userId]
      );

      logger.info('Notification settings updated', { userId });
      return this.mapRowToUserSettings(result[0]);
    } catch (error) {
      logger.error('Error updating notification settings', { userId, input, error });
      throw error;
    }
  }

  /**
   * Update app preferences
   */
  async updateAppPreferences(
    userId: string,
    input: UpdateAppPreferencesInput
  ): Promise<UserSettings> {
    try {
      const settings = await this.getOrCreate(userId);

      // Validate input
      const errors = validateAppPreferences(input as Partial<AppPreferences>);
      if (errors.length > 0) {
        throw new BadRequestError(errors.join(', '));
      }

      // Merge with existing settings
      const updatedPreferences = mergeSettings(
        settings.preferences,
        input as Partial<AppPreferences>
      );

      const result = await AppDataSource.query(
        `UPDATE jade.user_settings
         SET preferences = $1, updated_at = NOW()
         WHERE user_id = $2
         RETURNING *`,
        [JSON.stringify(updatedPreferences), userId]
      );

      logger.info('App preferences updated', { userId });
      return this.mapRowToUserSettings(result[0]);
    } catch (error) {
      logger.error('Error updating app preferences', { userId, input, error });
      throw error;
    }
  }

  /**
   * Update all settings at once
   */
  async updateAllSettings(
    userId: string,
    input: UpdateUserSettingsInput
  ): Promise<UserSettings> {
    try {
      const settings = await this.getOrCreate(userId);
      const allErrors: string[] = [];

      // Prepare updates
      let updatedProfile = settings.profile;
      let updatedNotifications = settings.notifications;
      let updatedPreferences = settings.preferences;

      if (input.profile) {
        const profileErrors = validateProfileSettings(input.profile as Partial<ProfileSettings>);
        allErrors.push(...profileErrors);
        updatedProfile = mergeSettings(settings.profile, input.profile as Partial<ProfileSettings>);
      }

      if (input.notifications) {
        const notificationErrors = validateNotificationSettings(
          input.notifications as Partial<NotificationSettings>
        );
        allErrors.push(...notificationErrors);
        updatedNotifications = mergeSettings(
          settings.notifications,
          input.notifications as Partial<NotificationSettings>
        );
      }

      if (input.preferences) {
        const preferenceErrors = validateAppPreferences(
          input.preferences as Partial<AppPreferences>
        );
        allErrors.push(...preferenceErrors);
        updatedPreferences = mergeSettings(
          settings.preferences,
          input.preferences as Partial<AppPreferences>
        );
      }

      if (allErrors.length > 0) {
        throw new BadRequestError(allErrors.join(', '));
      }

      const result = await AppDataSource.query(
        `UPDATE jade.user_settings
         SET profile = $1, notifications = $2, preferences = $3, updated_at = NOW()
         WHERE user_id = $4
         RETURNING *`,
        [
          JSON.stringify(updatedProfile),
          JSON.stringify(updatedNotifications),
          JSON.stringify(updatedPreferences),
          userId,
        ]
      );

      logger.info('All user settings updated', { userId });
      return this.mapRowToUserSettings(result[0]);
    } catch (error) {
      logger.error('Error updating all settings', { userId, input, error });
      throw error;
    }
  }

  /**
   * Reset settings to defaults
   */
  async resetToDefaults(userId: string): Promise<UserSettings> {
    try {
      const existing = await this.findByUserId(userId);
      if (!existing) {
        return await this.create(userId);
      }

      const result = await AppDataSource.query(
        `UPDATE jade.user_settings
         SET profile = $1, notifications = $2, preferences = $3, updated_at = NOW()
         WHERE user_id = $4
         RETURNING *`,
        [
          JSON.stringify(DEFAULT_PROFILE_SETTINGS),
          JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS),
          JSON.stringify(DEFAULT_APP_PREFERENCES),
          userId,
        ]
      );

      logger.info('User settings reset to defaults', { userId });
      return this.mapRowToUserSettings(result[0]);
    } catch (error) {
      logger.error('Error resetting user settings', { userId, error });
      throw error;
    }
  }

  /**
   * Delete settings for a user
   */
  async delete(userId: string): Promise<void> {
    try {
      await AppDataSource.query(
        `DELETE FROM jade.user_settings WHERE user_id = $1`,
        [userId]
      );

      logger.info('User settings deleted', { userId });
    } catch (error) {
      logger.error('Error deleting user settings', { userId, error });
      throw error;
    }
  }

  /**
   * Map database row to UserSettings object
   */
  private mapRowToUserSettings(row: any): UserSettings {
    return {
      id: row.id,
      userId: row.user_id,
      profile: typeof row.profile === 'string' ? JSON.parse(row.profile) : row.profile,
      notifications:
        typeof row.notifications === 'string' ? JSON.parse(row.notifications) : row.notifications,
      preferences:
        typeof row.preferences === 'string' ? JSON.parse(row.preferences) : row.preferences,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    } as UserSettings;
  }
}

export const userSettingsService = new UserSettingsService();
