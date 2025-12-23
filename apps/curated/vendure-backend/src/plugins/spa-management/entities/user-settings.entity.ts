/**
 * UserSettings Entity for JADE Spa Marketplace
 *
 * Stores user-level settings for profile, notifications, and app preferences.
 * Each user has exactly one UserSettings record.
 *
 * Settings are stored as JSONB columns for flexibility in adding new options
 * without requiring database migrations.
 */

import { DeepPartial } from '@vendure/core';
import {
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

/**
 * Profile settings interface
 */
export interface ProfileSettings {
  /** Display name shown in the app */
  displayName: string | null;

  /** User's timezone for scheduling (IANA format) */
  timezone: string;

  /** Preferred language code (e.g., "en", "es") */
  language: string;

  /** Date format preference */
  dateFormat: DateFormat;

  /** Time format preference */
  timeFormat: TimeFormat;

  /** Phone number for SMS notifications */
  phoneNumber: string | null;

  /** Whether phone is verified for SMS */
  phoneVerified: boolean;
}

/**
 * Notification settings interface
 */
export interface NotificationSettings {
  /** Receive email notifications */
  emailEnabled: boolean;

  /** Receive push notifications */
  pushEnabled: boolean;

  /** Receive SMS notifications */
  smsEnabled: boolean;

  /** Appointment reminder notifications */
  appointmentReminders: boolean;

  /** Hours before appointment to send reminder */
  reminderHours: number;

  /** Order status update notifications */
  orderUpdates: boolean;

  /** Marketing and promotional emails */
  marketingEmails: boolean;

  /** Weekly digest of activity */
  weeklyDigest: boolean;

  /** New product announcements */
  productAnnouncements: boolean;

  /** Community activity notifications */
  communityActivity: boolean;
}

/**
 * App preferences interface
 */
export interface AppPreferences {
  /** UI theme preference */
  theme: ThemePreference;

  /** Default landing page after login */
  defaultView: DefaultView;

  /** Sidebar collapsed by default */
  sidebarCollapsed: boolean;

  /** Show product prices including tax */
  showPricesWithTax: boolean;

  /** Preferred currency for display */
  currency: string;

  /** Number of items per page in lists */
  itemsPerPage: number;

  /** Enable keyboard shortcuts */
  keyboardShortcuts: boolean;

  /** Compact mode for dense information display */
  compactMode: boolean;
}

/**
 * Theme preference enum
 */
export enum ThemePreference {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
  SYSTEM = 'SYSTEM',
}

/**
 * Default view enum
 */
export enum DefaultView {
  DASHBOARD = 'DASHBOARD',
  MARKETPLACE = 'MARKETPLACE',
  APPOINTMENTS = 'APPOINTMENTS',
  CLIENTS = 'CLIENTS',
  ECOSYSTEM = 'ECOSYSTEM',
  AURA = 'AURA',
  SANCTUARY = 'SANCTUARY',
}

/**
 * Date format enum
 */
export enum DateFormat {
  MM_DD_YYYY = 'MM_DD_YYYY',
  DD_MM_YYYY = 'DD_MM_YYYY',
  YYYY_MM_DD = 'YYYY_MM_DD',
}

/**
 * Time format enum
 */
export enum TimeFormat {
  TWELVE_HOUR = 'TWELVE_HOUR',
  TWENTY_FOUR_HOUR = 'TWENTY_FOUR_HOUR',
}

/**
 * UserSettings Entity
 *
 * Stores all user-specific settings including profile preferences,
 * notification settings, and app preferences.
 */
@Entity('user_settings')
export class UserSettings {
  constructor(input?: DeepPartial<UserSettings>) {
    if (input) {
      Object.assign(this, input);
    }
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * Reference to the user this settings belongs to
   */
  @Column({ type: 'varchar', length: 36, unique: true })
  @Index()
  userId: string;

  /**
   * Profile settings (JSONB)
   */
  @Column({ type: 'jsonb', default: () => `'${JSON.stringify(DEFAULT_PROFILE_SETTINGS)}'` })
  profile: ProfileSettings;

  /**
   * Notification preferences (JSONB)
   */
  @Column({ type: 'jsonb', default: () => `'${JSON.stringify(DEFAULT_NOTIFICATION_SETTINGS)}'` })
  notifications: NotificationSettings;

  /**
   * App preferences (JSONB)
   */
  @Column({ type: 'jsonb', default: () => `'${JSON.stringify(DEFAULT_APP_PREFERENCES)}'` })
  preferences: AppPreferences;
}

/**
 * Default profile settings
 */
export const DEFAULT_PROFILE_SETTINGS: ProfileSettings = {
  displayName: null,
  timezone: 'America/Los_Angeles',
  language: 'en',
  dateFormat: DateFormat.MM_DD_YYYY,
  timeFormat: TimeFormat.TWELVE_HOUR,
  phoneNumber: null,
  phoneVerified: false,
};

/**
 * Default notification settings
 */
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  emailEnabled: true,
  pushEnabled: true,
  smsEnabled: false,
  appointmentReminders: true,
  reminderHours: 24,
  orderUpdates: true,
  marketingEmails: false,
  weeklyDigest: true,
  productAnnouncements: true,
  communityActivity: true,
};

/**
 * Default app preferences
 */
export const DEFAULT_APP_PREFERENCES: AppPreferences = {
  theme: ThemePreference.SYSTEM,
  defaultView: DefaultView.DASHBOARD,
  sidebarCollapsed: false,
  showPricesWithTax: true,
  currency: 'USD',
  itemsPerPage: 20,
  keyboardShortcuts: true,
  compactMode: false,
};

/**
 * Helper to create default user settings for a new user
 */
export function createDefaultUserSettings(userId: string): Partial<UserSettings> {
  return {
    userId,
    profile: { ...DEFAULT_PROFILE_SETTINGS },
    notifications: { ...DEFAULT_NOTIFICATION_SETTINGS },
    preferences: { ...DEFAULT_APP_PREFERENCES },
  };
}

/**
 * Validation helper for profile settings
 */
export function validateProfileSettings(profile: Partial<ProfileSettings>): string[] {
  const errors: string[] = [];

  if (profile.timezone) {
    // Basic timezone validation
    try {
      Intl.DateTimeFormat(undefined, { timeZone: profile.timezone });
    } catch {
      errors.push('Invalid timezone');
    }
  }

  if (profile.language && !/^[a-z]{2}(-[A-Z]{2})?$/.test(profile.language)) {
    errors.push('Invalid language code format');
  }

  if (profile.phoneNumber && !/^\+?[1-9]\d{1,14}$/.test(profile.phoneNumber.replace(/[\s-]/g, ''))) {
    errors.push('Invalid phone number format');
  }

  return errors;
}

/**
 * Validation helper for notification settings
 */
export function validateNotificationSettings(notifications: Partial<NotificationSettings>): string[] {
  const errors: string[] = [];

  if (notifications.reminderHours !== undefined) {
    if (notifications.reminderHours < 1 || notifications.reminderHours > 168) {
      errors.push('Reminder hours must be between 1 and 168 (1 week)');
    }
  }

  return errors;
}

/**
 * Validation helper for app preferences
 */
export function validateAppPreferences(preferences: Partial<AppPreferences>): string[] {
  const errors: string[] = [];

  if (preferences.itemsPerPage !== undefined) {
    if (preferences.itemsPerPage < 5 || preferences.itemsPerPage > 100) {
      errors.push('Items per page must be between 5 and 100');
    }
  }

  if (preferences.currency && !/^[A-Z]{3}$/.test(preferences.currency)) {
    errors.push('Invalid currency code format');
  }

  return errors;
}

/**
 * Merge partial settings with existing settings
 */
export function mergeSettings<T extends object>(existing: T, updates: Partial<T>): T {
  return { ...existing, ...updates };
}
