/**
 * Analytics Tab
 * Feature 011: Vendor Portal MVP
 * Phase 4: Analytics Tab Integration - Seamless Tab Display
 *
 * Discovery and marketing analytics with tab-optimized layout.
 * Uses Feature 011 VendorDiscoveryPage with isTabView prop.
 */

import { useState } from 'react';
import { VendorDiscoveryPage } from '../VendorDiscoveryPage';
import { MarketingAnalytics } from '../../../components/dashboard/vendor/MarketingAnalytics';
import { DashboardProvider } from '../../../contexts/DashboardContext';
import { TrendingUp, BarChart3 } from 'lucide-react';

type AnalyticsSubTab = 'discovery' | 'marketing';

export function AnalyticsTab() {
  const [activeSubTab, setActiveSubTab] = useState<AnalyticsSubTab>('discovery');

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveSubTab('discovery')}
            className={`
              group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeSubTab === 'discovery'
                  ? 'border-[#2E8B57] text-[#2E8B57]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <TrendingUp className="h-5 w-5" />
            Discovery Analytics
          </button>
          <button
            onClick={() => setActiveSubTab('marketing')}
            className={`
              group inline-flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${
                activeSubTab === 'marketing'
                  ? 'border-[#2E8B57] text-[#2E8B57]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <BarChart3 className="h-5 w-5" />
            Marketing Analytics
          </button>
        </nav>
      </div>

      {/* Sub-tab Content */}
      {activeSubTab === 'discovery' && <VendorDiscoveryPage isTabView={true} />}
      {activeSubTab === 'marketing' && (
        <DashboardProvider>
          <MarketingAnalytics />
        </DashboardProvider>
      )}
    </div>
  );
}
