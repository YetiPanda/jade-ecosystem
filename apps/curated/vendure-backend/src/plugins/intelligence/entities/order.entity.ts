/**
 * Order Entity Extensions for JADE Spa Marketplace
 *
 * Task: T063 - Create Order entity extending Vendure Order
 *
 * Extends Vendure's base Order entity with:
 * - Spa organization association
 * - Multi-vendor order splitting
 * - Wholesale-specific fields
 */

import { Order } from '@vendure/core';

/**
 * Vendor-specific portion of a multi-vendor order
 */
export interface VendorOrderSplit {
  /** Vendor organization ID */
  vendorId: string;

  /** Order lines for this vendor */
  orderLineIds: string[];

  /** Subtotal for this vendor's items */
  subtotal: number;

  /** Shipping cost for this vendor */
  shippingCost: number;

  /** Total for this vendor (subtotal + shipping) */
  vendorTotal: number;

  /** Fulfillment status for this vendor's portion */
  fulfillmentStatus: FulfillmentStatus;

  /** Tracking number (optional) */
  trackingNumber?: string;

  /** Carrier (optional) */
  carrier?: string;

  /** Shipped timestamp (optional) */
  shippedAt?: string; // ISO 8601

  /** Delivered timestamp (optional) */
  deliveredAt?: string; // ISO 8601
}

/**
 * Fulfillment status enum
 */
export enum FulfillmentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

/**
 * Payment status enum
 */
export enum PaymentStatus {
  PENDING = 'PENDING',
  AUTHORIZED = 'AUTHORIZED',
  CAPTURED = 'CAPTURED',
  REFUNDED = 'REFUNDED',
}

/**
 * Shipping address
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Extended Order type with JADE custom fields
 *
 * NOTE: These extensions are implemented via Vendure's CustomFields API
 * The actual implementation uses Order.customFields.*
 */
export interface JadeOrder extends Order {
  customFields: {
    /** Spa organization that placed the order */
    spaOrganizationId: string;

    /** User who placed the order */
    placedByUserId: string;

    /** Multi-vendor order splits (JSONB) */
    vendorOrders: string; // JSON string of VendorOrderSplit[]

    /** Shipping address (JSONB) */
    shippingAddress: string; // JSON string of Address

    /** Billing address (JSONB) */
    billingAddress: string; // JSON string of Address

    /** Discount amount */
    discountAmount: number;

    /** Overall fulfillment status */
    fulfillmentStatus: FulfillmentStatus;

    /** Payment status */
    paymentStatus: PaymentStatus;

    /** Order notes (optional) */
    notes?: string;

    /** Placed at timestamp */
    placedAt: Date;

    /** Fulfilled at timestamp (optional) */
    fulfilledAt?: Date;
  };
}

/**
 * Custom fields configuration for Order entity
 * Used in vendure-config.ts to extend the Order entity
 */
export const OrderCustomFields = [
  {
    name: 'spaOrganizationId',
    type: 'string' as const,
    label: [{ languageCode: 'en' as const, value: 'Spa Organization ID' }],
    description: [{ languageCode: 'en' as const, value: 'Spa organization that placed this order' }],
    public: true,
  },
  {
    name: 'placedByUserId',
    type: 'string' as const,
    label: [{ languageCode: 'en' as const, value: 'Placed By User ID' }],
    description: [{ languageCode: 'en' as const, value: 'User who placed this order' }],
    public: true,
  },
  {
    name: 'vendorOrders',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Vendor Order Splits (JSON)' }],
    description: [{ languageCode: 'en' as const, value: 'Multi-vendor order split information' }],
    public: true,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'shippingAddress',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Shipping Address (JSON)' }],
    description: [{ languageCode: 'en' as const, value: 'Shipping address for this order' }],
    public: true,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'billingAddress',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Billing Address (JSON)' }],
    description: [{ languageCode: 'en' as const, value: 'Billing address for this order' }],
    public: true,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'discountAmount',
    type: 'int' as const,
    label: [{ languageCode: 'en' as const, value: 'Discount Amount' }],
    description: [{ languageCode: 'en' as const, value: 'Total discount amount in cents' }],
    defaultValue: 0,
    public: true,
  },
  {
    name: 'fulfillmentStatus',
    type: 'string' as const,
    label: [{ languageCode: 'en' as const, value: 'Fulfillment Status' }],
    description: [{ languageCode: 'en' as const, value: 'Overall order fulfillment status' }],
    defaultValue: FulfillmentStatus.PENDING,
    public: true,
    options: [
      { value: FulfillmentStatus.PENDING },
      { value: FulfillmentStatus.PROCESSING },
      { value: FulfillmentStatus.SHIPPED },
      { value: FulfillmentStatus.DELIVERED },
      { value: FulfillmentStatus.CANCELLED },
    ],
  },
  {
    name: 'paymentStatus',
    type: 'string' as const,
    label: [{ languageCode: 'en' as const, value: 'Payment Status' }],
    description: [{ languageCode: 'en' as const, value: 'Payment processing status' }],
    defaultValue: PaymentStatus.PENDING,
    public: true,
    options: [
      { value: PaymentStatus.PENDING },
      { value: PaymentStatus.AUTHORIZED },
      { value: PaymentStatus.CAPTURED },
      { value: PaymentStatus.REFUNDED },
    ],
  },
  {
    name: 'notes',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Order Notes' }],
    description: [{ languageCode: 'en' as const, value: 'Special instructions or notes' }],
    nullable: true,
    public: true,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'placedAt',
    type: 'datetime' as const,
    label: [{ languageCode: 'en' as const, value: 'Placed At' }],
    description: [{ languageCode: 'en' as const, value: 'Order placement timestamp' }],
    public: true,
  },
  {
    name: 'fulfilledAt',
    type: 'datetime' as const,
    label: [{ languageCode: 'en' as const, value: 'Fulfilled At' }],
    description: [{ languageCode: 'en' as const, value: 'Order fulfillment timestamp' }],
    nullable: true,
    public: true,
  },
];

