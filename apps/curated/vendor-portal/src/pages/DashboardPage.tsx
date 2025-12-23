import { useState } from 'react';
import { MetricCard } from '../components/MetricCard';
import { useDashboardMetrics, getDateRangeForPeriod } from '../hooks/useDashboardMetrics';
import { formatCurrency, formatPercentage, getTrendDirection } from '../types/dashboard';
import './Page.css';

type Period = 'today' | 'week' | 'month' | 'quarter' | 'year';

export function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('month');
  const dateRange = getDateRangeForPeriod(selectedPeriod);
  const { metrics, loading, error } = useDashboardMetrics(dateRange);

  const periods: { value: Period; label: string }[] = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: '7 Days' },
    { value: 'month', label: '30 Days' },
    { value: 'quarter', label: '90 Days' },
    { value: 'year', label: '1 Year' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome to your vendor dashboard</p>
        </div>

        {/* Period Selector */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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

        {/* Info Box */}
        {!loading && !error && (
          <div className="info-box">
            <h3>✅ Sprint B.1 Complete - Dashboard Metrics</h3>
            <p>
              Dashboard metrics are now connected to the GraphQL backend. The metrics update
              based on the selected time period and show trend indicators.
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
              <strong>Next Sprint (B.2):</strong> Add charts (RevenueChart, OrdersChart),
              DateRangePicker, SpaLeaderboard, and ProductPerformanceTable.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
