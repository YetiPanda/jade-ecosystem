/**
 * OrderService for JADE Spa Marketplace
 *
 * Task: T067 - Implement OrderService for wholesale orders
 *
 * Handles order operations including:
 * - Create orders from cart
 * - Multi-vendor order splitting
 * - Order status management
 * - Order history and tracking
 * - Reorder functionality
 */

import { Injectable, Inject } from '@nestjs/common';
import {
  RequestContext,
  TransactionalConnection,
  Order,
  OrderLine,
  ID,
  EntityHydrator,
} from '@vendure/core';
import { CartService } from './cart.service';
import { ProductService } from './product.service';
import {
  VendorOrderSplit,
  FulfillmentStatus,
  PaymentStatus,
  splitOrderByVendor,
  generateOrderNumber,
  calculateOverallFulfillmentStatus,
} from '../entities/order.entity';

/**
 * Shipping address
 */
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

/**
 * Payment information
 */
export interface PaymentInfo {
  method: 'credit_card' | 'net_30' | 'wire_transfer';
  cardLast4?: string;
  cardBrand?: string;
  transactionId?: string;
}

/**
 * Checkout input
 */
export interface CheckoutInput {
  /** Shipping address */
  shippingAddress: ShippingAddress;

  /** Billing address (same as shipping if not provided) */
  billingAddress?: ShippingAddress;

  /** Payment information */
  payment: PaymentInfo;

  /** Special instructions/notes */
  notes?: string;

  /** Apply discount code */
  discountCode?: string;
}

/**
 * Order summary for display
 */
export interface OrderSummary {
  /** Order ID */
  id: ID;

  /** Human-readable order number */
  orderNumber: string;

  /** Spa organization ID */
  spaOrganizationId: string;

  /** User who placed the order */
  placedByUserId: string;

  /** Order creation date */
  placedAt: Date;

  /** Overall fulfillment status */
  fulfillmentStatus: FulfillmentStatus;

  /** Payment status */
  paymentStatus: PaymentStatus;

  /** Order total */
  total: number;

  /** Number of items */
  itemCount: number;

  /** Number of vendors */
  vendorCount: number;

  /** Vendor-specific order splits */
  vendorOrders: VendorOrderSplit[];
}

/**
 * Detailed order with all information
 */
export interface OrderDetail extends OrderSummary {
  /** Order lines */
  lines: OrderLine[];

  /** Shipping address */
  shippingAddress: ShippingAddress;

  /** Billing address */
  billingAddress: ShippingAddress;

  /** Subtotal */
  subtotal: number;

  /** Tax */
  tax: number;

  /** Shipping cost */
  shipping: number;

  /** Discount amount */
  discount: number;

  /** Notes */
  notes?: string;

  /** Fulfillment date (if completed) */
  fulfilledAt?: Date;
}

@Injectable()
export class OrderService {
  constructor(
    @Inject(TransactionalConnection) private connection: TransactionalConnection,
    @Inject(CartService) private cartService: CartService,
    @Inject(ProductService) private productService: ProductService,
    @Inject(EntityHydrator) private entityHydrator: EntityHydrator
  ) {}

