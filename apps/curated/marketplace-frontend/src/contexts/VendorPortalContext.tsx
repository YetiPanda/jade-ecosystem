/**
 * Vendor Portal Context
 * Feature 011: Vendor Portal MVP
 * Phase 1: Unified Navigation
 *
 * Manages tab navigation state and filters for the unified vendor portal
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { DateRange } from '../components/vendor/DateRangePicker';

export type VendorPortalTab = 'overview' | 'products' | 'inventory' | 'orders' | 'events' | 'analytics';

interface VendorPortalContextValue {
  // Current active tab
  activeTab: VendorPortalTab;
  setActiveTab: (tab: VendorPortalTab) => void;

  // Global date range filter (shared across tabs)
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;

  // Navigation helper
  navigateToTab: (tab: VendorPortalTab) => void;
}

const VendorPortalContext = createContext<VendorPortalContextValue | undefined>(undefined);

export function VendorPortalProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<VendorPortalTab>('overview');
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
  });

  const navigateToTab = useCallback((tab: VendorPortalTab) => {
    setActiveTab(tab);
    // Optionally update URL hash or query param
    window.location.hash = tab;
  }, []);

  const value: VendorPortalContextValue = {
    activeTab,
    setActiveTab,
    dateRange,
    setDateRange,
    navigateToTab,
  };

  return (
    <VendorPortalContext.Provider value={value}>
      {children}
    </VendorPortalContext.Provider>
  );
}

export function useVendorPortal() {
  const context = useContext(VendorPortalContext);
  if (context === undefined) {
    throw new Error('useVendorPortal must be used within a VendorPortalProvider');
  }
  return context;
}
