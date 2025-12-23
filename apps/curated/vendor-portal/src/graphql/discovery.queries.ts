import { gql } from '@apollo/client';

/**
 * GraphQL queries for vendor discovery analytics
 */

export const GET_VENDOR_DISCOVERY_METRICS = gql`
  query GetVendorDiscoveryMetrics($input: DiscoveryQueryInput!) {
    vendorDiscoveryMetrics(input: $input) {
      periodStart
      periodEnd

      visibilityScore {
        overall
        trend
        rank
        totalVendors
        impressionScore
        engagementScore
        conversionScore
        qualityScore
      }

      totalImpressions
      impressionsByType {
        type
        count
        clickThroughRate
        conversionRate
      }

      impressionsTimeSeries {
        date
        impressions
        clicks
        orders
      }

      totalClicks
      overallClickThroughRate

      totalProducts
      activeProducts

      topPerformingProducts {
        productId
        productName
        productImage
        impressions
        clicks
        orders
        revenue
        clickThroughRate
        conversionRate
        impressionRank
        revenueRank
      }

      recommendations {
        id
        type
        priority
        title
        description
        impact
        effort
        completedAt
      }
    }
  }
`;

export const GET_PRODUCT_DISCOVERY_DETAILS = gql`
  query GetProductDiscoveryDetails($productId: ID!, $input: DiscoveryQueryInput!) {
    productDiscoveryDetails(productId: $productId, input: $input) {
      productId
      productName
      productImage

      impressions
      clicks
      orders
      revenue

      clickThroughRate
      conversionRate

      impressionsByType {
        type
        count
        clickThroughRate
        conversionRate
      }

      impressionsTimeSeries {
        date
        impressions
        clicks
        orders
      }

      topSearchQueries {
        query
        impressions
        clicks
        clickThroughRate
      }
    }
  }
`;

export const COMPLETE_RECOMMENDATION = gql`
  mutation CompleteRecommendation($recommendationId: ID!) {
    completeRecommendation(recommendationId: $recommendationId) {
      id
      completedAt
    }
  }
`;

export const DISMISS_RECOMMENDATION = gql`
  mutation DismissRecommendation($recommendationId: ID!) {
    dismissRecommendation(recommendationId: $recommendationId) {
      success
    }
  }
`;
