/**
 * Metric Card Component
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Dashboard Metrics (Tasks B.1.2, B.1.3)
 *
 * Displays a dashboard metric with trend indicator
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Badge } from '../ui/badge';
import { ArrowUp, ArrowDown, Minus, LucideIcon } from 'lucide-react';
import { getTrendColor, formatPercentage } from '../../hooks/useVendorPortalDashboard';

export interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: 'UP' | 'FLAT' | 'DOWN';
  percentChange?: number;
  subtitle?: string;
  loading?: boolean;
}

/**
 * Trend Indicator Component
 */
function TrendIndicator({ trend, percentChange }: { trend: 'UP' | 'FLAT' | 'DOWN'; percentChange: number }) {
  const trendColor = getTrendColor(trend);
  const Icon = trend === 'UP' ? ArrowUp : trend === 'DOWN' ? ArrowDown : Minus;

  return (
    <Badge
      variant="secondary"
      className="text-xs font-medium"
      style={{
        color: trendColor,
        backgroundColor: `${trendColor}20`,
        borderColor: `${trendColor}40`,
      }}
    >
      <Icon className="h-3 w-3 mr-1" />
      {formatPercentage(percentChange)}
    </Badge>
  );
}

/**
 * Metric Card Skeleton (Loading State)
 */
function MetricCardSkeleton() {
  return (
    <Card className="border-border shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-8 w-32 bg-muted animate-pulse rounded mb-2" />
        <div className="flex items-center space-x-2">
          <div className="h-5 w-16 bg-muted animate-pulse rounded" />
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Main MetricCard Component
 */
export function MetricCard({
  title,
  value,
  icon: Icon,
  iconColor = '#2E8B57',
  trend,
  percentChange,
  subtitle,
  loading = false,
}: MetricCardProps) {
  if (loading) {
    return <MetricCardSkeleton />;
  }

  return (
    <Card className="border-border shadow-md hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className="h-4 w-4" style={{ color: iconColor }} />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="text-3xl font-light mb-2">{value}</div>
        <div className="flex items-center space-x-2">
          {trend && percentChange !== undefined && (
            <TrendIndicator trend={trend} percentChange={percentChange} />
          )}
          {subtitle && (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * MetricCard Grid Container
 */
export function MetricCardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
}
