/**
 * OrderSplittingService for JADE Spa Marketplace
 *
 * Task: T069 - Implement multi-vendor order splitting
 *
 * Handles splitting orders across multiple vendors:
 * - Group order lines by vendor
 * - Calculate vendor-specific totals
 * - Manage vendor-specific shipping
 * - Track vendor-specific fulfillment
 * - Coordinate multi-vendor checkout
 */

import { Injectable } from '@nestjs/common';
import {
  VendorOrderSplit,
  FulfillmentStatus,
  splitOrderByVendor,
  calculateVendorSubtotal,
  calculateOverallFulfillmentStatus,
  findVendorOrder,
} from '../entities/order.entity';

/**
 * Order line for splitting
 */
export interface OrderLineInput {
  /** Order line ID */
  id: string;

  /** Vendor ID */
  vendorId: string;

  /** Line total (price * quantity) */
  lineTotal: number;

  /** Product name (for display) */
  productName?: string;

  /** Quantity */
  quantity?: number;
}

/**
 * Shipping cost calculator function
 */
export type ShippingCalculator = (vendorId: string, subtotal: number) => number;

/**
 * Split order result
 */
export interface SplitOrderResult {
  /** Vendor-specific order splits */
  vendorOrders: VendorOrderSplit[];

  /** Total number of vendors */
  vendorCount: number;

  /** Overall subtotal (sum of all vendor subtotals) */
  overallSubtotal: number;

  /** Overall shipping (sum of all vendor shipping) */
  overallShipping: number;

  /** Overall total */
  overallTotal: number;

  /** Vendor breakdown for display */
  vendorBreakdown: Array<{
    vendorId: string;
    vendorName?: string;
    itemCount: number;
    subtotal: number;
    shipping: number;
    total: number;
  }>;
}

/**
 * Fulfillment update
 */
export interface FulfillmentUpdate {
  /** Vendor ID */
  vendorId: string;

  /** New fulfillment status */
  status: FulfillmentStatus;

  /** Tracking number (optional) */
  trackingNumber?: string;

  /** Estimated delivery date (optional) */
  estimatedDelivery?: Date;

  /** Actual ship date (optional) */
  shippedAt?: Date;
}

@Injectable()
export class OrderSplittingService {
  /**
   * Default shipping cost per vendor (in cents)
   */
  static readonly DEFAULT_SHIPPING_COST = 1000; // $10.00

  /**
   * Free shipping threshold (in cents)
   */
  static readonly FREE_SHIPPING_THRESHOLD = 10000; // $100.00

  /**
   * Split order lines by vendor
   *
   * @param orderLines - Order lines to split
   * @param shippingCalculator - Optional custom shipping calculator
   * @returns Split order result with vendor-specific totals
   */
  splitOrder(
    orderLines: OrderLineInput[],
    shippingCalculator?: ShippingCalculator
  ): SplitOrderResult {
    if (!orderLines || orderLines.length === 0) {
      return {
        vendorOrders: [],
        vendorCount: 0,
        overallSubtotal: 0,
        overallShipping: 0,
        overallTotal: 0,
        vendorBreakdown: [],
      };
    }

    // Calculate shipping costs per vendor
    const shippingCosts = this.calculateShippingCosts(
      orderLines,
      shippingCalculator
    );

    // Use entity helper to split order
    const vendorOrders = splitOrderByVendor(orderLines, shippingCosts);

    // Calculate totals
    const overallSubtotal = vendorOrders.reduce((sum, vo) => sum + vo.subtotal, 0);
    const overallShipping = vendorOrders.reduce((sum, vo) => sum + vo.shippingCost, 0);
    const overallTotal = vendorOrders.reduce((sum, vo) => sum + vo.vendorTotal, 0);

    // Create vendor breakdown
    const vendorBreakdown = vendorOrders.map(vo => {
      // Count items for this vendor
      const itemCount = orderLines.filter(line => line.vendorId === vo.vendorId).length;

      return {
        vendorId: vo.vendorId,
        itemCount,
        subtotal: vo.subtotal,
        shipping: vo.shippingCost,
        total: vo.vendorTotal,
      };
    });

    return {
      vendorOrders,
      vendorCount: vendorOrders.length,
      overallSubtotal,
      overallShipping,
      overallTotal,
      vendorBreakdown,
    };
  }

