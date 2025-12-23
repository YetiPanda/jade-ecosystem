/**
 * Vendor Portal Dashboard Hook
 *
 * Feature 011: Vendor Portal MVP
 * Sprint B.1: Dashboard Metrics (Task B.1.4)
 *
 * Apollo GraphQL hook for vendor dashboard metrics
 */

import { useQuery, gql } from '@apollo/client';
import { useMemo } from 'react';

// GraphQL Query
const GET_VENDOR_DASHBOARD = gql`
  query GetVendorDashboard($dateRange: DateRangeInput!) {
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
      }

      topCustomers {
        spaId
        spaName
        lifetimeValue
        orderCount
        avgOrderValue
        lastOrderAt
        daysSinceLastOrder
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

export interface DateRangeInput {
  startDate: string; // ISO date string
  endDate: string; // ISO date string
}

export interface VendorDashboardData {
  dateRange: {
    startDate: string;
    endDate: string;
  };
  revenue: {
    total: number;
    fromNewSpas: number;
    fromRepeatSpas: number;
    trend: 'UP' | 'FLAT' | 'DOWN';
    percentChange: number;
  };
  orders: {
    count: number;
    fromNewSpas: number;
    fromRepeatSpas: number;
    avgOrderValue: number;
    trend: 'UP' | 'FLAT' | 'DOWN';
    percentChange: number;
  };
  spas: {
    active: number;
    new: number;
    repeat: number;
    reorderRate: number;
    trend: 'UP' | 'FLAT' | 'DOWN';
    percentChange: number;
  };
  impressions: {
    total: number;
    bySource: {
      search: number;
      browse: number;
      values: number;
      recommendation: number;
      direct: number;
    };
    trend: 'UP' | 'FLAT' | 'DOWN';
    percentChange: number;
  };
  topProducts: Array<{
    productId: string;
    productName: string;
    productSku: string | null;
    category: string | null;
    unitsSold: number;
    revenue: number;
    orderCount: number;
    uniqueSpas: number;
  }>;
  topCustomers: Array<{
    spaId: string;
    spaName: string | null;
    lifetimeValue: number;
    orderCount: number;
    avgOrderValue: number;
    lastOrderAt: string | null;
    daysSinceLastOrder: number | null;
  }>;
  revenueTimeSeries: Array<{
    date: string;
    value: number;
  }>;
  ordersTimeSeries: Array<{
    date: string;
    value: number;
  }>;
}

/**
 * Hook to fetch vendor portal dashboard metrics
 *
 * @param dateRange - Date range for metrics (ISO date strings)
 * @returns Apollo query result with vendorDashboard data
 */
export function useVendorPortalDashboard(dateRange: DateRangeInput) {
  const { data, loading, error, refetch } = useQuery<{
    vendorDashboard: VendorDashboardData;
  }>(GET_VENDOR_DASHBOARD, {
    variables: { dateRange },
    skip: !dateRange.startDate || !dateRange.endDate,
  });

  const dashboard = useMemo(() => data?.vendorDashboard, [data]);

  return {
    dashboard,
    loading,
    error,
    refetch,
  };
}

/**
 * Helper hook to get default date range (last 30 days)
 */
export function useDefaultDateRange(): DateRangeInput {
  return useMemo(() => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
    };
  }, []);
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format number with thousands separators
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format percentage with sign
 */
export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Get trend icon/indicator based on trend direction
 */
export function getTrendColor(trend: 'UP' | 'FLAT' | 'DOWN'): string {
  switch (trend) {
    case 'UP':
      return '#2E8B57'; // Jade green (positive)
    case 'DOWN':
      return '#C65D4A'; // Terracotta (negative)
    case 'FLAT':
    default:
      return '#9CAF88'; // Sage (neutral)
  }
}
