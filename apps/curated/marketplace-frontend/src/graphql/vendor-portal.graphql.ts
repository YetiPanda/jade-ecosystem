/**
 * Vendor Portal GraphQL Queries
 * Feature 011: Vendor Portal MVP
 * Sprint B.3: Data Integration
 */

import { gql } from '@apollo/client';

/**
 * Query for vendor dashboard metrics
 * Used by VendorPortalDashboard component
 */
export const VENDOR_DASHBOARD_QUERY = gql`
  query VendorDashboard($dateRange: DateRangeInput!) {
    vendorDashboard(dateRange: $dateRange) {
      dateRange {
        startDate
        endDate
      }
      revenue {
        total
        fromNewSpas
        fromRepeatSpas
        trend
        percentChange
      }
      orders {
        count
        fromNewSpas
        fromRepeatSpas
        avgOrderValue
        trend
        percentChange
      }
      spas {
        active
        new
        repeat
        reorderRate
        trend
        percentChange
      }
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
      topProducts {
        productId
        productName
        productSku
        category
        unitsSold
        revenue
        orderCount
        uniqueSpas
        views
        addToCartClicks
        conversionRate
        price
      }
      topCustomers {
        id
        vendorId
        spaId
        spaName
        status
        lifetimeValue
        orderCount
        avgOrderValue
        firstOrderAt
        lastOrderAt
        avgDaysBetweenOrders
        daysSinceLastOrder
        favoriteCategories
        topProducts
        profileViews
        messageCount
        lastMessageAt
        createdAt
        updatedAt
      }
      revenueTimeSeries {
        date
        value
      }
      ordersTimeSeries {
        date
        value
      }
    }
  }
`;
