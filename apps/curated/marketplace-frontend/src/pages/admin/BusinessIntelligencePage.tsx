/**
 * Business Intelligence Dashboard Page
 *
 * Comprehensive BI dashboard with real-time analytics from the analytics service
 */

import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { AppBreadcrumb } from '../../components/ui/AppBreadcrumb';
import { MetricCard } from '../../components/analytics/MetricCard';
import { FinancialMetrics } from '../../components/analytics/FinancialMetrics';
import { CustomerAnalytics } from '../../components/analytics/CustomerAnalytics';
import { ProductPerformance } from '../../components/analytics/ProductPerformance';
import { SkincareAnalytics } from '../../components/analytics/SkincareAnalytics';
import { AIPerformance } from '../../components/analytics/AIPerformance';
import { InsightsPanel } from '../../components/analytics/InsightsPanel';
import { AlertsPanel } from '../../components/analytics/AlertsPanel';
import { useAnalytics, useDashboardSummary, useBusinessAlerts } from '../../hooks/useAnalytics';
import { PILLARS } from '../../lib/pillars';
import {
  BarChart3,
  DollarSign,
  Users,
  ShoppingCart,
  TrendingUp,
  Brain,
  Sparkles,
  Bell,
  Download,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../lib/utils';

const PILLAR = PILLARS.intelligence;

type TabId = 'overview' | 'financial' | 'customers' | 'products' | 'skincare' | 'ai' | 'insights';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'financial', label: 'Financial', icon: DollarSign },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'products', label: 'Products', icon: ShoppingCart },
  { id: 'skincare', label: 'Skincare', icon: Sparkles },
  { id: 'ai', label: 'AI Performance', icon: Brain },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
];

const TIMEFRAMES = [
  { value: '7d', label: '7 days' },
  { value: '30d', label: '30 days' },
  { value: '90d', label: '90 days' },
  { value: '1y', label: '1 year' },
] as const;

type Timeframe = typeof TIMEFRAMES[number]['value'];

