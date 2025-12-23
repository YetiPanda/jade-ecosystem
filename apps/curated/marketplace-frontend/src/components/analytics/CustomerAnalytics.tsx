/**
 * CustomerAnalytics Panel
 *
 * Displays customer metrics, segments, and distribution
 */

import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { MetricCard } from './MetricCard';
import { Users, UserPlus, UserMinus, Clock, MapPin } from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

interface CustomerData {
  totalActive: number;
  newAcquisitions: number;
  churnedCustomers: number;
  averageCustomerAge: number;
  topSegments: Array<{
    segment: string;
    count: number;
    revenue: number;
    growthRate: number;
  }>;
  geographicDistribution: Array<{
    region: string;
    customers: number;
    revenue: number;
  }>;
  journeyStageDistribution: Array<{
    stage: string;
    count: number;
    percentage: number;
  }>;
}

interface CustomerAnalyticsProps {
  data?: CustomerData;
  loading?: boolean;
}

const SEGMENT_COLORS = [
  '#2E8B57', // Jade green
  '#9CAF88', // Sage
  '#8B9A6B', // Moss
  '#6B8E23', // Olive
  '#556B2F', // Dark olive
  '#3CB371', // Medium sea green
];

const JOURNEY_COLORS = [
  '#E8F5E9', // Awareness - lightest
  '#C8E6C9', // Consideration
  '#A5D6A7', // Decision
  '#81C784', // Purchase
  '#66BB6A', // Retention
  '#4CAF50', // Advocacy - darkest
];

export function CustomerAnalytics({ data, loading }: CustomerAnalyticsProps) {
  if (loading) {
    return <CustomerAnalyticsSkeleton />;
  }

  if (!data) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No customer data available
        </CardContent>
      </Card>
    );
  }

  // Calculate net growth
  const netGrowth = data.newAcquisitions - data.churnedCustomers;
  const netGrowthPercent = data.totalActive > 0
    ? (netGrowth / data.totalActive) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Customers"
          value={data.totalActive}
          icon={Users}
          formatType="compact"
        />
        <MetricCard
          title="New Acquisitions"
          value={data.newAcquisitions}
          icon={UserPlus}
          formatType="compact"
          trend="INCREASING"
          changePercent={netGrowthPercent}
        />
        <MetricCard
          title="Churned Customers"
          value={data.churnedCustomers}
          icon={UserMinus}
          formatType="compact"
          invertTrendColors
        />
        <MetricCard
          title="Avg Customer Age"
          value={data.averageCustomerAge}
          icon={Clock}
          subtitle="days since signup"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Segments */}
        {data.topSegments && data.topSegments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Customer Segments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topSegments}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="count"
                      nameKey="segment"
                      label={({ segment, percent }) =>
                        `${segment} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {data.topSegments.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={SEGMENT_COLORS[index % SEGMENT_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        value.toLocaleString(),
                        name,
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {data.topSegments.map((segment, index) => (
                  <div key={segment.segment} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: SEGMENT_COLORS[index % SEGMENT_COLORS.length] }}
                      />
                      <span className="text-sm">{segment.segment}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      ${segment.revenue.toLocaleString()} revenue
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Geographic Distribution */}
        {data.geographicDistribution && data.geographicDistribution.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Geographic Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.geographicDistribution}
                    layout="vertical"
                    margin={{ left: 80 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="region"
                      tick={{ fontSize: 12, fill: '#6b7280' }}
                      width={75}
                    />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === 'customers'
                          ? value.toLocaleString()
                          : `$${value.toLocaleString()}`,
                        name === 'customers' ? 'Customers' : 'Revenue',
                      ]}
                    />
                    <Bar dataKey="customers" fill="#2E8B57" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500">
                      <th className="text-left py-1">Region</th>
                      <th className="text-right py-1">Customers</th>
                      <th className="text-right py-1">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.geographicDistribution.slice(0, 5).map((region) => (
                      <tr key={region.region} className="border-t">
                        <td className="py-2">{region.region}</td>
                        <td className="py-2 text-right">{region.customers.toLocaleString()}</td>
                        <td className="py-2 text-right">${region.revenue.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Customer Journey Funnel */}
      {data.journeyStageDistribution && data.journeyStageDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Journey Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between gap-2 h-48">
              {data.journeyStageDistribution.map((stage, index) => {
                const maxCount = Math.max(...data.journeyStageDistribution.map((s) => s.count));
                const heightPercent = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;

                return (
                  <div key={stage.stage} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col items-center justify-end h-36">
                      <div className="text-sm font-medium text-gray-900 mb-1">
                        {stage.count.toLocaleString()}
                      </div>
                      <div
                        className="w-full max-w-16 rounded-t transition-all"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: JOURNEY_COLORS[index % JOURNEY_COLORS.length],
                          minHeight: '4px',
                        }}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-2 text-center">
                      {stage.stage}
                    </div>
                    <div className="text-xs text-gray-400">
                      {stage.percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CustomerAnalyticsSkeleton() {
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-100 rounded" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="h-64 bg-gray-100 rounded" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default CustomerAnalytics;
