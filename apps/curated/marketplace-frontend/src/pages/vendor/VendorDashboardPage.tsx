/**
 * Vendor Dashboard Page
 * Week 4 Day 3: Page wrapper for Vendor Dashboard
 *
 * Phase 1: UNIFIED NAVIGATION - Now uses UnifiedVendorPortal with tabbed interface
 * Combines Figma UI design with Feature 011 business logic
 * Previous: Used standalone VendorPortalDashboard (now in Overview tab)
 */

import React from 'react';
import { UnifiedVendorPortal } from './UnifiedVendorPortal';

export function VendorDashboardPage() {
  return <UnifiedVendorPortal />;
}

export default VendorDashboardPage;
