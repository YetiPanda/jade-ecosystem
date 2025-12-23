/**
 * Vendor Portal GraphQL Queries
 * Feature 011: Vendor Portal MVP
 * Sprint D.2: Discovery Analytics Frontend
 */

import { gql } from '@apollo/client';

/**
 * Query for vendor discovery analytics
 * Used by DiscoveryAnalyticsDashboard component
 */
export const GET_DISCOVERY_ANALYTICS = gql`
  query GetDiscoveryAnalytics($dateRange: DateRangeInput!) {
    discoveryAnalytics(dateRange: $dateRange) {
      impressions {
        total
        bySource {
          source
          count
          percentage
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
