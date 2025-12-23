import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Dashboard Context
 *
 * Manages dashboard-wide state including:
 * - Active dashboard module/view
 * - Filter states (date ranges, status filters)
 * - UI preferences (grid/list view, sidebar collapsed)
 * - Notification queue
 */

export type DashboardView =
  | 'overview'
  | 'products'
  | 'inventory'
  | 'orders'
  | 'analytics'
  | 'events'
  | 'marketing';

export type ViewMode = 'grid' | 'list';

export interface DateRange {
  from: Date;
  to: Date;
}

export interface DashboardFilters {
  dateRange: DateRange;
  status?: string;
  category?: string;
  searchTerm?: string;
}

export interface DashboardPreferences {
  sidebarCollapsed: boolean;
  viewMode: ViewMode;
  theme?: 'light' | 'dark';
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface DashboardContextValue {
  // Current view state
  activeView: DashboardView;
  setActiveView: (view: DashboardView) => void;

  // Filters
  filters: DashboardFilters;
  updateFilters: (filters: Partial<DashboardFilters>) => void;
  resetFilters: () => void;

  // Preferences
  preferences: DashboardPreferences;
  updatePreferences: (prefs: Partial<DashboardPreferences>) => void;
  toggleSidebar: () => void;
  toggleViewMode: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  unreadCount: number;
}

const DashboardContext = createContext<DashboardContextValue | undefined>(undefined);

const defaultDateRange: DateRange = {
  from: new Date(new Date().setDate(new Date().getDate() - 30)), // Last 30 days
  to: new Date(),
};

const defaultFilters: DashboardFilters = {
  dateRange: defaultDateRange,
  status: undefined,
  category: undefined,
  searchTerm: '',
};

const defaultPreferences: DashboardPreferences = {
  sidebarCollapsed: false,
  viewMode: 'grid',
  theme: 'light',
};

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [preferences, setPreferences] = useState<DashboardPreferences>(defaultPreferences);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const updateFilters = useCallback((newFilters: Partial<DashboardFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const updatePreferences = useCallback((newPrefs: Partial<DashboardPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  }, []);

  const toggleSidebar = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      sidebarCollapsed: !prev.sidebarCollapsed,
    }));
  }, []);

  const toggleViewMode = useCallback(() => {
    setPreferences(prev => ({
      ...prev,
      viewMode: prev.viewMode === 'grid' ? 'list' : 'grid',
    }));
  }, []);

  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: DashboardContextValue = {
    activeView,
    setActiveView,
    filters,
    updateFilters,
    resetFilters,
    preferences,
    updatePreferences,
    toggleSidebar,
    toggleViewMode,
    notifications,
    addNotification,
    markNotificationRead,
    clearNotifications,
    unreadCount,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
