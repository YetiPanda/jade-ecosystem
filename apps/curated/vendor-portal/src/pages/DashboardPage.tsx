import { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { RevenueChart } from '../components/RevenueChart';
import { OrdersChart } from '../components/OrdersChart';
import { DateRangePicker } from '../components/DateRangePicker';
import { SpaLeaderboard } from '../components/SpaLeaderboard';
import { ProductPerformanceTable } from '../components/ProductPerformanceTable';
import { useDashboardMetrics, getDateRangeForPeriod } from '../hooks/useDashboardMetrics';
import {
  formatCurrency,
  formatPercentage,
  getTrendDirection,
  DateRangeInput,
  RevenueDataPoint,
  SpaMetric,
} from '../types/dashboard';
import './Page.css';

type Period = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

export function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const [customDateRange, setCustomDateRange] = useState<DateRangeInput | null>(null);

  // Use custom date range if selected, otherwise use period-based range
  const dateRange =
    selectedPeriod === 'custom' && customDateRange
      ? customDateRange
      : getDateRangeForPeriod(selectedPeriod as Exclude<Period, 'custom'>);

  const { metrics, loading, error } = useDashboardMetrics(dateRange);

  // Handle custom date range selection
  const handleCustomDateRange = (range: DateRangeInput) => {
    setCustomDateRange(range);
    setSelectedPeriod('custom');
  };

  const periods: { value: Period; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: '7 Days' },
    { value: 'month', label: '30 Days' },
    { value: 'quarter', label: '90 Days' },
    { value: 'year', label: '1 Year' },
  ];

  // Mock data generators (TODO: Replace with GraphQL queries)
  const generateMockRevenueData = (): RevenueDataPoint[] => {
    const data: RevenueDataPoint[] = [];
    const endDate = new Date(dateRange.endDate);
    const startDate = new Date(dateRange.startDate);
    const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 50000) + 10000, // Random revenue between $100-$500
        orders: Math.floor(Math.random() * 20) + 5, // Random orders between 5-25
      });
    }
    return data;
  };

  const generateMockSpaData = (): SpaMetric[] => {
    const spaNames = [
      'Serenity Spa & Wellness',
      'The Luxe Retreat',
      'Tranquility Day Spa',
      'Harmony Skin Studio',
      'Blissful Beauty Lounge',
      'Radiance Wellness Center',
      'Pure Indulgence Spa',
      'Zenith Skincare Clinic',
      'Oasis Beauty Bar',
      'Elite Spa Sanctuary',
    ];

    return spaNames.map((name, i) => ({
      spaId: `SPA-${1000 + i}`,
      spaName: name,
      lifetimeValue: Math.floor(Math.random() * 100000) + 50000, // $500-$1500
      orderCount: Math.floor(Math.random() * 50) + 10, // 10-60 orders
      lastOrderDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      reorderRate: Math.random() * 80 + 20, // 20-100%
    })).sort((a, b) => b.lifetimeValue - a.lifetimeValue);
  };

  const mockRevenueData = generateMockRevenueData();
  const mockSpaData = generateMockSpaData();

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your vendor dashboard</p>
        </div>

        {/* Period Selector + Custom Date Range */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: selectedPeriod === period.value ? '#646cff' : '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: selectedPeriod === period.value ? 600 : 400,
                transition: 'all 0.2s',
              }}
            >
              {period.label}
            </button>
          ))}
          <DateRangePicker
            value={dateRange}
            onChange={handleCustomDateRange}
          />
        </div>
      </div>

      <div className="page-content">
        {/* Error State */}
        {error && (
          <div className="info-box" style={{ borderColor: '#ef4444' }}>
            <h3>⚠️ Error Loading Dashboard</h3>
            <p style={{ color: '#ef4444' }}>
              {error.message || 'Failed to load dashboard metrics. Please try again.'}
            </p>
            <p className="info-note">
              <strong>Tip:</strong> Make sure the backend GraphQL server is running and accessible.
            </p>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="metrics-grid">
          {/* Revenue Metric */}
          <MetricCard
            label={`Total Revenue (${periods.find((p) => p.value === selectedPeriod)?.label})`}
            value={metrics ? formatCurrency(metrics.totalRevenue) : '$0'}
            trend={
              metrics
                ? {
                    value: metrics.revenueChange,
                    direction: getTrendDirection(metrics.revenueChange),
                    period: 'last period',
                  }
                : undefined
            }
            icon="💰"
            loading={loading}
          />

          {/* Orders Metric */}
          <MetricCard
            label={`Orders (${periods.find((p) => p.value === selectedPeriod)?.label})`}
            value={metrics?.totalOrders || 0}
            trend={
              metrics
                ? {
                    value: metrics.ordersChange,
                    direction: getTrendDirection(metrics.ordersChange),
                    period: 'last period',
                  }
                : undefined
            }
            icon="📦"
            loading={loading}
          />

          {/* Active Spas Metric */}
          <MetricCard
            label="Active Spas"
            value={metrics?.activeSpas || 0}
            trend={
              metrics
                ? {
                    value: metrics.spasChange,
                    direction: getTrendDirection(metrics.spasChange),
                    period: 'last period',
                  }
                : undefined
            }
            icon="🏢"
            loading={loading}
          />

          {/* Reorder Rate Metric */}
          <MetricCard
            label="Reorder Rate"
            value={metrics ? formatPercentage(metrics.reorderRate) : '0%'}
            trend={
              metrics
                ? {
                    value: metrics.reorderRateChange,
                    direction: getTrendDirection(metrics.reorderRateChange),
                    period: 'last period',
                  }
                : undefined
            }
            icon="🔄"
            loading={loading}
          />
        </div>

        {/* Charts Section */}
        {!loading && !error && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '1.5rem' }}>
              <RevenueChart data={mockRevenueData} loading={false} />
              <OrdersChart data={mockRevenueData} loading={false} />
            </div>

            {/* Tables Section */}
            <SpaLeaderboard data={mockSpaData} loading={false} limit={10} />

            {metrics?.topProducts && (
              <ProductPerformanceTable
                data={metrics.topProducts}
                loading={false}
                limit={10}
              />
            )}

            {/* Info Box */}
            <div className="info-box">
              <h3>✅ Sprint B.2 Complete - Charts & Tables</h3>
              <p>
                Dashboard now includes revenue and order charts, date range picker, spa leaderboard,
                and product performance table. Charts and spa leaderboard use mock data for now.
              </p>
              {metrics && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Period:</strong> {metrics.periodStart} to {metrics.periodEnd}
                  <br />
                  <strong>Average Order Value:</strong> {formatCurrency(metrics.averageOrderValue)}
                  <br />
                  <strong>New Spas:</strong> {metrics.newSpas} this period
                </div>
              )}
              <p className="info-note">
                <strong>TODO:</strong> Replace mock chart data and spa leaderboard with GraphQL queries
                for time-series revenue/orders and spa customer rankings.
              </p>
              <p className="info-note">
                <strong>Next Sprint (B.3):</strong> Profile Management - Brand identity, values,
                certifications, and visual assets.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
