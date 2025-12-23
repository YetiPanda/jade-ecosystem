/**
 * Analytics Page
 * Week 6: Business Intelligence Dashboard
 */

import { useState } from 'react';
import { FinancialPerformanceDashboard } from '../../components/analytics/FinancialPerformanceDashboard';
import { ProductPerformanceAnalytics } from '../../components/analytics/ProductPerformanceAnalytics';
import { VendorIntelligenceDashboard } from '../../components/analytics/VendorIntelligenceDashboard';
import { MarketingAnalytics } from '../../components/dashboard/vendor/MarketingAnalytics';
import { VendorNavigation } from '../../components/vendor/VendorNavigation';
import { cn } from '../../lib/utils';

type DashboardTab = 'financial' | 'products' | 'vendor' | 'marketing';

export function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('financial');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <VendorNavigation />
      </div>

      {/* Page Header */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor your business performance with progressive disclosure analytics
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('financial')}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'financial'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                Financial Performance
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'products'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                Product Performance
              </button>
              <button
                onClick={() => setActiveTab('vendor')}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'vendor'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                Vendor Intelligence
              </button>
              <button
                onClick={() => setActiveTab('marketing')}
                className={cn(
                  'py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === 'marketing'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                Marketing Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'financial' && <FinancialPerformanceDashboard />}
        {activeTab === 'products' && <ProductPerformanceAnalytics />}
        {activeTab === 'vendor' && <VendorIntelligenceDashboard />}
        {activeTab === 'marketing' && <MarketingAnalytics />}
      </div>
    </div>
  );
}

export default AnalyticsPage;