  /**
   * Create order from cart (checkout)
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @param spaOrganizationId - Spa organization ID
   * @param checkoutInput - Checkout information
   * @returns Created order summary
   */
  async createOrder(
    ctx: RequestContext,
    userId: ID,
    spaOrganizationId: ID,
    checkoutInput: CheckoutInput
  ): Promise<OrderSummary> {
    // Validate cart
    const validation = await this.cartService.validateCart(ctx, userId);
    if (!validation.valid) {
      throw new Error(`Cart validation failed: ${validation.errors.join(', ')}`);
    }

    // Get cart
    const cart = await this.cartService.getActiveCart(ctx, userId);
    const order = await this.getOrderById(ctx, cart.orderId);

    // Reserve inventory for all items
    for (const item of cart.items) {
      const reserved = await this.productService.reserveInventory(
        ctx,
        item.productId,
        item.quantity
      );

      if (!reserved) {
        // Rollback previous reservations
        await this.rollbackInventoryReservations(ctx, cart.items, item.productId);
        throw new Error(`Failed to reserve inventory for ${item.productName}`);
      }
    }

    // Generate order number
    const orderNumber = generateOrderNumber(spaOrganizationId);

    // Split order by vendor
    const orderLinesData = cart.items.map(item => ({
      id: item.id.toString(),
      vendorId: item.vendorId,
      lineTotal: item.lineTotal,
    }));

    // Calculate shipping per vendor (simplified - $10 per vendor for now)
    const shippingCosts = new Map<string, number>();
    cart.vendorCarts.forEach(vc => {
      shippingCosts.set(vc.vendorId, 10.00);
    });

    const vendorOrders = splitOrderByVendor(orderLinesData, shippingCosts);

    // Update order with checkout info
    order.code = orderNumber;
    order.state = 'PaymentSettled'; // Assuming payment is processed
    (order as any).customFields = {
      ...((order as any).customFields || {}),
      spaOrganizationId: spaOrganizationId.toString(),
      placedByUserId: userId.toString(),
      vendorOrders: JSON.stringify(vendorOrders),
      shippingAddress: JSON.stringify(checkoutInput.shippingAddress),
      billingAddress: JSON.stringify(
        checkoutInput.billingAddress || checkoutInput.shippingAddress
      ),
      fulfillmentStatus: FulfillmentStatus.PENDING,
      paymentStatus: PaymentStatus.PAID,
      notes: checkoutInput.notes || '',
      placedAt: new Date(),
      discountAmount: 0, // TODO: Apply discount codes
    };

    await this.connection.getRepository(ctx, Order).save(order);

    // Clear user's cart (create new empty cart)
    await this.cartService.clearCart(ctx, userId);

    return this.transformOrderToSummary(order);
  }

  /**
   * Get order by ID
   *
   * @param ctx - Request context
   * @param orderId - Order ID
   * @returns Order detail
   */
  async getOrder(ctx: RequestContext, orderId: ID): Promise<OrderDetail | null> {
    const order = await this.getOrderById(ctx, orderId);

    if (!order) {
      return null;
    }

    return this.transformOrderToDetail(order);
  }