  /**
   * Update fulfillment status for a specific vendor
   *
   * @param vendorOrders - Current vendor order splits
   * @param update - Fulfillment update
   * @returns Updated vendor orders
   */
  updateVendorFulfillment(
    vendorOrders: VendorOrderSplit[],
    update: FulfillmentUpdate
  ): VendorOrderSplit[] {
    const updatedOrders = [...vendorOrders];

    const vendorOrder = findVendorOrder(updatedOrders, update.vendorId);

    if (!vendorOrder) {
      throw new Error(`Vendor order not found for vendor ${update.vendorId}`);
    }

    // Update status
    vendorOrder.fulfillmentStatus = update.status;

    // Update tracking number if provided
    if (update.trackingNumber) {
      vendorOrder.trackingNumber = update.trackingNumber;
    }

    // Update estimated delivery if provided
    if (update.estimatedDelivery) {
      vendorOrder.estimatedDelivery = update.estimatedDelivery.toISOString();
    }

    // Update shipped date if provided
    if (update.shippedAt) {
      vendorOrder.shippedAt = update.shippedAt.toISOString();
    }

    return updatedOrders;
  }

  /**
   * Get overall fulfillment status from vendor orders
   *
   * @param vendorOrders - Vendor order splits
   * @returns Overall fulfillment status
   */
  getOverallStatus(vendorOrders: VendorOrderSplit[]): FulfillmentStatus {
    return calculateOverallFulfillmentStatus(vendorOrders);
  }

  /**
   * Check if order is fully fulfilled
   *
   * @param vendorOrders - Vendor order splits
   * @returns True if all vendors have fulfilled their portion
   */
  isFullyFulfilled(vendorOrders: VendorOrderSplit[]): boolean {
    return vendorOrders.every(
      vo => vo.fulfillmentStatus === FulfillmentStatus.FULFILLED
    );
  }

  /**
   * Check if order is partially fulfilled
   *
   * @param vendorOrders - Vendor order splits
   * @returns True if at least one vendor has fulfilled but not all
   */
  isPartiallyFulfilled(vendorOrders: VendorOrderSplit[]): boolean {
    const fulfilledCount = vendorOrders.filter(
      vo => vo.fulfillmentStatus === FulfillmentStatus.FULFILLED
    ).length;

    return fulfilledCount > 0 && fulfilledCount < vendorOrders.length;
  }

  /**
   * Get vendors that haven't shipped yet
   *
   * @param vendorOrders - Vendor order splits
   * @returns Vendor IDs that are still processing
   */
  getPendingVendors(vendorOrders: VendorOrderSplit[]): string[] {
    return vendorOrders
      .filter(
        vo =>
          vo.fulfillmentStatus === FulfillmentStatus.PENDING ||
          vo.fulfillmentStatus === FulfillmentStatus.PROCESSING
      )
      .map(vo => vo.vendorId);
  }

  /**
   * Get vendors that have shipped
   *
   * @param vendorOrders - Vendor order splits
   * @returns Vendor IDs with tracking info
   */
  getShippedVendors(
    vendorOrders: VendorOrderSplit[]
  ): Array<{ vendorId: string; trackingNumber?: string }> {
    return vendorOrders
      .filter(
        vo =>
          vo.fulfillmentStatus === FulfillmentStatus.SHIPPED ||
          vo.fulfillmentStatus === FulfillmentStatus.FULFILLED
      )
      .map(vo => ({
        vendorId: vo.vendorId,
        trackingNumber: vo.trackingNumber,
      }));
  }

  /**
   * Calculate estimated delivery date
   *
   * Based on the latest vendor's estimated delivery
   *
   * @param vendorOrders - Vendor order splits
   * @returns Estimated delivery date or null
   */
  calculateEstimatedDelivery(vendorOrders: VendorOrderSplit[]): Date | null {
    const deliveryDates = vendorOrders
      .filter(vo => vo.estimatedDelivery)
      .map(vo => new Date(vo.estimatedDelivery!))
      .filter(date => !isNaN(date.getTime()));

    if (deliveryDates.length === 0) {
      return null;
    }

    // Return the latest date (when all items will arrive)
    return new Date(Math.max(...deliveryDates.map(d => d.getTime())));
  }

  /**
   * Get vendor order by vendor ID
   *
   * @param vendorOrders - Vendor order splits
   * @param vendorId - Vendor ID to find
   * @returns Vendor order or null
   */
  getVendorOrder(
    vendorOrders: VendorOrderSplit[],
    vendorId: string
  ): VendorOrderSplit | null {
    return findVendorOrder(vendorOrders, vendorId);
  }

