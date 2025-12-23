/**
 * CartService for JADE Spa Marketplace
 *
 * Task: T066 - Implement CartService for shopping cart management
 *
 * Handles shopping cart operations including:
 * - Add/update/remove items
 * - Apply pricing tiers based on quantity
 * - Calculate cart totals
 * - Vendor-based cart grouping
 * - Cart persistence
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
import { ProductService } from './product.service';
import { PricingTier, getApplicableTier } from '../entities/product.entity';

/**
 * Cart item with pricing tier information
 */
export interface CartItem {
  /** Order line ID */
  id: ID;

  /** Product ID */
  productId: ID;

  /** Product variant ID */
  variantId: ID;

  /** Product name */
  productName: string;

  /** Vendor ID */
  vendorId: string;

  /** Quantity */
  quantity: number;

  /** Unit price (after tier discount) */
  unitPrice: number;

  /** Applied pricing tier */
  appliedTier: PricingTier;

  /** Line total (unitPrice * quantity) */
  lineTotal: number;

  /** Featured asset URL */
  featuredAssetUrl?: string;
}

/**
 * Cart grouped by vendor
 */
export interface VendorCart {
  /** Vendor ID */
  vendorId: string;

  /** Vendor name */
  vendorName: string;

  /** Items from this vendor */
  items: CartItem[];

  /** Subtotal for this vendor */
  subtotal: number;
}

/**
 * Complete cart with totals
 */
export interface Cart {
  /** Order ID */
  orderId: ID;

  /** All cart items */
  items: CartItem[];

  /** Items grouped by vendor */
  vendorCarts: VendorCart[];

  /** Total number of items */
  totalItems: number;

  /** Subtotal (sum of all line totals) */
  subtotal: number;

  /** Tax amount */
  tax: number;

  /** Shipping cost */
  shipping: number;

  /** Total discount from pricing tiers */
  totalDiscount: number;

  /** Grand total */
  total: number;

  /** Cart last updated timestamp */
  updatedAt: Date;
}

/**
 * Add item result
 */
export interface AddItemResult {
  /** Updated cart */
  cart: Cart;

  /** Added/updated cart item */
  item: CartItem;

  /** Whether item was newly added (true) or updated (false) */
  isNew: boolean;
}

@Injectable()
export class CartService {
  constructor(
    @Inject(TransactionalConnection) private connection: TransactionalConnection,
    @Inject(ProductService) private productService: ProductService,
    @Inject(EntityHydrator) private entityHydrator: EntityHydrator
  ) {}

  /**
   * Get or create active cart for user
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @returns Active cart or newly created cart
   */
  async getActiveCart(ctx: RequestContext, userId: ID): Promise<Cart> {
    // Find active order for user
    let order = await this.connection
      .getRepository(ctx, Order)
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.lines', 'line')
      .leftJoinAndSelect('line.productVariant', 'variant')
      .leftJoinAndSelect('variant.product', 'product')
      .leftJoinAndSelect('product.featuredAsset', 'asset')
      .where('order.customFieldsPlacedbyuserid = :userId', { userId })
      .andWhere('order.state = :state', { state: 'AddingItems' })
      .orderBy('order.updatedAt', 'DESC')
      .getOne();

    // Create new order if none exists
    if (!order) {
      order = await this.createNewCart(ctx, userId);
    }

    return this.transformOrderToCart(order);
  }

