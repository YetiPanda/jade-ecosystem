/**
 * Order Management Types
 *
 * Types for vendor order management including order status tracking,
 * line items, fulfillment, and customer information.
 */

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  PACKED = 'packed',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pending',
  [OrderStatus.CONFIRMED]: 'Confirmed',
  [OrderStatus.PROCESSING]: 'Processing',
  [OrderStatus.PACKED]: 'Packed',
  [OrderStatus.SHIPPED]: 'Shipped',
  [OrderStatus.DELIVERED]: 'Delivered',
  [OrderStatus.CANCELLED]: 'Cancelled',
  [OrderStatus.REFUNDED]: 'Refunded',
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: '#eab308', // yellow
  [OrderStatus.CONFIRMED]: '#3b82f6', // blue
  [OrderStatus.PROCESSING]: '#8b5cf6', // purple
  [OrderStatus.PACKED]: '#06b6d4', // cyan
  [OrderStatus.SHIPPED]: '#10b981', // green
  [OrderStatus.DELIVERED]: '#22c55e', // bright green
  [OrderStatus.CANCELLED]: '#6b7280', // gray
  [OrderStatus.REFUNDED]: '#ef4444', // red
};

export interface VendorOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;

  // Customer information
  spaId: string;
  spaName: string;

  // Financial
  subtotal: number; // in cents
  tax: number; // in cents
  shipping: number; // in cents
  total: number; // in cents

  // Line items
  lineItems: OrderLineItem[];
  lineItemCount: number;
  totalUnits: number;

  // Dates
  createdAt: string; // ISO 8601
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;

  // Shipping
  shippingAddress: ShippingAddress;
  trackingNumber?: string;
  carrier?: string;

  // Notes
  customerNotes?: string;
  vendorNotes?: string;
}

export interface OrderLineItem {
  id: string;
  productId: string;
  productName: string;
  variantName?: string;
  sku: string;
  quantity: number;
  unitPrice: number; // in cents
  subtotal: number; // in cents
  productImageUrl?: string;
}

export interface ShippingAddress {
  name: string;
  businessName?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface OrderFilters {
  status?: OrderStatus[];
  spaId?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
}

export interface OrdersQueryInput {
  filters?: OrderFilters;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'total' | 'status';
  sortOrder?: 'asc' | 'desc';
}

export interface OrdersQueryResult {
  orders: VendorOrder[];
  totalCount: number;
  hasMore: boolean;
}

export interface UpdateOrderStatusInput {
  orderId: string;
  status: OrderStatus;
  trackingNumber?: string;
  carrier?: string;
  vendorNotes?: string;
}

/**
 * Helper to format order total
 */
export function formatOrderTotal(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Helper to format order date
 */
export function formatOrderDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Helper to get status progression
 */
export function getStatusProgression(status: OrderStatus): number {
  const progression: Record<OrderStatus, number> = {
    [OrderStatus.PENDING]: 0,
    [OrderStatus.CONFIRMED]: 1,
    [OrderStatus.PROCESSING]: 2,
    [OrderStatus.PACKED]: 3,
    [OrderStatus.SHIPPED]: 4,
    [OrderStatus.DELIVERED]: 5,
    [OrderStatus.CANCELLED]: -1,
    [OrderStatus.REFUNDED]: -2,
  };
  return progression[status];
}

/**
 * Helper to check if status can transition
 */
export function canTransitionTo(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  // Cancelled and Refunded are terminal states
  if (currentStatus === OrderStatus.CANCELLED || currentStatus === OrderStatus.REFUNDED) {
    return false;
  }

  // Can always cancel or refund (except from terminal states)
  if (newStatus === OrderStatus.CANCELLED || newStatus === OrderStatus.REFUNDED) {
    return true;
  }

  // Must progress forward (except for cancel/refund)
  const currentProgression = getStatusProgression(currentStatus);
  const newProgression = getStatusProgression(newStatus);

  return newProgression > currentProgression;
}

/**
 * Get available status transitions
 */
export function getAvailableTransitions(currentStatus: OrderStatus): OrderStatus[] {
  const allStatuses = Object.values(OrderStatus);
  return allStatuses.filter((status) => canTransitionTo(currentStatus, status));
}
