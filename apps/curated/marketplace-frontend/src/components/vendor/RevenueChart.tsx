/**
 * Revenue Chart Component
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.2: Dashboard Charts & Tables (Task B.2.2)
 *
 * Line chart displaying revenue over time with responsive design
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency } from '../../hooks/useVendorPortalDashboard';

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

export interface RevenueChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  description?: string;
  loading?: boolean;
  height?: number;
}

/**
 * Custom Tooltip for Revenue Chart
 */
function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-foreground mb-1">
          {formatDate(label)}
        </p>
        <p className="text-sm text-muted-foreground">
          Revenue: <span className="font-medium text-jade">{formatCurrency(payload[0].value || 0)}</span>
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
 * Format Y-axis tick values to currency
 */
function formatYAxis(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value}`;
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
 * Main RevenueChart Component
 */
export function RevenueChart({
  data,
  title = 'Revenue Over Time',
  description = 'Daily revenue performance',
  loading = false,
  height = 300,
}: RevenueChartProps) {
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
            <p className="text-sm text-muted-foreground">No revenue data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
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
                tickFormatter={formatYAxis}
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#2E8B57"
                strokeWidth={2}
                dot={{
                  fill: '#2E8B57',
                  strokeWidth: 2,
                  r: 4,
                }}
                activeDot={{
                  r: 6,
                  fill: '#2E8B57',
                  stroke: '#fff',
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
