/**
 * Revenue Chart Component
 * Week 9: Advanced Analytics - Reusable chart for revenue trends
 */

import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card } from '../../ui/Card';

interface RevenueDataPoint {
  date: string;
  revenue: number;
  previousPeriod?: number;
}

interface RevenueChartProps {
  data: RevenueDataPoint[];
  title?: string;
  subtitle?: string;
  showComparison?: boolean;
  type?: 'line' | 'area';
  height?: number;
}

export function RevenueChart({
  data,
  title = 'Revenue Trend',
  subtitle,
  showComparison = false,
  type = 'area',
  height = 300,
}: RevenueChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const ChartComponent = type === 'area' ? AreaChart : LineChart;
  const DataComponent = type === 'area' ? Area : Line;

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <ChartComponent data={data}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            {showComparison && (
              <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#9ca3af" stopOpacity={0.05} />
              </linearGradient>
            )}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickLine={false}
            tickFormatter={formatCurrency}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value: number) => [formatCurrency(value), 'Revenue']}
          />
          <Legend />

          {type === 'area' ? (
            <>
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#colorRevenue)"
                name="Current Period"
              />
              {showComparison && (
                <Area
                  type="monotone"
                  dataKey="previousPeriod"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorPrevious)"
                  name="Previous Period"
                />
              )}
            </>
          ) : (
            <>
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
                name="Current Period"
              />
              {showComparison && (
                <Line
                  type="monotone"
                  dataKey="previousPeriod"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#9ca3af', r: 4 }}
                  name="Previous Period"
                />
              )}
            </>
          )}
        </ChartComponent>
      </ResponsiveContainer>
    </Card>
  );
}
