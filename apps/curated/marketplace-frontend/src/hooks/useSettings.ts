/**
 * User Settings Hook
 *
 * Custom hook for managing user settings including profile,
 * notifications, and app preferences.
 */

import { useState, useCallback } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';

// Types
export interface ProfileSettings {
  displayName: string | null;
  timezone: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  phoneNumber: string | null;
  phoneVerified: boolean;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  smsEnabled: boolean;
  appointmentReminders: boolean;
  reminderHours: number;
  orderUpdates: boolean;
  marketingEmails: boolean;
  weeklyDigest: boolean;
  productAnnouncements: boolean;
  communityActivity: boolean;
}

export interface AppPreferences {
  theme: 'LIGHT' | 'DARK' | 'SYSTEM';
  defaultView: string;
  sidebarCollapsed: boolean;
  showPricesWithTax: boolean;
  currency: string;
  itemsPerPage: number;
  keyboardShortcuts: boolean;
  compactMode: boolean;
}

export interface UserSettings {
  id: string;
  userId: string;
  profile: ProfileSettings;
  notifications: NotificationSettings;
  preferences: AppPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface SettingsError {
  code: string;
  message: string;
  field: string | null;
}

// GraphQL Fragments
const PROFILE_SETTINGS_FRAGMENT = gql`
  fragment ProfileSettingsFields on ProfileSettings {
    displayName
    timezone
    language
    dateFormat
    timeFormat
    phoneNumber
    phoneVerified
  }
`;

const NOTIFICATION_SETTINGS_FRAGMENT = gql`
  fragment NotificationSettingsFields on NotificationSettings {
    emailEnabled
    pushEnabled
    smsEnabled
    appointmentReminders
    reminderHours
    orderUpdates
    marketingEmails
    weeklyDigest
    productAnnouncements
    communityActivity
  }
`;

const APP_PREFERENCES_FRAGMENT = gql`
  fragment AppPreferencesFields on AppPreferences {
    theme
    defaultView
    sidebarCollapsed
    showPricesWithTax
    currency
    itemsPerPage
    keyboardShortcuts
    compactMode
  }
`;

const USER_SETTINGS_FRAGMENT = gql`
  ${PROFILE_SETTINGS_FRAGMENT}
  ${NOTIFICATION_SETTINGS_FRAGMENT}
  ${APP_PREFERENCES_FRAGMENT}
  fragment UserSettingsFields on UserSettings {
    id
    userId
    profile {
      ...ProfileSettingsFields
    }
    notifications {
      ...NotificationSettingsFields
    }
    preferences {
      ...AppPreferencesFields
    }
    createdAt
    updatedAt
  }
`;

// Queries
const MY_SETTINGS_QUERY = gql`
  ${USER_SETTINGS_FRAGMENT}
  query MySettings {
    mySettings {
      ...UserSettingsFields
    }
  }
`;

// Mutations
const UPDATE_PROFILE_SETTINGS = gql`
  ${USER_SETTINGS_FRAGMENT}
  mutation UpdateProfileSettings($input: UpdateProfileSettingsInput!) {
    updateProfileSettings(input: $input) {
      success
      settings {
        ...UserSettingsFields
      }
      errors {
        code
        message
        field
      }
    }
  }
`;

const UPDATE_NOTIFICATION_SETTINGS = gql`
  ${USER_SETTINGS_FRAGMENT}
  mutation UpdateNotificationSettings($input: UpdateNotificationSettingsInput!) {
    updateNotificationSettings(input: $input) {
      success
      settings {
        ...UserSettingsFields
      }
      errors {
        code
        message
        field
      }
    }
  }
`;

const UPDATE_APP_PREFERENCES = gql`
  ${USER_SETTINGS_FRAGMENT}
  mutation UpdateAppPreferences($input: UpdateAppPreferencesInput!) {
    updateAppPreferences(input: $input) {
      success
      settings {
        ...UserSettingsFields
      }
      errors {
        code
        message
        field
      }
    }
  }
`;

const UPDATE_ALL_SETTINGS = gql`
  ${USER_SETTINGS_FRAGMENT}
  mutation UpdateUserSettings($input: UpdateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      success
      settings {
        ...UserSettingsFields
      }
      errors {
        code
        message
        field
      }
    }
  }
`;

const RESET_SETTINGS = gql`
  ${USER_SETTINGS_FRAGMENT}
  mutation ResetUserSettings {
    resetUserSettings {
      success
      settings {
        ...UserSettingsFields
      }
      errors {
        code
        message
        field
      }
    }
  }
`;

/**
 * Main settings hook
 */
export function useSettings() {
  const [errors, setErrors] = useState<SettingsError[]>([]);

  // Query for current settings
  const {
    data,
    loading,
    error: queryError,
    refetch,
  } = useQuery(MY_SETTINGS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  // Mutations
  const [updateProfile, { loading: updatingProfile }] = useMutation(
    UPDATE_PROFILE_SETTINGS
  );
  const [updateNotifications, { loading: updatingNotifications }] = useMutation(
    UPDATE_NOTIFICATION_SETTINGS
  );
  const [updatePreferences, { loading: updatingPreferences }] = useMutation(
    UPDATE_APP_PREFERENCES
  );
  const [updateAll, { loading: updatingAll }] = useMutation(UPDATE_ALL_SETTINGS);
  const [resetSettings, { loading: resetting }] = useMutation(RESET_SETTINGS);

  // Update profile settings
  const updateProfileSettings = useCallback(
    async (input: Partial<ProfileSettings>) => {
      try {
        setErrors([]);
        const result = await updateProfile({
          variables: { input },
        });

        if (!result.data?.updateProfileSettings?.success) {
          setErrors(result.data?.updateProfileSettings?.errors || []);
          return false;
        }

        return true;
      } catch (err) {
        setErrors([
          { code: 'MUTATION_ERROR', message: (err as Error).message, field: null },
        ]);
        return false;
      }
    },
    [updateProfile]
  );

  // Update notification settings
  const updateNotificationSettings = useCallback(
    async (input: Partial<NotificationSettings>) => {
      try {
        setErrors([]);
        const result = await updateNotifications({
          variables: { input },
        });

        if (!result.data?.updateNotificationSettings?.success) {
          setErrors(result.data?.updateNotificationSettings?.errors || []);
          return false;
        }

        return true;
      } catch (err) {
        setErrors([
          { code: 'MUTATION_ERROR', message: (err as Error).message, field: null },
        ]);
        return false;
      }
    },
    [updateNotifications]
  );

  // Update app preferences
  const updateAppPreferences = useCallback(
    async (input: Partial<AppPreferences>) => {
      try {
        setErrors([]);
        const result = await updatePreferences({
          variables: { input },
        });

        if (!result.data?.updateAppPreferences?.success) {
          setErrors(result.data?.updateAppPreferences?.errors || []);
          return false;
        }

        return true;
      } catch (err) {
        setErrors([
          { code: 'MUTATION_ERROR', message: (err as Error).message, field: null },
        ]);
        return false;
      }
    },
    [updatePreferences]
  );

  // Update all settings at once
  const updateAllSettings = useCallback(
    async (input: {
      profile?: Partial<ProfileSettings>;
      notifications?: Partial<NotificationSettings>;
      preferences?: Partial<AppPreferences>;
    }) => {
      try {
        setErrors([]);
        const result = await updateAll({
          variables: { input },
        });

        if (!result.data?.updateUserSettings?.success) {
          setErrors(result.data?.updateUserSettings?.errors || []);
          return false;
        }

        return true;
      } catch (err) {
        setErrors([
          { code: 'MUTATION_ERROR', message: (err as Error).message, field: null },
        ]);
        return false;
      }
    },
    [updateAll]
  );

  // Reset to defaults
  const resetToDefaults = useCallback(async () => {
    try {
      setErrors([]);
      const result = await resetSettings();

      if (!result.data?.resetUserSettings?.success) {
        setErrors(result.data?.resetUserSettings?.errors || []);
        return false;
      }

      return true;
    } catch (err) {
      setErrors([
        { code: 'MUTATION_ERROR', message: (err as Error).message, field: null },
      ]);
      return false;
    }
  }, [resetSettings]);

  return {
    // Data
    settings: data?.mySettings as UserSettings | null,

    // Loading states
    loading,
    updatingProfile,
    updatingNotifications,
    updatingPreferences,
    updatingAll,
    resetting,
    isUpdating: updatingProfile || updatingNotifications || updatingPreferences || updatingAll || resetting,

    // Errors
    error: queryError,
    errors,

    // Actions
    updateProfileSettings,
    updateNotificationSettings,
    updateAppPreferences,
    updateAllSettings,
    resetToDefaults,
    refetch,
  };
}

/**
 * Hook for theme management
 */
export function useTheme() {
  const { settings, updateAppPreferences, updatingPreferences } = useSettings();

  const setTheme = useCallback(
    async (theme: 'LIGHT' | 'DARK' | 'SYSTEM') => {
      await updateAppPreferences({ theme });
    },
    [updateAppPreferences]
  );

  return {
    theme: settings?.preferences?.theme || 'SYSTEM',
    setTheme,
    loading: updatingPreferences,
  };
}

/**
 * Hook for notification preferences
 */
export function useNotificationPreferences() {
  const { settings, updateNotificationSettings, updatingNotifications } = useSettings();

  const toggleNotification = useCallback(
    async (key: keyof NotificationSettings, value: boolean) => {
      await updateNotificationSettings({ [key]: value });
    },
    [updateNotificationSettings]
  );

  return {
    notifications: settings?.notifications || null,
    toggleNotification,
    loading: updatingNotifications,
  };
}

export default useSettings;
