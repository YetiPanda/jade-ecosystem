/**
 * Orders Tab
 * Feature 011: Vendor Portal MVP
 * Phase 3: Orders Integration - Seamless Tab Display
 *
 * Order management with real-time status tracking.
 * Uses Feature 011 VendorOrdersPage with tab-optimized styling.
 */

import React from 'react';
import { VendorOrdersPage } from '../VendorOrdersPage';

export function OrdersTab() {
  // Phase 3: Pass isTabView prop to remove standalone page chrome
  // This ensures seamless integration within the unified portal tab layout
  return <VendorOrdersPage isTabView={true} />;
}
