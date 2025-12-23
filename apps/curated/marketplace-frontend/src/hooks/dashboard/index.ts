/**
 * Dashboard Data Transformation Hooks
 *
 * These hooks transform Vendure GraphQL API responses into the format
 * expected by Figma dashboard components.
 */

export {
  useProductsForDashboard,
  useProductStats,
  type DashboardProduct,
  type ProductFilters,
} from './useProductsForDashboard';

export {
  useOrdersForDashboard,
  useOrderStats,
  type DashboardOrder,
  type OrderFilters,
} from './useOrdersForDashboard';

export {
  useDashboardMetrics,
  useFormatCurrency,
  useFormatRelativeTime,
  type DashboardMetrics,
  type ActivityItem,
} from './useDashboardMetrics';

export {
  useProductMutations,
  type CreateProductData,
  type UpdateProductData,
  type UpdateProductVariantData,
} from './useProductMutations';

export {
  useInventoryForDashboard,
  useInventoryMutations,
  useInventoryStats,
  type DashboardInventoryItem,
  type InventoryFilters,
} from './useInventoryForDashboard';

export {
  useAnalyticsForDashboard,
  useAnalyticsSummary,
  type SalesDataPoint,
  type CategoryPerformance,
  type ProductPerformance,
  type CustomerMetrics,
  type AnalyticsDateRange,
} from './useAnalyticsForDashboard';

export {
  useEventsForDashboard,
  useEventMutations,
  useEventStats,
  type DashboardEvent,
  type EventFilters,
} from './useEventsForDashboard';
