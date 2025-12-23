/**
 * GraphQL Types for Vendor Dashboard
 *
 * These types match the schema defined in:
 * apps/curated/vendure-backend/src/schema/vendor-portal.graphql
 */

export interface DateRangeInput {
  startDate: string; // ISO 8601 date string
  endDate: string;   // ISO 8601 date string
}

export interface VendorDashboardMetrics {
  // Revenue metrics
  totalRevenue: number;          // Total revenue in cents
  revenueChange: number;         // Percentage change from previous period

  // Order metrics
  totalOrders: number;           // Number of orders
  ordersChange: number;          // Percentage change from previous period
  averageOrderValue: number;     // Average order value in cents

  // Spa metrics
  activeSpas: number;            // Number of active spa customers
  newSpas: number;               // Number of new spas this period
  spasChange: number;            // Percentage change from previous period

  // Reorder metrics
  reorderRate: number;           // Percentage of spas that reordered
  reorderRateChange: number;     // Percentage change from previous period

  // Product metrics
  topProducts: ProductMetric[];

  // Period info
  periodStart: string;           // ISO 8601 date
  periodEnd: string;             // ISO 8601 date
  comparisonPeriodStart?: string;
  comparisonPeriodEnd?: string;
}

export interface ProductMetric {
  productId: string;
  productName: string;
  revenue: number;               // Revenue in cents
  unitsSold: number;
  uniqueSpas: number;            // Number of unique spas that ordered
}

export interface SpaMetric {
  spaId: string;
  spaName: string;
  lifetimeValue: number;         // Total spent in cents
  orderCount: number;
  lastOrderDate: string;         // ISO 8601 date
  reorderRate: number;           // Percentage
}

/**
 * Helper type for trend calculation
 */
export interface TrendData {
  value: number;
  change: number;
  direction: 'up' | 'down' | 'neutral';
}

/**
 * Utility function to calculate trend direction
 */
export function getTrendDirection(change: number): 'up' | 'down' | 'neutral' {
  if (change > 0) return 'up';
  if (change < 0) return 'down';
  return 'neutral';
}

/**
 * Utility function to format currency (cents to dollars)
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

/**
 * Utility function to format percentage
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}