  /**
   * Add item to cart or update quantity if already exists
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @param productId - Product ID
   * @param variantId - Product variant ID
   * @param quantity - Quantity to add
   * @returns Add item result with updated cart
   */
  async addItem(
    ctx: RequestContext,
    userId: ID,
    productId: ID,
    variantId: ID,
    quantity: number
  ): Promise<AddItemResult> {
    // Validate quantity
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    // Get product to check inventory and pricing
    const product = await this.productService.getProduct(ctx, productId, false);
    if (!product) {
      throw new Error('Product not found');
    }

    // Check inventory
    if (!this.productService.hasInventory(product, quantity)) {
      throw new Error('Insufficient inventory');
    }

    // Get or create cart
    const cart = await this.getActiveCart(ctx, userId);
    const order = await this.getOrderById(ctx, cart.orderId);

    // Check if item already exists
    const existingLine = order.lines.find(
      line => line.productVariant.id === variantId
    );

    let isNew = false;
    let orderLine: OrderLine;

    if (existingLine) {
      // Update existing line
      const newQuantity = existingLine.quantity + quantity;

      // Validate new quantity against inventory
      if (!this.productService.hasInventory(product, newQuantity)) {
        throw new Error('Insufficient inventory for requested quantity');
      }

      existingLine.quantity = newQuantity;
      orderLine = await this.connection.getRepository(ctx, OrderLine).save(existingLine);
    } else {
      // Create new line
      isNew = true;
      const newLine = new OrderLine({
        productVariant: { id: variantId } as any,
        quantity,
      });

      orderLine = await this.connection.getRepository(ctx, OrderLine).save(newLine);

      // Add to order
      order.lines.push(orderLine);
      await this.connection.getRepository(ctx, Order).save(order);
    }

    // Recalculate pricing tiers for all lines
    await this.recalculatePricing(ctx, order);

    // Get updated cart
    const updatedCart = await this.getActiveCart(ctx, userId);
    const item = updatedCart.items.find(i => i.variantId === variantId)!;

    return {
      cart: updatedCart,
      item,
      isNew,
    };
  }

  /**
   * Update item quantity in cart
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @param lineId - Order line ID
   * @param quantity - New quantity (0 to remove)
   * @returns Updated cart
   */
  async updateItemQuantity(
    ctx: RequestContext,
    userId: ID,
    lineId: ID,
    quantity: number
  ): Promise<Cart> {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    // If quantity is 0, remove the item
    if (quantity === 0) {
      return this.removeItem(ctx, userId, lineId);
    }

    const cart = await this.getActiveCart(ctx, userId);
    const order = await this.getOrderById(ctx, cart.orderId);

    const line = order.lines.find(l => l.id === lineId);
    if (!line) {
      throw new Error('Cart item not found');
    }

    // Get product to check inventory
    const product = await this.productService.getProduct(
      ctx,
      line.productVariant.product.id,
      false
    );

    if (!product) {
      throw new Error('Product not found');
    }

    // Check inventory
    if (!this.productService.hasInventory(product, quantity)) {
      throw new Error('Insufficient inventory');
    }

    // Update quantity
    line.quantity = quantity;
    await this.connection.getRepository(ctx, OrderLine).save(line);

    // Recalculate pricing
    await this.recalculatePricing(ctx, order);

    return this.getActiveCart(ctx, userId);
  }

  /**
   * Remove item from cart
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @param lineId - Order line ID
   * @returns Updated cart
   */
  async removeItem(
    ctx: RequestContext,
    userId: ID,
    lineId: ID
  ): Promise<Cart> {
    const cart = await this.getActiveCart(ctx, userId);
    const order = await this.getOrderById(ctx, cart.orderId);

    const lineIndex = order.lines.findIndex(l => l.id === lineId);
    if (lineIndex === -1) {
      throw new Error('Cart item not found');
    }

    // Remove line
    const [removedLine] = order.lines.splice(lineIndex, 1);
    await this.connection.getRepository(ctx, OrderLine).remove(removedLine);

    // Save order
    await this.connection.getRepository(ctx, Order).save(order);

    // Recalculate pricing
    await this.recalculatePricing(ctx, order);

    return this.getActiveCart(ctx, userId);
  }

  /**
   * Clear entire cart
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @returns Empty cart
   */
  async clearCart(ctx: RequestContext, userId: ID): Promise<Cart> {
    const cart = await this.getActiveCart(ctx, userId);
    const order = await this.getOrderById(ctx, cart.orderId);

    // Remove all lines
    if (order.lines.length > 0) {
      await this.connection.getRepository(ctx, OrderLine).remove(order.lines);
      order.lines = [];
      await this.connection.getRepository(ctx, Order).save(order);
    }

    return this.transformOrderToCart(order);
  }

  /**
   * Get cart items grouped by vendor
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @returns Vendor-grouped carts
   */
  async getVendorCarts(ctx: RequestContext, userId: ID): Promise<VendorCart[]> {
    const cart = await this.getActiveCart(ctx, userId);
    return cart.vendorCarts;
  }

