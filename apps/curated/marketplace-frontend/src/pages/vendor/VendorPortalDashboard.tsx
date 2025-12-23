/**
 * Vendor Portal Dashboard Page
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Dashboard Metrics (Task B.1.1, B.1.6-B.1.9)
 * Sprint B.2: Dashboard Charts & Tables (Task B.2.5)
 *
 * Main dashboard page for vendor portal with metrics, charts, and insights
 */

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@jade/ui/components';
import { Button } from '@jade/ui/components';
import { MetricCard, MetricCardGrid } from '../../components/vendor/MetricCard';
import { DateRangePicker, DateRange } from '../../components/vendor/DateRangePicker';
import { RevenueChart } from '../../components/vendor/RevenueChart';
import { OrdersChart } from '../../components/vendor/OrdersChart';
import { SpaLeaderboard } from '../../components/vendor/SpaLeaderboard';
import { ProductPerformanceTable } from '../../components/vendor/ProductPerformanceTable';
import {
  useVendorPortalDashboard,
  useDefaultDateRange,
  formatCurrency,
  formatNumber,
} from '../../hooks/useVendorPortalDashboard';
import {
  DollarSign,
  ShoppingCart,
  Users,
  TrendingUp,
  Package,
  Eye,
} from 'lucide-react';

interface VendorPortalDashboardProps {
  /**
   * When true, removes standalone page chrome (header, container)
   * for seamless integration within tab layout
   */
  isTabView?: boolean;
}

/**
 * Dashboard Header
 */
function DashboardHeader({
  dateRange,
  onDateRangeChange
}: {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-light mb-2">Vendor Dashboard</h1>
        <p className="text-muted-foreground font-light">
          Track your performance, monitor sales, and grow your wholesale business
        </p>
      </div>
      <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
    </div>
  );
}

/**
 * Discovery Insights Card
 */
function DiscoveryInsights({ impressions }: { impressions: any }) {
  const total = impressions?.total || 0;
  const bySource = impressions?.bySource || {
    search: 0,
    browse: 0,
    values: 0,
    recommendation: 0,
    direct: 0,
  };

  const sources = [
    { label: 'Search', value: bySource.search, color: '#2E8B57' },
    { label: 'Browse', value: bySource.browse, color: '#9CAF88' },
    { label: 'Values', value: bySource.values, color: '#8B9A6B' },
    { label: 'Recommendations', value: bySource.recommendation, color: '#B5A642' },
    { label: 'Direct', value: bySource.direct, color: '#7A8C6D' },
  ];

  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-normal">Discovery Sources</CardTitle>
        <CardDescription className="font-light">
          How spas find your products
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sources.map((source) => {
            const percentage = total > 0 ? (source.value / total) * 100 : 0;
            return (
              <div key={source.label} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{source.label}</span>
                  <span className="text-muted-foreground">
                    {formatNumber(source.value)} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: source.color,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main Dashboard Component
 */
export function VendorPortalDashboard({ isTabView = false }: VendorPortalDashboardProps = {}) {
  const defaultRange = useDefaultDateRange();
  const [dateRange, setDateRange] = useState<DateRange>(defaultRange);
  const { dashboard, loading, error } = useVendorPortalDashboard(dateRange);

  if (error) {
    return (
      <div className={`flex items-center justify-center ${isTabView ? 'py-12' : 'min-h-screen bg-background p-8'}`}>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error.message}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={isTabView ? 'space-y-6' : 'min-h-screen bg-background'}>
      <div className={isTabView ? 'space-y-6' : 'max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8 space-y-8'}>
        {/* Header - only show in standalone mode */}
        {!isTabView && (
          <DashboardHeader dateRange={dateRange} onDateRangeChange={setDateRange} />
        )}

        {/* Key Metrics */}
        <MetricCardGrid>
          {/* Revenue Metric Card (Task B.1.6) */}
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(dashboard?.revenue.total || 0)}
            icon={DollarSign}
            iconColor="#2E8B57"
            trend={dashboard?.revenue.trend}
            percentChange={dashboard?.revenue.percentChange}
            subtitle="vs previous period"
            loading={loading}
          />

          {/* Orders Metric Card (Task B.1.7) */}
          <MetricCard
            title="Orders"
            value={formatNumber(dashboard?.orders.count || 0)}
            icon={ShoppingCart}
            iconColor="#9CAF88"
            trend={dashboard?.orders.trend}
            percentChange={dashboard?.orders.percentChange}
            subtitle={`Avg: ${formatCurrency(dashboard?.orders.avgOrderValue || 0)}`}
            loading={loading}
          />

          {/* Active Spas Metric Card (Task B.1.8) */}
          <MetricCard
            title="Active Spas"
            value={formatNumber(dashboard?.spas.active || 0)}
            icon={Users}
            iconColor="#8B9A6B"
            trend={dashboard?.spas.trend}
            percentChange={dashboard?.spas.percentChange}
            subtitle={`${dashboard?.spas.new || 0} new this period`}
            loading={loading}
          />

          {/* Reorder Rate Metric Card (Task B.1.9) */}
          <MetricCard
            title="Reorder Rate"
            value={`${(dashboard?.spas.reorderRate || 0).toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="#B5A642"
            subtitle={`${dashboard?.spas.repeat || 0} repeat customers`}
            loading={loading}
          />
        </MetricCardGrid>

        {/* Secondary Metrics */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Discovery Metrics */}
          <MetricCard
            title="Profile Impressions"
            value={formatNumber(dashboard?.impressions.total || 0)}
            icon={Eye}
            iconColor="#7A8C6D"
            trend={dashboard?.impressions.trend}
            percentChange={dashboard?.impressions.percentChange}
            subtitle="profile views"
            loading={loading}
          />

          {/* Product Metrics */}
          <MetricCard
            title="Products Sold"
            value={formatNumber(
              dashboard?.topProducts.reduce((sum, p) => sum + p.unitsSold, 0) || 0
            )}
            icon={Package}
            iconColor="#9CAF88"
            subtitle={`${dashboard?.topProducts.length || 0} SKUs`}
            loading={loading}
          />

          {/* Revenue Split */}
          <MetricCard
            title="New Spa Revenue"
            value={formatCurrency(dashboard?.revenue.fromNewSpas || 0)}
            icon={DollarSign}
            iconColor="#2E8B57"
            subtitle={`${formatCurrency(dashboard?.revenue.fromRepeatSpas || 0)} from repeat`}
            loading={loading}
          />
        </div>

        {/* Charts Section - Sprint B.2 */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <RevenueChart
            data={dashboard?.revenueTimeSeries || []}
            loading={loading}
          />
          <OrdersChart
            data={dashboard?.ordersTimeSeries || []}
            loading={loading}
          />
        </div>

        {/* Enhanced Tables - Sprint B.2 */}
        <div className="mt-8 space-y-8">
          <ProductPerformanceTable
            products={dashboard?.topProducts || []}
            loading={loading}
            maxItems={10}
          />
          <SpaLeaderboard
            customers={dashboard?.topCustomers || []}
            loading={loading}
            maxItems={10}
          />
        </div>

        {/* Discovery Insights */}
        <div className="mt-8">
          {loading ? (
            <Card className="border-border shadow-md">
              <CardContent className="p-8">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-8 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <DiscoveryInsights impressions={dashboard?.impressions} />
          )}
        </div>
      </div>
    </div>
  );
}
