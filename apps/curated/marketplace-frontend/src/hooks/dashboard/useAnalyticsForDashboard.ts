import { useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

/**
 * Analytics Data Types
 */
export interface SalesDataPoint {
  date: string;
  revenue: number;
  orders: number;
  avgOrderValue: number;
}

export interface CategoryPerformance {
  category: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface ProductPerformance {
  productId: string;
  name: string;
  revenue: number;
  unitsSold: number;
  growth: number;
}

export interface CustomerMetrics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  avgLifetimeValue: number;
  churnRate: number;
}

export interface AnalyticsDateRange {
  from: Date;
  to: Date;
}

const GET_SALES_ANALYTICS = gql`
  query GetSalesAnalytics($startDate: DateTime!, $endDate: DateTime!) {
    salesAnalytics(startDate: $startDate, endDate: $endDate) {
      daily {
        date
        revenue
        orders
        avgOrderValue
      }
      byCategory {
        category
        revenue
        orders
        growth
      }
      topProducts {
        productId
        name
        revenue
        unitsSold
        growth
      }
      customerMetrics {
        totalCustomers
        newCustomers
        returningCustomers
        avgLifetimeValue
        churnRate
      }
    }
  }
`;

/**
 * Generate mock sales data for development
 * This will be replaced with real API data
 */
function generateMockSalesData(dateRange: AnalyticsDateRange): SalesDataPoint[] {
  const data: SalesDataPoint[] = [];
  const days = Math.floor((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = 0; i <= days; i++) {
    const date = new Date(dateRange.from);
    date.setDate(date.getDate() + i);

    // Generate realistic-looking data with some randomness and trends
    const baseRevenue = 5000 + Math.random() * 3000;
    const trend = i * 50; // Upward trend
    const weekendMultiplier = [0, 6].includes(date.getDay()) ? 1.3 : 1.0;

    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.round((baseRevenue + trend) * weekendMultiplier),
      orders: Math.round(15 + Math.random() * 10),
      avgOrderValue: Math.round(baseRevenue / (15 + Math.random() * 10)),
    });
  }

  return data;
}

/**
 * Generate mock category performance data
 */
function generateMockCategoryData(): CategoryPerformance[] {
  return [
    { category: 'Treatment Serums', revenue: 45600, orders: 234, growth: 23.5 },
    { category: 'Active Serums', revenue: 32400, orders: 567, growth: 18.2 },
    { category: 'Medical Injectables', revenue: 78900, orders: 89, growth: 12.8 },
    { category: 'Moisturizers', revenue: 28700, orders: 456, growth: 15.4 },
    { category: 'Equipment', revenue: 52300, orders: 43, growth: 8.9 },
  ];
}

/**
 * Generate mock top products data
 */
function generateMockTopProducts(): ProductPerformance[] {
  return [
    {
      productId: '1',
      name: 'HydraFacial Serum - Activ-4',
      revenue: 18450,
      unitsSold: 89,
      growth: 23.0,
    },
    {
      productId: '2',
      name: 'Botox 100u Vials',
      revenue: 45600,
      unitsSold: 12,
      growth: 18.5,
    },
    {
      productId: '3',
      name: 'Vitamin C Brightening Serum',
      revenue: 12300,
      unitsSold: 156,
      growth: 15.2,
    },
    {
      productId: '4',
      name: 'Dermal Filler - Juvederm',
      revenue: 32100,
      unitsSold: 34,
      growth: 12.8,
    },
    {
      productId: '5',
      name: 'LED Light Therapy Device',
      revenue: 28900,
      unitsSold: 23,
      growth: 9.5,
    },
  ];
}

/**
 * Generate mock customer metrics
 */
function generateMockCustomerMetrics(): CustomerMetrics {
  return {
    totalCustomers: 245,
    newCustomers: 32,
    returningCustomers: 213,
    avgLifetimeValue: 12450,
    churnRate: 8.5,
  };
}

/**
 * Hook to fetch and transform analytics data
 */
export function useAnalyticsForDashboard(dateRange: AnalyticsDateRange) {
  const { data, loading, error } = useQuery(GET_SALES_ANALYTICS, {
    variables: {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    },
    fetchPolicy: 'cache-and-network',
    // Skip if API not available
    skip: true, // TODO: Change to false when API is ready
  });

  const analytics = useMemo(() => {
    // Use API data if available, otherwise use mock data
    if (data?.salesAnalytics) {
      return {
        salesData: data.salesAnalytics.daily,
        categoryPerformance: data.salesAnalytics.byCategory,
        topProducts: data.salesAnalytics.topProducts,
        customerMetrics: data.salesAnalytics.customerMetrics,
      };
    }

    // Mock data for development
    return {
      salesData: generateMockSalesData(dateRange),
      categoryPerformance: generateMockCategoryData(),
      topProducts: generateMockTopProducts(),
      customerMetrics: generateMockCustomerMetrics(),
    };
  }, [data, dateRange]);

  return {
    ...analytics,
    loading,
    error,
  };
}

/**
 * Hook to calculate analytics summary metrics
 */
export function useAnalyticsSummary(dateRange: AnalyticsDateRange) {
  const { salesData, categoryPerformance, loading } = useAnalyticsForDashboard(dateRange);

  const summary = useMemo(() => {
    if (loading) {
      return {
        totalRevenue: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        revenueGrowth: 0,
        ordersGrowth: 0,
        topCategory: '',
        topCategoryRevenue: 0,
      };
    }

    const totalRevenue = salesData.reduce((sum, day) => sum + day.revenue, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Calculate growth (compare first half vs second half)
    const midpoint = Math.floor(salesData.length / 2);
    const firstHalfRevenue = salesData
      .slice(0, midpoint)
      .reduce((sum, day) => sum + day.revenue, 0);
    const secondHalfRevenue = salesData
      .slice(midpoint)
      .reduce((sum, day) => sum + day.revenue, 0);
    const revenueGrowth = firstHalfRevenue > 0
      ? ((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100
      : 0;

    const firstHalfOrders = salesData
      .slice(0, midpoint)
      .reduce((sum, day) => sum + day.orders, 0);
    const secondHalfOrders = salesData
      .slice(midpoint)
      .reduce((sum, day) => sum + day.orders, 0);
    const ordersGrowth = firstHalfOrders > 0
      ? ((secondHalfOrders - firstHalfOrders) / firstHalfOrders) * 100
      : 0;

    const topCategory = categoryPerformance.reduce((top, cat) =>
      cat.revenue > top.revenue ? cat : top,
      categoryPerformance[0] || { category: '', revenue: 0 }
    );

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue,
      revenueGrowth,
      ordersGrowth,
      topCategory: topCategory.category,
      topCategoryRevenue: topCategory.revenue,
    };
  }, [salesData, categoryPerformance, loading]);

  return { summary, loading };
}