  /**
   * Validate cart before checkout
   *
   * @param ctx - Request context
   * @param userId - User ID
   * @returns Validation result with any errors
   */
  async validateCart(
    ctx: RequestContext,
    userId: ID
  ): Promise<{ valid: boolean; errors: string[] }> {
    const cart = await this.getActiveCart(ctx, userId);
    const errors: string[] = [];

    if (cart.items.length === 0) {
      errors.push('Cart is empty');
      return { valid: false, errors };
    }

    // Check inventory for each item
    for (const item of cart.items) {
      const product = await this.productService.getProduct(ctx, item.productId, false);

      if (!product) {
        errors.push(`Product ${item.productName} is no longer available`);
        continue;
      }

      if (!this.productService.hasInventory(product, item.quantity)) {
        errors.push(
          `Insufficient inventory for ${item.productName} (requested: ${item.quantity}, available: ${product.inventoryLevel})`
        );
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create a new cart (Order in AddingItems state)
   *
   * @private
   */
  private async createNewCart(ctx: RequestContext, userId: ID): Promise<Order> {
    const newOrder = new Order({
      code: `CART-${Date.now()}-${userId}`,
      state: 'AddingItems',
      customFields: {
        placedByUserId: userId,
      } as any,
    });

    return this.connection.getRepository(ctx, Order).save(newOrder);
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
   * Recalculate pricing tiers for all order lines
   *
   * @private
   */
  private async recalculatePricing(ctx: RequestContext, order: Order): Promise<void> {
    for (const line of order.lines) {
      const product = await this.productService.getProduct(
        ctx,
        line.productVariant.product.id,
        false
      );

      if (!product) {
        continue;
      }

      const pricing = this.productService.calculatePrice(product, line.quantity);

      // Update line price
      line.listPrice = pricing.unitPrice;
      line.listPriceIncludesTax = false;

      await this.connection.getRepository(ctx, OrderLine).save(line);
    }

    // Recalculate order totals
    const subtotal = order.lines.reduce(
      (sum, line) => sum + line.listPrice * line.quantity,
      0
    );

    (order as any).subTotal = subtotal;
    (order as any).total = subtotal; // Will add tax/shipping later

    await this.connection.getRepository(ctx, Order).save(order);
  }

  /**
   * Transform Vendure Order to Cart
   *
   * @private
   */
  private async transformOrderToCart(order: Order): Promise<Cart> {
    const items: CartItem[] = [];
    const vendorCartMap = new Map<string, VendorCart>();

    for (const line of order.lines || []) {
      const product = line.productVariant?.product;
      if (!product) continue;

      const customFields = (product as any).customFields || {};
      const vendorId = customFields.vendorId || 'unknown';

      const cartItem: CartItem = {
        id: line.id,
        productId: product.id,
        variantId: line.productVariant.id,
        productName: product.name,
        vendorId,
        quantity: line.quantity,
        unitPrice: line.listPrice || 0,
        appliedTier: {
          minQuantity: 1,
          unitPrice: line.listPrice || 0,
          discountPercentage: 0,
        },
        lineTotal: (line.listPrice || 0) * line.quantity,
        featuredAssetUrl: product.featuredAsset?.preview,
      };

      items.push(cartItem);

      // Group by vendor
      if (!vendorCartMap.has(vendorId)) {
        vendorCartMap.set(vendorId, {
          vendorId,
          vendorName: `Vendor ${vendorId}`, // TODO: Load vendor name
          items: [],
          subtotal: 0,
        });
      }

      const vendorCart = vendorCartMap.get(vendorId)!;
      vendorCart.items.push(cartItem);
      vendorCart.subtotal += cartItem.lineTotal;
    }

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      orderId: order.id,
      items,
      vendorCarts: Array.from(vendorCartMap.values()),
      totalItems,
      subtotal,
      tax: 0, // TODO: Calculate tax
      shipping: 0, // TODO: Calculate shipping
      totalDiscount: 0, // TODO: Calculate discount
      total: subtotal,
      updatedAt: order.updatedAt,
    };
  }
}