export function BusinessIntelligencePage() {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [timeframe, setTimeframe] = useState<Timeframe>('30d');

  // Fetch data using our analytics hooks
  const { metrics, insights, loading: analyticsLoading, refetch } = useAnalytics({ timeframe });
  const { summary, loading: summaryLoading } = useDashboardSummary();
  const { alerts, loading: alertsLoading, acknowledgeAlert } = useBusinessAlerts();

  const loading = analyticsLoading || summaryLoading;

  const handleExportReport = () => {
    // TODO: Implement report generation
    alert('Report export coming soon!');
  };

  const handleRefresh = () => {
    refetch?.();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumb */}
          <AppBreadcrumb className="mb-3" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-lg"
                style={{ backgroundColor: PILLAR.colorLight }}
              >
                <Brain className="h-5 w-5" style={{ color: PILLAR.color }} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {PILLAR.name}
                </h1>
                <p className="text-sm text-gray-600">
                  {PILLAR.subtitle} — Real-time analytics and AI-powered insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Timeframe Selector */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                {TIMEFRAMES.map((tf) => (
                  <button
                    key={tf.value}
                    onClick={() => setTimeframe(tf.value)}
                    className={cn(
                      'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                      timeframe === tf.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    )}
                  >
                    {tf.label}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              </Button>
              <Button onClick={handleExportReport} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-4 flex gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'bg-violet-50 text-violet-700 border-b-2 border-violet-600'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <OverviewTab
            summary={summary}
            insights={insights}
            alerts={alerts}
            loading={loading}
            alertsLoading={alertsLoading}
            onAcknowledgeAlert={acknowledgeAlert}
          />
        )}

        {/* Financial Tab */}
        {activeTab === 'financial' && (
          <FinancialMetrics
            data={metrics?.financial}
            loading={loading}
          />
        )}

        {/* Customers Tab */}
        {activeTab === 'customers' && (
          <CustomerAnalytics
            data={metrics?.customers}
            loading={loading}
          />
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <ProductPerformance
            data={metrics?.products}
            loading={loading}
          />
        )}

        {/* Skincare Tab */}
        {activeTab === 'skincare' && (
          <SkincareAnalytics
            data={metrics?.skincare}
            loading={loading}
          />
        )}

        {/* AI Performance Tab */}
        {activeTab === 'ai' && (
          <AIPerformance
            data={metrics?.ai}
            loading={loading}
          />
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <InsightsPanel data={insights} loading={loading} />
            <AlertsPanel
              alerts={alerts}
              loading={alertsLoading}
              onAcknowledge={acknowledgeAlert}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Overview Tab Component
 * Shows executive summary with KPIs, key insights, and alerts
 */
function OverviewTab({
  summary,
  insights,
  alerts,
  loading,
  alertsLoading,
  onAcknowledgeAlert,
}: {
  summary: any;
  insights: any;
  alerts: any;
  loading: boolean;
  alertsLoading: boolean;
  onAcknowledgeAlert?: (id: string) => void;
}) {
  if (loading) {
    return <OverviewSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Executive KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={summary?.revenue?.value || 0}
          previousValue={summary?.revenue?.previousValue}
          changePercent={summary?.revenue?.changePercent}
          trend={summary?.revenue?.trend}
          icon={DollarSign}
          formatType="currency"
        />
        <MetricCard
          title="Active Customers"
          value={summary?.customers?.value || 0}
          previousValue={summary?.customers?.previousValue}
          changePercent={summary?.customers?.changePercent}
          trend={summary?.customers?.trend}
          icon={Users}
          formatType="compact"
        />
        <MetricCard
          title="Total Orders"
          value={summary?.orders?.value || 0}
          previousValue={summary?.orders?.previousValue}
          changePercent={summary?.orders?.changePercent}
          trend={summary?.orders?.trend}
          icon={ShoppingCart}
          formatType="compact"
        />
        <MetricCard
          title="AI Recommendation Rate"
          value={summary?.aiRecommendationAcceptance?.value || 0}
          changePercent={summary?.aiRecommendationAcceptance?.changePercent}
          trend={summary?.aiRecommendationAcceptance?.trend}
          icon={Brain}
          formatType="percent"
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Avg Order Value"
          value={summary?.avgOrderValue?.value || 0}
          changePercent={summary?.avgOrderValue?.changePercent}
          trend={summary?.avgOrderValue?.trend}
          formatType="currency"
          className="bg-gray-50"
        />
        <MetricCard
          title="Churn Rate"
          value={summary?.churnRate?.value || 0}
          changePercent={summary?.churnRate?.changePercent}
          trend={summary?.churnRate?.trend}
          formatType="percent"
          invertTrendColors
          className="bg-gray-50"
        />
        <Card className="bg-gray-50">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-gray-600">Key Insights</p>
            <ul className="mt-2 space-y-1">
              {summary?.keyInsights?.slice(0, 3).map((insight: string, idx: number) => (
                <li key={idx} className="text-sm text-gray-700 flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  {insight}
                </li>
              )) || (
                <li className="text-sm text-gray-500">No insights available</li>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Top Products & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-violet-600" />
              Top Products
            </h3>
            {summary?.topProducts && summary.topProducts.length > 0 ? (
              <div className="space-y-3">
                {summary.topProducts.slice(0, 5).map((product: any, idx: number) => (
                  <div key={product.productId} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-6 h-6 bg-violet-100 text-violet-700 text-xs font-bold rounded-full">
                        {idx + 1}
                      </span>
                      <span className="text-sm">{product.productName}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold">
                        ${product.revenue?.toLocaleString() || 0}
                      </span>
                      <span className="text-xs text-gray-500 ml-2">
                        {product.unitsSold?.toLocaleString() || 0} units
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No product data available</p>
            )}
          </CardContent>
        </Card>

        {/* Alerts Panel (Compact) */}
        <div>
          <AlertsPanel
            alerts={alerts}
            loading={alertsLoading}
            onAcknowledge={onAcknowledgeAlert}
            compact
          />
        </div>
      </div>

      {/* Insights (Compact) */}
      <InsightsPanel data={insights} loading={loading} compact />
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
              <div className="h-6 bg-gray-200 rounded w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="h-48 bg-gray-100 rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="h-48 bg-gray-100 rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BusinessIntelligencePage;
