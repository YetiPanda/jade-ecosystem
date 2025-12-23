/**
 * Impression Sources Chart Component
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend - Task D.2.2
 *
 * Visualizes how spa users discover vendors across 5 traffic sources:
 * - Search (keyword queries)
 * - Browse (category navigation)
 * - Values (values filters)
 * - Recommendation (marketplace recommendations)
 * - Direct (URL/bookmark)
 *
 * Displays as:
 * - Donut chart showing percentage breakdown
 * - Legend with absolute counts
 * - Trend indicator (up/flat/down)
 */

import { TrendingUp, TrendingDown, Minus, Search, Grid, Award, Star, ExternalLink } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface SourceData {
  source: string;
  count: number;
  percentage: number;
}

interface ImpressionsBySource {
  total: number;
  bySource: SourceData[];
  trend?: 'UP' | 'FLAT' | 'DOWN';
  percentChange?: number;
}

interface ImpressionSourcesChartProps {
  impressions: ImpressionsBySource;
}

// Source configuration with colors and icons
const SOURCE_CONFIG: Record<string, {
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  textColor: string;
}> = {
  SEARCH: { label: 'Search Results', icon: Search, color: '#3B82F6', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
  CATEGORY: { label: 'Category Browse', icon: Grid, color: '#10B981', bgColor: 'bg-green-100', textColor: 'text-green-700' },
  VALUES: { label: 'Values Match', icon: Award, color: '#F59E0B', bgColor: 'bg-amber-100', textColor: 'text-amber-700' },
  RECOMMENDED: { label: 'Recommended', icon: Star, color: '#8B5CF6', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
  DIRECT: { label: 'Direct Traffic', icon: ExternalLink, color: '#6B7280', bgColor: 'bg-gray-100', textColor: 'text-gray-700' },
};

export function ImpressionSourcesChart({ impressions }: ImpressionSourcesChartProps) {
  // Handle undefined or null data
  if (!impressions || !impressions.bySource) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No impression data available</p>
        </div>
      </div>
    );
  }

  // Map array data to source configuration
  const sourceData = impressions.bySource.map(item => {
    const config = SOURCE_CONFIG[item.source] || {
      label: item.source,
      icon: ExternalLink,
      color: '#6B7280',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-700'
    };
    return {
      ...item,
      ...config,
      percentage: item.percentage
    };
  }).filter(source => source.count > 0); // Only show sources with impressions

  // SVG donut chart dimensions
  const size = 200;
  const strokeWidth = 40;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerX = size / 2;
  const centerY = size / 2;

  // Calculate donut segments
  let accumulatedPercentage = 0;
  const segments = sourceData.map(source => {
    const percentage = source.percentage;
    const offset = circumference - (accumulatedPercentage / 100) * circumference;
    const dashArray = `${(percentage / 100) * circumference} ${circumference}`;

    const segment = {
      ...source,
      offset,
      dashArray,
      startPercentage: accumulatedPercentage
    };

    accumulatedPercentage += percentage;

    return segment;
  });

  // Trend icon
  const TrendIcon = impressions.trend === 'UP' ? TrendingUp : impressions.trend === 'DOWN' ? TrendingDown : Minus;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              role="img"
              aria-label="Traffic sources donut chart"
              className="transform -rotate-90"
            >
              {/* Background circle */}
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke="rgb(229, 231, 235)"
                strokeWidth={strokeWidth}
              />

              {/* Donut segments */}
              {segments.map((segment) => (
                <circle
                  key={segment.source}
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={segment.dashArray}
                  strokeDashoffset={segment.offset}
                  className="transition-all duration-300"
                />
              ))}
            </svg>

            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-900">{impressions.total.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Total Impressions</div>
              {impressions.percentChange !== undefined && (
                <span className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mt-2',
                  impressions.trend === 'UP' && 'bg-green-100 text-green-700',
                  impressions.trend === 'DOWN' && 'bg-red-100 text-red-700',
                  impressions.trend === 'FLAT' && 'bg-gray-100 text-gray-700'
                )}>
                  <TrendIcon className="h-3 w-3" />
                  {impressions.percentChange > 0 ? '+' : ''}{impressions.percentChange.toFixed(1)}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          {sourceData.map(source => {
            const Icon = source.icon;
            return (
              <div key={source.source} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-lg', source.bgColor)}>
                    <Icon className={cn('h-4 w-4', source.textColor)} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{source.label}</div>
                    <div className="text-xs text-gray-600">
                      <span>{source.count.toLocaleString()}</span>
                      {' impressions'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-gray-900">
                    {source.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            );
          })}

          {/* No data state */}
          {sourceData.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No impression data available for this period</p>
            </div>
          )}
        </div>
      </div>

      {/* Insights */}
      {sourceData.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Key Insight</h4>
            <p className="text-sm text-blue-700">
              {(() => {
                const topSource = sourceData[0];
                return `Most of your traffic (${topSource.percentage.toFixed(0)}%) comes from ${topSource.label.toLowerCase()}. ${
                  topSource.source === 'SEARCH'
                    ? 'Focus on optimizing your profile for relevant search queries.'
                    : topSource.source === 'VALUES'
                    ? 'Your values are driving discovery. Make sure they\'re prominently featured.'
                    : topSource.source === 'CATEGORY'
                    ? 'Spas are discovering you through category browsing. Ensure your categories are accurate.'
                    : topSource.source === 'RECOMMENDED'
                    ? 'Marketplace recommendations are working well for you.'
                    : 'Direct traffic suggests strong brand recognition.'
                }`;
              })()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