  /**
   * Calculate shipping costs for each vendor
   *
   * @private
   */
  private calculateShippingCosts(
    orderLines: OrderLineInput[],
    shippingCalculator?: ShippingCalculator
  ): Map<string, number> {
    const shippingCosts = new Map<string, number>();

    // Group lines by vendor to calculate subtotals
    const vendorSubtotals = new Map<string, number>();

    for (const line of orderLines) {
      const currentSubtotal = vendorSubtotals.get(line.vendorId) || 0;
      vendorSubtotals.set(line.vendorId, currentSubtotal + line.lineTotal);
    }

    // Calculate shipping for each vendor
    for (const [vendorId, subtotal] of vendorSubtotals.entries()) {
      let shippingCost: number;

      if (shippingCalculator) {
        // Use custom calculator
        shippingCost = shippingCalculator(vendorId, subtotal);
      } else {
        // Use default: free shipping over threshold, otherwise flat rate
        shippingCost =
          subtotal >= OrderSplittingService.FREE_SHIPPING_THRESHOLD
            ? 0
            : OrderSplittingService.DEFAULT_SHIPPING_COST;
      }

      shippingCosts.set(vendorId, shippingCost);
    }

    return shippingCosts;
  }

  /**
   * Merge vendor orders from multiple sources
   *
   * Useful for combining orders from same vendor
   *
   * @param vendorOrders1 - First set of vendor orders
   * @param vendorOrders2 - Second set of vendor orders
   * @returns Merged vendor orders
   */
  mergeVendorOrders(
    vendorOrders1: VendorOrderSplit[],
    vendorOrders2: VendorOrderSplit[]
  ): VendorOrderSplit[] {
    const merged = new Map<string, VendorOrderSplit>();

    // Add first set
    for (const vo of vendorOrders1) {
      merged.set(vo.vendorId, { ...vo });
    }

    // Merge second set
    for (const vo of vendorOrders2) {
      const existing = merged.get(vo.vendorId);

      if (existing) {
        // Combine order lines
        existing.orderLineIds = [
          ...existing.orderLineIds,
          ...vo.orderLineIds,
        ];

        // Add subtotals
        existing.subtotal += vo.subtotal;

        // Keep higher shipping cost (or add if different shipping methods)
        existing.shippingCost = Math.max(existing.shippingCost, vo.shippingCost);

        // Recalculate total
        existing.vendorTotal = existing.subtotal + existing.shippingCost;

        // Use most advanced fulfillment status
        const statuses = [existing.fulfillmentStatus, vo.fulfillmentStatus];
        existing.fulfillmentStatus = this.getMostAdvancedStatus(statuses);
      } else {
        merged.set(vo.vendorId, { ...vo });
      }
    }

    return Array.from(merged.values());
  }

  /**
   * Get the most advanced fulfillment status
   *
   * Order: PENDING < PROCESSING < SHIPPED < FULFILLED, CANCELLED
   *
   * @private
   */
  private getMostAdvancedStatus(
    statuses: FulfillmentStatus[]
  ): FulfillmentStatus {
    const statusOrder = {
      [FulfillmentStatus.PENDING]: 0,
      [FulfillmentStatus.PROCESSING]: 1,
      [FulfillmentStatus.SHIPPED]: 2,
      [FulfillmentStatus.FULFILLED]: 3,
      [FulfillmentStatus.CANCELLED]: 4,
    };

    return statuses.reduce((mostAdvanced, current) => {
      return statusOrder[current] > statusOrder[mostAdvanced]
        ? current
        : mostAdvanced;
    });
  }

  /**
   * Calculate commission for vendor order
   *
   * @param vendorOrder - Vendor order split
   * @param commissionRate - Commission rate percentage (e.g., 15 for 15%)
   * @returns Commission breakdown
   */
  calculateCommission(
    vendorOrder: VendorOrderSplit,
    commissionRate: number
  ): {
    subtotal: number;
    commission: number;
    vendorPayout: number;
  } {
    const commission = (vendorOrder.subtotal * commissionRate) / 100;
    const vendorPayout = vendorOrder.subtotal - commission;

    return {
      subtotal: vendorOrder.subtotal,
      commission,
      vendorPayout,
    };
  }

  /**
   * Generate tracking summary for customer
   *
   * @param vendorOrders - Vendor order splits
   * @returns Tracking summary string
   */
  generateTrackingSummary(vendorOrders: VendorOrderSplit[]): string {
    const totalVendors = vendorOrders.length;
    const shippedVendors = this.getShippedVendors(vendorOrders);
    const pendingVendors = this.getPendingVendors(vendorOrders);

    if (shippedVendors.length === 0) {
      return `Your order is being prepared by ${totalVendors} vendor${
        totalVendors > 1 ? 's' : ''
      }.`;
    }

    if (pendingVendors.length === 0) {
      return `All items have shipped from ${totalVendors} vendor${
        totalVendors > 1 ? 's' : ''
      }.`;
    }

    return (
      `${shippedVendors.length} of ${totalVendors} vendor${
        totalVendors > 1 ? 's have' : ' has'
      } shipped. ` +
      `${pendingVendors.length} vendor${pendingVendors.length > 1 ? 's are' : ' is'} still preparing items.`
    );
  }
}
