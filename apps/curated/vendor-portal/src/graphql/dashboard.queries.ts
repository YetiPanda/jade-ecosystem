import { gql } from '@apollo/client';

/**
 * GraphQL query for vendor dashboard metrics
 *
 * Fetches all dashboard data for the specified date range.
 * Used by the useDashboardMetrics hook.
 */
export const GET_VENDOR_DASHBOARD = gql`
  query GetVendorDashboard($dateRange: DateRangeInput!) {
    vendorDashboard(dateRange: $dateRange) {
      # Revenue metrics
      totalRevenue
      revenueChange

      # Order metrics
      totalOrders
      ordersChange
      averageOrderValue

      # Spa metrics
      activeSpas
      newSpas
      spasChange

      # Reorder metrics
      reorderRate
      reorderRateChange

      # Top products
      topProducts {
        productId
        productName
        revenue
        unitsSold
        uniqueSpas
      }

      # Period info
      periodStart
      periodEnd
      comparisonPeriodStart
      comparisonPeriodEnd
    }
  }
`;

/**
 * GraphQL query for vendor profile
 *
 * Fetches the current vendor's basic profile information.
 */
export const GET_VENDOR_PROFILE = gql`
  query GetVendorProfile {
    vendorProfile {
      id
      brandName
      contactEmail
      isVerified
      completenessScore
    }
  }
`;