  /**
   * Get orders for a spa organization
   *
   * @param ctx - Request context
   * @param spaOrganizationId - Spa organization ID
   * @param options - Pagination options
   * @returns List of orders
   */
  async getOrdersBySpa(
    ctx: RequestContext,
    spaOrganizationId: ID,
    options?: { skip?: number; take?: number }
  ): Promise<{ items: OrderSummary[]; total: number }> {
    const skip = options?.skip || 0;
    const take = options?.take || 20;

    const [orders, total] = await this.connection
      .getRepository(ctx, Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.lines', 'line')
      .where('order.customFieldsSpaorganizationid = :spaId', {
        spaId: spaOrganizationId,
      })
      .andWhere('order.state != :state', { state: 'AddingItems' })
      .orderBy('order.customFieldsPlacedat', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const items = orders.map(order => this.transformOrderToSummary(order));

    return { items, total };
  }

  /**
   * Get orders for a user
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @param options - Pagination options
   * @returns List of user's orders
   */
  async getOrdersByUser(
    ctx: RequestContext,
    userId: ID,
    options?: { skip?: number; take?: number }
  ): Promise<{ items: OrderSummary[]; total: number }> {
    const skip = options?.skip || 0;
    const take = options?.take || 20;

    const [orders, total] = await this.connection
      .getRepository(ctx, Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.lines', 'line')
      .where('order.customFieldsPlacedbyuserid = :userId', { userId })
      .andWhere('order.state != :state', { state: 'AddingItems' })
      .orderBy('order.customFieldsPlacedat', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const items = orders.map(order => this.transformOrderToSummary(order));

    return { items, total };
  }

  /**
   * Get orders for a vendor
   *
   * @param ctx - Request context
   * @param vendorId - Vendor organization ID
   * @param options - Pagination options
   * @returns List of orders containing vendor's products
   */
  async getOrdersByVendor(
    ctx: RequestContext,
    vendorId: ID,
    options?: { skip?: number; take?: number }
  ): Promise<{ items: OrderSummary[]; total: number }> {
    const skip = options?.skip || 0;
    const take = options?.take || 20;

    // Query orders where vendorOrders JSON contains the vendor ID
    const [orders, total] = await this.connection
      .getRepository(ctx, Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.lines', 'line')
      .where("order.customFieldsVendororders::jsonb @> :vendorFilter", {
        vendorFilter: JSON.stringify([{ vendorId: vendorId.toString() }]),
      })
      .andWhere('order.state != :state', { state: 'AddingItems' })
      .orderBy('order.customFieldsPlacedat', 'DESC')
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const items = orders.map(order => this.transformOrderToSummary(order));

    return { items, total };
  }

  /**
   * Update order fulfillment status
   *
   * @param ctx - Request context
   * @param orderId - Order ID
   * @param vendorId - Vendor ID (for vendor-specific status)
   * @param status - New fulfillment status
   * @param trackingNumber - Tracking number (optional)
   * @returns Updated order
   */
  async updateFulfillmentStatus(
    ctx: RequestContext,
    orderId: ID,
    vendorId: ID,
    status: FulfillmentStatus,
    trackingNumber?: string
  ): Promise<OrderSummary> {
    const order = await this.getOrderById(ctx, orderId);
    const customFields = (order as any).customFields || {};

    let vendorOrders: VendorOrderSplit[] = [];
    try {
      vendorOrders = JSON.parse(customFields.vendorOrders || '[]');
    } catch (e) {
      vendorOrders = [];
    }

    // Update vendor-specific status
    const vendorOrder = vendorOrders.find(vo => vo.vendorId === vendorId.toString());
    if (vendorOrder) {
      vendorOrder.fulfillmentStatus = status;
      if (trackingNumber) {
        vendorOrder.trackingNumber = trackingNumber;
      }
    }

    // Calculate overall status
    const overallStatus = calculateOverallFulfillmentStatus(vendorOrders);

    // Update order
    (order as any).customFields = {
      ...customFields,
      vendorOrders: JSON.stringify(vendorOrders),
      fulfillmentStatus: overallStatus,
    };

    // Set fulfilledAt if all fulfilled
    if (overallStatus === FulfillmentStatus.FULFILLED) {
      (order as any).customFields.fulfilledAt = new Date();
    }

    await this.connection.getRepository(ctx, Order).save(order);

    return this.transformOrderToSummary(order);
  }

  /**
   * Reorder - create new cart from previous order
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @param orderId - Order ID to reorder
   * @returns New cart with items from previous order
   */
  async reorder(
    ctx: RequestContext,
    userId: ID,
    orderId: ID
  ): Promise<{ success: boolean; unavailableItems: string[] }> {
    const order = await this.getOrderById(ctx, orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    const unavailableItems: string[] = [];

    // Clear current cart
    await this.cartService.clearCart(ctx, userId);

    // Add each item from the order to cart
    for (const line of order.lines) {
      try {
        const product = await this.productService.getProduct(
          ctx,
          line.productVariant.product.id,
          false
        );

        if (!product) {
          unavailableItems.push(line.productVariant.product.name);
          continue;
        }

        if (!this.productService.hasInventory(product, line.quantity)) {
          unavailableItems.push(
            `${line.productVariant.product.name} (insufficient inventory)`
          );
          continue;
        }

        await this.cartService.addItem(
          ctx,
          userId,
          line.productVariant.product.id,
          line.productVariant.id,
          line.quantity
        );
      } catch (error) {
        unavailableItems.push(line.productVariant.product.name);
      }
    }

    return {
      success: unavailableItems.length === 0,
      unavailableItems,
    };
  }

  /**
   * Cancel order (if not yet shipped)
   *
   * @param ctx - Request context
   * @param orderId - Order ID
   * @returns Success status
   */
  async cancelOrder(ctx: RequestContext, orderId: ID): Promise<boolean> {
    const order = await this.getOrderById(ctx, orderId);

    if (!order) {
      return false;
    }

    const customFields = (order as any).customFields || {};
    const fulfillmentStatus = customFields.fulfillmentStatus;

    // Can only cancel if not yet shipped
    if (
      fulfillmentStatus === FulfillmentStatus.SHIPPED ||
      fulfillmentStatus === FulfillmentStatus.FULFILLED
    ) {
      throw new Error('Cannot cancel order that has already shipped');
    }

    // Release inventory
    for (const line of order.lines) {
      await this.productService.releaseInventory(
        ctx,
        line.productVariant.product.id,
        line.quantity
      );
    }

    // Update order status
    order.state = 'Cancelled';
    (order as any).customFields = {
      ...customFields,
      fulfillmentStatus: FulfillmentStatus.CANCELLED,
    };

    await this.connection.getRepository(ctx, Order).save(order);

    return true;
  }

  /**
   * Get order by ID with all relations
   *
   * @private
   */
  private async getOrderById(ctx: RequestContext, orderId: ID): Promise<Order> {
    const order = await this.connection
      .getRepository(ctx, Order)
      .findOne({
        where: { id: orderId as string },
        relations: [
          'lines',
          'lines.productVariant',
          'lines.productVariant.product',
          'lines.productVariant.product.featuredAsset',
        ],
      });

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  /**
   * Rollback inventory reservations (in case of error)
   *
   * @private
   */
  private async rollbackInventoryReservations(
    ctx: RequestContext,
    items: any[],
    stopAtProductId: ID
  ): Promise<void> {
    for (const item of items) {
      if (item.productId === stopAtProductId) {
        break;
      }

      await this.productService.releaseInventory(
        ctx,
        item.productId,
        item.quantity
      );
    }
  }

  /**
   * Transform Order to OrderSummary
   *
   * @private
   */
  private transformOrderToSummary(order: Order): OrderSummary {
    const customFields = (order as any).customFields || {};

    let vendorOrders: VendorOrderSplit[] = [];
    try {
      vendorOrders = JSON.parse(customFields.vendorOrders || '[]');
    } catch (e) {
      vendorOrders = [];
    }

    return {
      id: order.id,
      orderNumber: order.code,
      spaOrganizationId: customFields.spaOrganizationId || '',
      placedByUserId: customFields.placedByUserId || '',
      placedAt: customFields.placedAt ? new Date(customFields.placedAt) : order.updatedAt,
      fulfillmentStatus: customFields.fulfillmentStatus || FulfillmentStatus.PENDING,
      paymentStatus: customFields.paymentStatus || PaymentStatus.PENDING,
      total: (order as any).total || 0,
      itemCount: order.lines?.reduce((sum, line) => sum + line.quantity, 0) || 0,
      vendorCount: vendorOrders.length,
      vendorOrders,
    };
  }

  /**
   * Transform Order to OrderDetail
   *
   * @private
   */
  private transformOrderToDetail(order: Order): OrderDetail {
    const summary = this.transformOrderToSummary(order);
    const customFields = (order as any).customFields || {};

    let shippingAddress: ShippingAddress;
    let billingAddress: ShippingAddress;

    try {
      shippingAddress = JSON.parse(customFields.shippingAddress || '{}');
      billingAddress = JSON.parse(customFields.billingAddress || '{}');
    } catch (e) {
      shippingAddress = {} as ShippingAddress;
      billingAddress = {} as ShippingAddress;
    }

    return {
      ...summary,
      lines: order.lines || [],
      shippingAddress,
      billingAddress,
      subtotal: (order as any).subTotal || 0,
      tax: 0, // TODO: Calculate tax
      shipping: 0, // TODO: Sum vendor shipping costs
      discount: customFields.discountAmount || 0,
      notes: customFields.notes,
      fulfilledAt: customFields.fulfilledAt
        ? new Date(customFields.fulfilledAt)
        : undefined,
    };
  }
}