/**
 * Helper to parse vendor order splits from JSON string
 */
export function parseVendorOrders(vendorOrdersJson: string): VendorOrderSplit[] {
  return JSON.parse(vendorOrdersJson);
}

/**
 * Helper to parse shipping address from JSON string
 */
export function parseShippingAddress(addressJson: string): Address {
  return JSON.parse(addressJson);
}

/**
 * Helper to parse billing address from JSON string
 */
export function parseBillingAddress(addressJson: string): Address {
  return JSON.parse(addressJson);
}

/**
 * Helper to split order by vendors
 * Groups order lines by vendor and creates vendor-specific splits
 */
export function splitOrderByVendor(
  orderLines: Array<{ id: string; vendorId: string; lineTotal: number }>,
  shippingCosts: Map<string, number>
): VendorOrderSplit[] {
  // Group order lines by vendor
  const vendorGroups = new Map<string, typeof orderLines>();

  for (const line of orderLines) {
    const existing = vendorGroups.get(line.vendorId) || [];
    existing.push(line);
    vendorGroups.set(line.vendorId, existing);
  }

  // Create vendor splits
  const vendorSplits: VendorOrderSplit[] = [];

  for (const [vendorId, lines] of vendorGroups) {
    const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
    const shippingCost = shippingCosts.get(vendorId) || 0;
    const vendorTotal = subtotal + shippingCost;

    vendorSplits.push({
      vendorId,
      orderLineIds: lines.map(l => l.id),
      subtotal,
      shippingCost,
      vendorTotal,
      fulfillmentStatus: FulfillmentStatus.PENDING,
    });
  }

  return vendorSplits;
}

/**
 * Helper to calculate overall order fulfillment status
 * Based on individual vendor fulfillment statuses
 */
export function calculateOverallFulfillmentStatus(vendorOrders: VendorOrderSplit[]): FulfillmentStatus {
  if (vendorOrders.length === 0) {
    return FulfillmentStatus.PENDING;
  }

  // If any vendor is cancelled, consider entire order cancelled
  if (vendorOrders.some(vo => vo.fulfillmentStatus === FulfillmentStatus.CANCELLED)) {
    return FulfillmentStatus.CANCELLED;
  }

  // If all vendors are delivered, order is delivered
  if (vendorOrders.every(vo => vo.fulfillmentStatus === FulfillmentStatus.DELIVERED)) {
    return FulfillmentStatus.DELIVERED;
  }

  // If any vendor has shipped, order is at least partially shipped
  if (vendorOrders.some(vo => vo.fulfillmentStatus === FulfillmentStatus.SHIPPED)) {
    return FulfillmentStatus.SHIPPED;
  }

  // If any vendor is processing, order is processing
  if (vendorOrders.some(vo => vo.fulfillmentStatus === FulfillmentStatus.PROCESSING)) {
    return FulfillmentStatus.PROCESSING;
  }

  // Otherwise, order is pending
  return FulfillmentStatus.PENDING;
}

/**
 * Helper to get vendor split by vendor ID
 */
export function getVendorSplit(vendorOrders: VendorOrderSplit[], vendorId: string): VendorOrderSplit | null {
  return vendorOrders.find(vo => vo.vendorId === vendorId) || null;
}

/**
 * Helper to check if order is fully fulfilled
 */
export function isOrderFullyFulfilled(order: JadeOrder): boolean {
  const vendorOrders = parseVendorOrders(order.customFields.vendorOrders);
  return vendorOrders.every(vo => vo.fulfillmentStatus === FulfillmentStatus.DELIVERED);
}

/**
 * Helper to check if order can be cancelled
 */
export function canCancelOrder(order: JadeOrder): boolean {
  const vendorOrders = parseVendorOrders(order.customFields.vendorOrders);
  // Can only cancel if no vendor has shipped yet
  return !vendorOrders.some(vo =>
    vo.fulfillmentStatus === FulfillmentStatus.SHIPPED ||
    vo.fulfillmentStatus === FulfillmentStatus.DELIVERED
  );
}

/**
 * Helper to generate order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${timestamp}-${random}`;
}

/**
 * Helper to format address for display
 */
export function formatAddress(address: Address): string {
  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}, ${address.country}`;
}

/**
 * Helper to validate address completeness
 */
export function validateAddress(address: Address): string[] {
  const errors: string[] = [];

  if (!address.street) {
    errors.push('Street address is required');
  }

  if (!address.city) {
    errors.push('City is required');
  }

  if (!address.state) {
    errors.push('State is required');
  }

  if (!address.zipCode) {
    errors.push('Zip code is required');
  }

  if (!address.country) {
    errors.push('Country is required');
  }

  return errors;
}
