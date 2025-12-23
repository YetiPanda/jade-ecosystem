/**
 * Discovery Analytics Dashboard Component
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend - Task D.2.1
 *
 * Main dashboard component that orchestrates all discovery analytics widgets
 */

import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { VendorNavigation } from '../VendorNavigation';
import { ImpressionSourcesChart } from './ImpressionSourcesChart';
import { SearchQueriesTable } from './SearchQueriesTable';
import { ValuesPerformanceGrid } from './ValuesPerformanceGrid';
import { EngagementFunnel } from './EngagementFunnel';
import { RecommendationsFeed } from './RecommendationsFeed';
import { DateRangePicker } from './DateRangePicker';
import { Loader2, AlertCircle, TrendingUp, Search, Award, Users, Lightbulb } from 'lucide-react';

// GraphQL Query for Discovery Analytics
const GET_DISCOVERY_ANALYTICS = gql`
  query GetDiscoveryAnalytics($dateRange: DateRangeInput!) {
    discoveryAnalytics(dateRange: $dateRange) {
      impressions {
        total
        bySource {
          search
          browse
          values
          recommendation
          direct
        }
        trend
        percentChange
      }
      queriesLeadingToYou {
        query
        volume
        yourPosition
        topCompetitor
      }
      missedQueries {
        query
        volume
      }
      valuesPerformance {
        value
        impressions
        clicks
        conversions
        rank
        ctr
        conversionRate
      }
      profileEngagement {
        profileViews
        avgTimeOnProfile
        catalogBrowses
        productClicks
        contactClicks
        bounceRate
      }
      recommendations {
        type
        priority
        title
        description
        actionLabel
        actionRoute
        potentialImpact
      }
    }
  }
`;

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DiscoveryAnalyticsDashboardProps {
  /**
   * When true, removes standalone page chrome (navigation, header)
   * for seamless integration within tab layout
   */
  isTabView?: boolean;
}

export function DiscoveryAnalyticsDashboard({ isTabView = false }: DiscoveryAnalyticsDashboardProps) {
  // State for date range (default: last 30 days)
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);

    return {
      startDate: start.toISOString(),
      endDate: end.toISOString()
    };
  });

  // Fetch discovery analytics data
  const { data, loading, error, refetch } = useQuery(GET_DISCOVERY_ANALYTICS, {
    variables: { dateRange },
    fetchPolicy: 'cache-and-network'
  });

  const analytics = data?.discoveryAnalytics;

  // Handle date range change
  const handleDateRangeChange = (newRange: DateRange) => {
    setDateRange(newRange);
  };

  // Handle manual refresh
  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className={isTabView ? '' : 'min-h-screen bg-gray-50'}>
      {/* Navigation - only show in standalone mode */}
      {!isTabView && (
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
          <VendorNavigation />
        </div>
      )}

      {/* Main Content */}
      <div className={isTabView ? 'space-y-6' : 'max-w-7xl mx-auto px-4 py-6'}>
        <div className={`flex items-center ${isTabView ? 'justify-end' : 'justify-between'} mb-6`}>
          {/* Page Header - only show in standalone mode */}
          {!isTabView && (
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                Discovery Analytics
              </h1>
              <p className="mt-2 text-gray-600">
                Understand how spa users find and engage with your profile
              </p>
            </div>
          )}

          {/* Date Range Picker - always visible */}
          <DateRangePicker
            dateRange={dateRange}
            onChange={handleDateRangeChange}
            onRefresh={handleRefresh}
            loading={loading}
          />
        </div>

        {/* Loading State */}
        {loading && !analytics && (
          <div className={`flex items-center justify-center ${isTabView ? 'py-12' : 'py-24'}`}>
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-gray-600">Loading discovery analytics...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Failed to load analytics</h3>
            </div>
            <p className="text-red-700 mb-4">{error.message}</p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Analytics Dashboard - Only show when data is available */}
        {analytics && (
          <div className="space-y-8">
            {/* Section 1: Impression Sources */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">How Spas Find You</h2>
              </div>
              <ImpressionSourcesChart data={analytics.impressions} />
            </section>

            {/* Section 2: Search Queries */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Search Queries Leading to You</h2>
              </div>
              <SearchQueriesTable queries={analytics.queriesLeadingToYou} />
            </section>

            {/* Section 3: Values Performance */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Values Performance</h2>
              </div>
              <ValuesPerformanceGrid values={analytics.valuesPerformance} />
            </section>

            {/* Section 4: Profile Engagement */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-gray-700" />
                <h2 className="text-xl font-semibold text-gray-900">Profile Engagement</h2>
              </div>
              <EngagementFunnel engagement={analytics.profileEngagement} />
            </section>

            {/* Section 5: Recommendations */}
            {analytics.recommendations.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="h-5 w-5 text-gray-700" />
                  <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
                </div>
                <RecommendationsFeed recommendations={analytics.recommendations} />
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
