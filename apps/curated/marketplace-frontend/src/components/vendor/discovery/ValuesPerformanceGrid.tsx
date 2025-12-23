/**
 * Values Performance Grid Component
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend - Task D.2.4
 *
 * Displays performance metrics for each vendor value in a grid layout:
 * - Value name
 * - Impressions count
 * - Click-through rate (CTR)
 * - Conversion rate
 * - Competitive rank
 * - Performance indicators (good/medium/poor)
 */

import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Trophy, Medal, Award as AwardIcon, ChevronDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ValuePerformance {
  value: string;
  impressions: number;
  clicks: number;
  conversions: number;
  rank: number;
  ctr: number; // Percentage
  conversionRate: number; // Percentage
}

interface ValuesPerformanceGridProps {
  values: ValuePerformance[];
}

type SortField = 'impressions' | 'ctr' | 'conversions' | 'rank';

export function ValuesPerformanceGrid({ values }: ValuesPerformanceGridProps) {
  const [sortField, setSortField] = useState<SortField>('impressions');
  const [showAll, setShowAll] = useState(false);

  // Sort values
  const sortedValues = [...values].sort((a, b) => {
    switch (sortField) {
      case 'impressions':
        return b.impressions - a.impressions;
      case 'ctr':
        return b.ctr - a.ctr;
      case 'conversions':
        return b.conversions - a.conversions;
      case 'rank':
        return a.rank - b.rank; // Lower rank is better
      default:
        return 0;
    }
  });

  // Limit to top 6 unless "show all" is clicked
  const displayedValues = showAll ? sortedValues : sortedValues.slice(0, 6);

  // Get performance indicator
  const getPerformanceIndicator = (ctr: number, conversionRate: number) => {
    // Good: CTR > 15% or conversion rate > 10%
    // Medium: CTR 5-15% or conversion rate 3-10%
    // Poor: CTR < 5% or conversion rate < 3%
    if (ctr > 15 || conversionRate > 10) {
      return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-100', Icon: TrendingUp };
    } else if (ctr > 5 || conversionRate > 3) {
      return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100', Icon: Minus };
    } else {
      return { label: 'Needs Work', color: 'text-amber-600', bgColor: 'bg-amber-100', Icon: TrendingDown };
    }
  };

  // Format value name (convert snake_case to Title-Case with hyphens)
  const formatValueName = (value: string) => {
    const words = value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    return words.length > 1 ? words.join('-') : words[0];
  };

  // Rank badge
  const RankBadge = ({ rank }: { rank: number }) => {
    const Icon = rank === 1 ? Trophy : rank === 2 ? Medal : rank === 3 ? AwardIcon : null;
    const bgColor =
      rank === 1 ? 'bg-yellow-100' :
      rank === 2 ? 'bg-gray-200' :
      rank === 3 ? 'bg-orange-100' :
      'bg-gray-100';
    const textColor =
      rank === 1 ? 'text-yellow-700' :
      rank === 2 ? 'text-gray-700' :
      rank === 3 ? 'text-orange-700' :
      'text-gray-600';

    return (
      <span className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full', bgColor, textColor)}>
        {Icon && <Icon className="h-3 w-3" />}
        <span className="text-xs font-medium">#{rank}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Values Performance</h3>
      </div>

      {/* Sort Controls */}
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-200 p-1 mb-6">
        <button
          onClick={() => setSortField('impressions')}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            sortField === 'impressions'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          Sort by Impressions
        </button>
        <button
          onClick={() => setSortField('ctr')}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            sortField === 'ctr'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          Sort by CTR
        </button>
        <button
          onClick={() => setSortField('conversions')}
          className={cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            sortField === 'conversions'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          )}
        >
          Sort by Conversion
        </button>
      </div>

      {/* Values Grid */}
      {values.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {displayedValues.map((value) => {
              const performance = getPerformanceIndicator(value.ctr, value.conversionRate);
              const PerformanceIcon = performance.Icon;

              return (
                <div key={value.value} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-gray-900 mb-1">
                        {formatValueName(value.value)}
                      </h3>
                      <div className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium', performance.bgColor, performance.color)}>
                        <PerformanceIcon className="h-3 w-3" />
                        {performance.label}
                      </div>
                    </div>
                    <RankBadge rank={value.rank} />
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Impressions</div>
                      <div className="text-lg font-bold text-gray-900">{value.impressions.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Clicks</div>
                      <div className="text-lg font-bold text-gray-900">{value.clicks.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">CTR</div>
                      <div className="text-lg font-bold text-gray-900">{value.ctr.toFixed(1)}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-600 mb-1">Conv. Rate</div>
                      <div className="text-lg font-bold text-gray-900">{value.conversionRate.toFixed(1)}%</div>
                    </div>
                  </div>

                  {/* Conversions */}
                  {value.conversions > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-600">
                        {value.conversions} {value.conversions === 1 ? 'conversion' : 'conversions'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Show More Button */}
          {values.length > 6 && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Show More
              <ChevronDown className="h-4 w-4" />
            </button>
          )}

          {/* Show Less Button */}
          {values.length > 6 && showAll && (
            <button
              onClick={() => setShowAll(false)}
              className="w-full py-3 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Show Less
            </button>
          )}
        </>
      )}

      {/* Empty State */}
      {values.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="text-gray-400 mb-3">
            <AwardIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No values data yet</h3>
          <p className="text-sm text-gray-500 mb-4">
            Add values to your profile to track their performance
          </p>
          <a
            href="/vendor/profile#values"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add Values
          </a>
        </div>
      )}
    </div>
  );
}
