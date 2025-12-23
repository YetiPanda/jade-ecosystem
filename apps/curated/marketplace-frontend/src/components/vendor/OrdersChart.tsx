/**
 * Orders Chart Component
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.2: Dashboard Charts & Tables (Task B.2.3)
 *
 * Area chart displaying order counts over time with responsive design
 */

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface OrdersChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  description?: string;
  loading?: boolean;
  height?: number;
}

/**
 * Custom Tooltip for Orders Chart
 */
function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    const value = payload[0].value || 0;
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground mb-1">
          {formatDate(label)}
        </p>
        <p className="text-sm text-muted-foreground">
          Orders: <span className="font-medium text-sage">{value}</span>
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Loading Skeleton for Chart
 */
function ChartSkeleton({ height }: { height: number }) {
  return (
    <div
      className="w-full bg-muted animate-pulse rounded"
      style={{ height: `${height}px` }}
    />
  );
}

/**
 * Main OrdersChart Component
 */
export function OrdersChart({
  data,
  title = 'Orders Over Time',
  description = 'Daily order volume',
  loading = false,
  height = 300,
}: OrdersChartProps) {
  return (
    <Card className="border-border shadow-md">
      <CardHeader>
        <CardTitle className="font-normal">{title}</CardTitle>
        {description && (
          <CardDescription className="font-light">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <ChartSkeleton height={height} />
        ) : data.length === 0 ? (
          <div
            className="flex items-center justify-center bg-muted/30 rounded"
            style={{ height: `${height}px` }}
          >
            <p className="text-sm text-muted-foreground">No order data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9CAF88" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#9CAF88" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e5e7eb"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#9CAF88"
                strokeWidth={2}
                fill="url(#colorOrders)"
                dot={{
                  fill: '#9CAF88',
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: '#9CAF88',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
