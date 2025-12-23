/**
 * Vendor Discovery Analytics Page
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend - Task D.2.1
 * Phase 4: Analytics Tab Integration
 *
 * Shows vendors how spa users discover their profiles through:
 * - Impression tracking by source (search, browse, values, recommendations, direct)
 * - Search query attribution and competitive positioning
 * - Values performance with CTR and conversion metrics
 * - Profile engagement funnel (views → catalog → products → contact)
 * - AI-powered recommendations for visibility optimization
 */

import React from 'react';
import { DiscoveryAnalyticsDashboard } from '../../components/vendor/discovery/DiscoveryAnalyticsDashboard';

interface VendorDiscoveryPageProps {
  /**
   * When true, removes standalone page chrome (navigation, header)
   * for seamless integration within tab layout
   */
  isTabView?: boolean;
}

export function VendorDiscoveryPage({ isTabView = false }: VendorDiscoveryPageProps) {
  return <DiscoveryAnalyticsDashboard isTabView={isTabView} />;
}

export default VendorDiscoveryPage;
