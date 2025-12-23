/**
 * MetricCard Component
 *
 * Displays a single KPI metric with value, trend, and change indicator
 */

import { Card, CardContent } from '../ui/Card';
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export type TrendDirection = 'INCREASING' | 'DECREASING' | 'STABLE' | 'VOLATILE';
export type FormatType = 'currency' | 'number' | 'percent' | 'compact';

export interface MetricCardProps {
  title: string;
  value: number;
  previousValue?: number;
  changePercent?: number;
  trend?: TrendDirection;
  icon?: LucideIcon;
  formatType?: FormatType;
  invertTrendColors?: boolean; // For metrics where decrease is good (e.g., churn)
  className?: string;
  subtitle?: string;
}

// Format value based on type
function formatValue(value: number, formatType: FormatType = 'number'): string {
  // Handle undefined/null values with fallback to 0
  const safeValue = value ?? 0;

  switch (formatType) {
    case 'currency':
      if (safeValue >= 1000000) {
        return `$${(safeValue / 1000000).toFixed(1)}M`;
      }
      if (safeValue >= 1000) {
        return `$${(safeValue / 1000).toFixed(1)}K`;
      }
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(safeValue);

    case 'percent':
      return `${safeValue.toFixed(1)}%`;

    case 'compact':
      if (safeValue >= 1000000) {
        return `${(safeValue / 1000000).toFixed(1)}M`;
      }
      if (safeValue >= 1000) {
        return `${(safeValue / 1000).toFixed(1)}K`;
      }
      return safeValue.toLocaleString();

    case 'number':
    default:
      return safeValue.toLocaleString();
  }
}

// Get trend icon and colors
function getTrendDisplay(
  trend: TrendDirection | undefined,
  changePercent: number | undefined,
  invertColors: boolean
) {
  if (!trend || changePercent === undefined) {
    return { icon: Minus, color: 'text-gray-500', bgColor: 'bg-gray-100' };
  }

  const isPositive = trend === 'INCREASING';
  const isNegative = trend === 'DECREASING';

  // Invert colors if decrease is good (e.g., churn rate)
  const goodTrend = invertColors ? isNegative : isPositive;
  const badTrend = invertColors ? isPositive : isNegative;

  if (goodTrend) {
    return {
      icon: invertColors ? TrendingDown : TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    };
  }

  if (badTrend) {
    return {
      icon: invertColors ? TrendingUp : TrendingDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    };
  }

  return { icon: Minus, color: 'text-gray-500', bgColor: 'bg-gray-100' };
}

export function MetricCard({
  title,
  value,
  previousValue,
  changePercent,
  trend,
  icon: Icon,
  formatType = 'number',
  invertTrendColors = false,
  className,
  subtitle,
}: MetricCardProps) {
  const trendDisplay = getTrendDisplay(trend, changePercent, invertTrendColors);
  const TrendIcon = trendDisplay.icon;

  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {formatValue(value, formatType)}
            </p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="p-2 bg-blue-50 rounded-lg">
              <Icon className="h-5 w-5 text-blue-600" />
            </div>
          )}
        </div>

        {changePercent !== undefined && (
          <div className="flex items-center gap-2 mt-4">
            <div
              className={cn(
                'flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium',
                trendDisplay.bgColor,
                trendDisplay.color
              )}
            >
              <TrendIcon className="h-3 w-3" />
              <span>
                {changePercent >= 0 ? '+' : ''}
                {changePercent.toFixed(1)}%
              </span>
            </div>
            <span className="text-xs text-gray-500">vs previous period</span>
          </div>
        )}

        {previousValue !== undefined && changePercent === undefined && (
          <p className="text-xs text-gray-500 mt-4">
            Previous: {formatValue(previousValue, formatType)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Compact variant for smaller displays
export function MetricCardCompact({
  title,
  value,
  changePercent,
  trend,
  formatType = 'number',
  invertTrendColors = false,
  className,
}: Omit<MetricCardProps, 'icon' | 'previousValue' | 'subtitle'>) {
  const trendDisplay = getTrendDisplay(trend, changePercent, invertTrendColors);
  const TrendIcon = trendDisplay.icon;

  return (
    <div className={cn('p-4 bg-white rounded-lg border', className)}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {title}
      </p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-xl font-bold text-gray-900">
          {formatValue(value, formatType)}
        </span>
        {changePercent !== undefined && (
          <span className={cn('flex items-center text-xs font-medium', trendDisplay.color)}>
            <TrendIcon className="h-3 w-3 mr-0.5" />
            {changePercent >= 0 ? '+' : ''}
            {changePercent.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}

export default MetricCard;
