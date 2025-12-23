/**
 * Overview Tab
 * Feature 011: Vendor Portal MVP
 * Phase 6: Overview Tab Integration - Seamless Tab Display
 *
 * Main dashboard view with metrics, charts, and insights.
 * Uses Feature 011 VendorPortalDashboard with tab-optimized layout.
 */

import React from 'react';
import { VendorPortalDashboard } from '../VendorPortalDashboard';

export function OverviewTab() {
  // Phase 6: Pass isTabView prop to remove standalone page chrome
  // This ensures seamless integration within the unified portal tab layout
  return <VendorPortalDashboard isTabView={true} />;
}
