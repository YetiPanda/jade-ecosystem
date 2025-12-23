/**
 * FinancialMetrics Panel
 *
 * Displays financial performance metrics with charts
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { MetricCard } from './MetricCard';
import { DollarSign, TrendingUp, ShoppingCart, Users, Repeat } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

interface FinancialData {
  totalRevenue: number;
  monthlyRecurringRevenue: number;
  averageOrderValue: number;
  customerLifetimeValue: number;
  churnRate: number;
  growthRate: number;
  conversionRate: number;
  retentionRate: number;
  revenueByPeriod: Array<{
    period: string;
    revenue: number;
    orderCount: number;
  }>;
}

interface FinancialMetricsProps {
  data?: FinancialData;
  loading?: boolean;
  previousPeriodData?: Partial<FinancialData>;
}

export function FinancialMetrics({
  data,
  loading,
  previousPeriodData,
}: FinancialMetricsProps) {
  if (loading) {
    return <FinancialMetricsSkeleton />;
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No financial data available
        </CardContent>
      </Card>
    );
  }

  // Calculate changes from previous period
  const revenueChange = previousPeriodData?.totalRevenue
    ? ((data.totalRevenue - previousPeriodData.totalRevenue) / previousPeriodData.totalRevenue) * 100
    : data.growthRate;

  const mrrChange = previousPeriodData?.monthlyRecurringRevenue
    ? ((data.monthlyRecurringRevenue - previousPeriodData.monthlyRecurringRevenue) /
        previousPeriodData.monthlyRecurringRevenue) *
      100
    : undefined;

  const aovChange = previousPeriodData?.averageOrderValue
    ? ((data.averageOrderValue - previousPeriodData.averageOrderValue) /
        previousPeriodData.averageOrderValue) *
      100
    : undefined;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Revenue"
          value={data.totalRevenue}
          changePercent={revenueChange}
          trend={revenueChange > 0 ? 'INCREASING' : revenueChange < 0 ? 'DECREASING' : 'STABLE'}
          icon={DollarSign}
          formatType="currency"
        />
        <MetricCard
          title="Monthly Recurring Revenue"
          value={data.monthlyRecurringRevenue}
          changePercent={mrrChange}
          trend={mrrChange && mrrChange > 0 ? 'INCREASING' : mrrChange && mrrChange < 0 ? 'DECREASING' : 'STABLE'}
          icon={Repeat}
          formatType="currency"
        />
        <MetricCard
          title="Average Order Value"
          value={data.averageOrderValue}
          changePercent={aovChange}
          trend={aovChange && aovChange > 0 ? 'INCREASING' : aovChange && aovChange < 0 ? 'DECREASING' : 'STABLE'}
          icon={ShoppingCart}
          formatType="currency"
        />
        <MetricCard
          title="Customer Lifetime Value"
          value={data.customerLifetimeValue}
          icon={Users}
          formatType="currency"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Churn Rate"
          value={data.churnRate}
          formatType="percent"
          invertTrendColors
          className="bg-gray-50"
        />
        <MetricCard
          title="Growth Rate"
          value={data.growthRate}
          formatType="percent"
          className="bg-gray-50"
        />
        <MetricCard
          title="Conversion Rate"
          value={data.conversionRate}
          formatType="percent"
          className="bg-gray-50"
        />
        <MetricCard
          title="Retention Rate"
          value={data.retentionRate}
          formatType="percent"
          className="bg-gray-50"
        />
      </div>

      {/* Revenue Trend Chart */}
      {data.revenueByPeriod && data.revenueByPeriod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Revenue Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data.revenueByPeriod}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2E8B57" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2E8B57" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    tickFormatter={(value) =>
                      value >= 1000000
                        ? `$${(value / 1000000).toFixed(1)}M`
                        : value >= 1000
                        ? `$${(value / 1000).toFixed(0)}K`
                        : `$${value}`
                    }
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    formatter={(value: number) => [
                      `$${value.toLocaleString()}`,
                      'Revenue',
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2E8B57"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue by Period Table */}
      {data.revenueByPeriod && data.revenueByPeriod.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Period</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Period</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Revenue</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Orders</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Avg Order</th>
                  </tr>
                </thead>
                <tbody>
                  {data.revenueByPeriod.map((period, index) => (
                    <tr key={index} className="border-b last:border-0 hover:bg-gray-50">
                      <td className="py-3 px-4">{period.period}</td>
                      <td className="py-3 px-4 text-right font-medium">
                        ${period.revenue.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        {period.orderCount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-600">
                        ${period.orderCount > 0
                          ? (period.revenue / period.orderCount).toFixed(2)
                          : '0.00'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function FinancialMetricsSkeleton() {
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
      <Card>
        <CardContent className="p-6">
          <div className="h-80 bg-gray-100 rounded" />
        </CardContent>
      </Card>
    </div>
  );
}

export default FinancialMetrics;
