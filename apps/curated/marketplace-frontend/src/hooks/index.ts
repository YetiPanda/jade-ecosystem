/**
 * Marketplace Hooks - Centralized exports
 * Phase 3 User Story 1: GraphQL Integration (T083-T088)
 */

// Product hooks
export {
  useProducts,
  useProduct,
  useVendorProducts,
  usePricingCalculator,
  useProductSearch,
  useProductFilters,
} from './useProducts';

export type { ProductFilters, PaginationOptions, UseProductsOptions } from './useProducts';

// Cart hooks
export {
  useCart,
  useCartByVendor,
  useCartValidation,
  useQuantitySelector,
} from './useCart';

// Checkout hooks
export {
  useCheckout,
  useCancelOrder,
  useReorder,
  useReturnRequest,
  useOrderTracking,
  useAddressValidation,
} from './useCheckout';

export type { Address, CheckoutInput, CheckoutStep } from './useCheckout';

// Skincare search hooks
export {
  useSkincareSearch,
  useSkincareFilterOptions,
  useSimilarSkincareProducts,
  useSkincareRoutine,
  useSkincareProduct,
  useSkincareByCategory,
} from './useSkincareSearch';

export type {
  SkincareProduct,
  SkincareSearchFilters,
  SkinProfile,
  SkincareFilterOptions,
} from './useSkincareSearch';

// Settings hooks
export {
  useSettings,
  useTheme,
  useNotificationPreferences,
} from './useSettings';

export type {
  UserSettings,
  ProfileSettings,
  NotificationSettings,
  AppPreferences,
  SettingsError,
} from './useSettings';
