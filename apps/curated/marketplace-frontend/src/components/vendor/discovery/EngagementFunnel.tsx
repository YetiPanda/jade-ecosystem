/**
 * Engagement Funnel Component
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend - Task D.2.5
 *
 * Visualizes the engagement funnel from profile view to conversion:
 * 1. Profile Views (100% baseline)
 * 2. Catalog Browses (% who viewed products)
 * 3. Product Clicks (% who clicked individual products)
 * 4. Contact Clicks (% who initiated contact)
 *
 * Also displays:
 * - Average time on profile
 * - Bounce rate (% who left within 10 seconds)
 */

import { Eye, ShoppingBag, MousePointer, Mail, Clock, TrendingDown } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface ProfileEngagement {
  profileViews: number;
  avgTimeOnProfile: number; // Seconds
  catalogBrowses: number;
  productClicks: number;
  contactClicks: number;
  bounceRate: number; // Percentage
}

interface EngagementFunnelProps {
  engagement: ProfileEngagement;
}

export function EngagementFunnel({ engagement }: EngagementFunnelProps) {
  // Calculate funnel percentages
  const catalogBrowseRate = engagement.profileViews > 0
    ? (engagement.catalogBrowses / engagement.profileViews) * 100
    : 0;

  const productClickRate = engagement.profileViews > 0
    ? (engagement.productClicks / engagement.profileViews) * 100
    : 0;

  const contactClickRate = engagement.profileViews > 0
    ? (engagement.contactClicks / engagement.profileViews) * 100
    : 0;

  // Format time
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Funnel stages
  const stages = [
    {
      icon: Eye,
      label: 'Profile View',
      cardLabel: 'Profile Views',
      count: engagement.profileViews,
      percentage: 100,
      color: 'bg-blue-600',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: ShoppingBag,
      label: 'Browse Catalog',
      cardLabel: 'Catalog Browses',
      count: engagement.catalogBrowses,
      percentage: catalogBrowseRate,
      color: 'bg-green-600',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: MousePointer,
      label: 'Click Product',
      cardLabel: 'Product Clicks',
      count: engagement.productClicks,
      percentage: productClickRate,
      color: 'bg-purple-600',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Mail,
      label: 'Contact/Inquiry',
      cardLabel: 'Contact Clicks',
      count: engagement.contactClicks,
      percentage: contactClickRate,
      color: 'bg-amber-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Profile Engagement</h3>
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Profile Views */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-sm text-gray-600">Profile Views</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {engagement.profileViews.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            total profile impressions
          </div>
        </div>

        {/* Avg Time on Profile */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-sm text-gray-600">Avg. Time on Profile</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {formatTime(engagement.avgTimeOnProfile)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {engagement.avgTimeOnProfile >= 60 ? 'Excellent engagement' : engagement.avgTimeOnProfile >= 30 ? 'Good engagement' : 'Low engagement'}
          </div>
        </div>

        {/* Bounce Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn('p-2 rounded-lg', engagement.bounceRate > 60 ? 'bg-red-100' : 'bg-green-100')}>
              <TrendingDown className={cn('h-5 w-5', engagement.bounceRate > 60 ? 'text-red-600' : 'text-green-600')} />
            </div>
            <div className="text-sm text-gray-600">Bounce Rate</div>
          </div>
          <div className={cn('text-2xl font-bold', engagement.bounceRate > 60 ? 'text-red-600' : 'text-green-600')}>
            {engagement.bounceRate.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {engagement.bounceRate > 60 ? 'High - needs improvement' : engagement.bounceRate > 40 ? 'Moderate' : 'Low - excellent'}
          </div>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Journey</h3>

        <div className="space-y-4">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const width = Math.max(stage.percentage, 10); // Minimum 10% width for visibility

            return (
              <div key={stage.label}>
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn('p-1.5 rounded-lg', stage.bgColor)}>
                      <Icon className={cn('h-4 w-4', stage.textColor)} />
                    </div>
                    <span className="text-sm font-medium text-gray-900">{stage.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">
                      {stage.count.toLocaleString()}
                    </span>
                    <span className={cn('text-sm font-semibold', stage.textColor)}>
                      {stage.percentage.toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Funnel Bar */}
                <div className="relative h-12 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={cn('absolute inset-y-0 left-0 rounded-lg transition-all duration-500', stage.color)}
                    style={{ width: `${width}%` }}
                  />
                  {/* Percentage Label Inside Bar (for large percentages) */}
                  {stage.percentage > 20 && (
                    <div className="absolute inset-0 flex items-center px-4 text-white font-semibold text-sm">
                      {stage.count.toLocaleString()} ({stage.percentage.toFixed(0)}%)
                    </div>
                  )}
                </div>

                {/* Drop-off indicator */}
                {index < stages.length - 1 && stage.percentage > 0 && (
                  <div className="flex items-center justify-end mt-1">
                    <span className="text-xs text-gray-500">
                      {((stages[index].percentage - stages[index + 1].percentage)).toFixed(0)}% drop-off
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Insights */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className={cn('rounded-lg p-4', engagement.bounceRate > 60 ? 'bg-amber-50' : 'bg-blue-50')}>
            <h4 className={cn('text-sm font-semibold mb-2', engagement.bounceRate > 60 ? 'text-amber-900' : 'text-blue-900')}>
              {engagement.bounceRate > 60 ? 'Attention Needed' : 'Key Insight'}
            </h4>
            <p className={cn('text-sm', engagement.bounceRate > 60 ? 'text-amber-700' : 'text-blue-700')}>
              {engagement.bounceRate > 60 ? (
                `Your bounce rate is ${engagement.bounceRate.toFixed(0)}%, which is high. Consider improving your hero image, tagline, or brand story to capture attention.`
              ) : catalogBrowseRate < 30 ? (
                `Only ${catalogBrowseRate.toFixed(0)}% of visitors browse your catalog. Feature your best products more prominently on your profile.`
              ) : (
                `Good engagement! ${catalogBrowseRate.toFixed(0)}% of visitors browse your catalog. Keep showcasing your best work.`
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {engagement.profileViews === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Eye className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No profile views yet</h3>
          <p className="text-sm text-gray-500">
            Complete your profile and optimize your values to start getting discovered.
          </p>
        </div>
      )}
    </div>
  );
}
