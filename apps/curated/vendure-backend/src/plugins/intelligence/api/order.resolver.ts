/**
 * Order Resolvers for JADE Spa Marketplace
 *
 * Tasks: T074, T075
 * - T074: Implement checkout mutation
 * - T075: Implement myOrders query and reorder mutation
 *
 * Handles order operations:
 * - Checkout (create order)
 * - Get orders
 * - Reorder
 * - Cancel order
 * - Update fulfillment
 */

import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow, Permission } from '@vendure/core';
import { OrderService } from '../services/order.service';

/**
 * Checkout input
 */
export interface CheckoutInput {
  shippingAddress: AddressInput;
  billingAddress?: AddressInput;
  payment: PaymentInput;
  notes?: string;
  discountCode?: string;
}

/**
 * Address input
 */
export interface AddressInput {
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
 * Payment input
 */
export interface PaymentInput {
  method: 'credit_card' | 'net_30' | 'wire_transfer';
  cardLast4?: string;
  cardBrand?: string;
  transactionId?: string;
}

/**
 * Pagination input
 */
export interface PaginationInput {
  skip?: number;
  take?: number;
}

/**
 * Order Resolver
 */
@Resolver('OrderSummary')
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  /**
   * Get my orders
   *
   * Task: T075 - Implement myOrders query
   *
   * @example
   * query {
   *   myOrders(pagination: { skip: 0, take: 10 }) {
   *     items {
   *       id
   *       orderNumber
   *       placedAt
   *       fulfillmentStatus
   *       paymentStatus
   *       total
   *       itemCount
   *       vendorCount
   *       vendorOrders {
   *         vendorId
   *         subtotal
   *         fulfillmentStatus
   *         trackingNumber
   *       }
   *     }
   *     totalCount
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Authenticated)
  async myOrders(
    @Ctx() ctx: RequestContext,
    @Args('pagination') pagination?: PaginationInput
  ) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const result = await this.orderService.getOrdersByUser(ctx, userId, {
      skip: pagination?.skip,
      take: pagination?.take,
    });

    return {
      items: result.items,
      totalCount: result.total,
    };
  }

  /**
   * Get order by ID
   *
   * @example
   * query {
   *   order(id: "123") {
   *     id
   *     orderNumber
   *     lines {
   *       id
   *       productVariant { name }
   *       quantity
   *       unitPrice
   *     }
   *     shippingAddress { street city state }
   *     subtotal
   *     shipping
   *     tax
   *     total
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Authenticated)
  async order(
    @Ctx() ctx: RequestContext,
    @Args('id') id: string
  ) {
    return this.orderService.getOrder(ctx, id);
  }

  /**
   * Get orders for spa organization
   *
   * @example
   * query {
   *   ordersBySpa(spaOrganizationId: "spa-123", pagination: { take: 20 }) {
   *     items {
   *       id
   *       orderNumber
   *       placedByUserId
   *       total
   *     }
   *     totalCount
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Authenticated)
  async ordersBySpa(
    @Ctx() ctx: RequestContext,
    @Args('spaOrganizationId') spaOrganizationId: string,
    @Args('pagination') pagination?: PaginationInput
  ) {
    const result = await this.orderService.getOrdersBySpa(
      ctx,
      spaOrganizationId,
      {
        skip: pagination?.skip,
        take: pagination?.take,
      }
    );

    return {
      items: result.items,
      totalCount: result.total,
    };
  }

  /**
   * Get orders for vendor (vendor portal)
   *
   * @example
   * query {
   *   ordersByVendor(vendorId: "vendor-123", pagination: { take: 20 }) {
   *     items {
   *       id
   *       orderNumber
   *       vendorOrders {
   *         fulfillmentStatus
   *         subtotal
   *         trackingNumber
   *       }
   *     }
   *     totalCount
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Authenticated)
  async ordersByVendor(
    @Ctx() ctx: RequestContext,
    @Args('vendorId') vendorId: string,
    @Args('pagination') pagination?: PaginationInput
  ) {
    const result = await this.orderService.getOrdersByVendor(
      ctx,
      vendorId,
      {
        skip: pagination?.skip,
        take: pagination?.take,
      }
    );

    return {
      items: result.items,
      totalCount: result.total,
    };
  }

  /**
   * Checkout - create order from cart
   *
   * Task: T074 - Implement checkout mutation
   *
   * @example
   * mutation {
   *   checkout(
   *     spaOrganizationId: "spa-123"
   *     input: {
   *       shippingAddress: {
   *         firstName: "Jane"
   *         lastName: "Doe"
   *         street: "123 Main St"
   *         city: "Austin"
   *         state: "TX"
   *         zipCode: "78701"
   *         country: "US"
   *         phone: "+15125551234"
   *       }
   *       payment: {
   *         method: CREDIT_CARD
   *         cardLast4: "4242"
   *         cardBrand: "Visa"
   *         transactionId: "txn_123"
   *       }
   *       notes: "Please leave at front desk"
   *     }
   *   ) {
   *     id
   *     orderNumber
   *     total
   *     vendorOrders {
   *       vendorId
   *       subtotal
   *       shippingCost
   *       vendorTotal
   *     }
   *   }
   * }
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async checkout(
    @Ctx() ctx: RequestContext,
    @Args('spaOrganizationId') spaOrganizationId: string,
    @Args('input') input: CheckoutInput
  ) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.orderService.createOrder(ctx, userId, spaOrganizationId, input);
  }

  /**
   * Reorder from previous order
   *
   * Task: T075 - Implement reorder mutation
   *
   * @example
   * mutation {
   *   reorder(orderId: "123") {
   *     success
   *     unavailableItems
   *     cart {
   *       totalItems
   *       total
   *     }
   *   }
   * }
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async reorder(
    @Ctx() ctx: RequestContext,
    @Args('orderId') orderId: string
  ) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const result = await this.orderService.reorder(ctx, userId, orderId);

    return {
      success: result.success,
      unavailableItems: result.unavailableItems,
      cart: result.success ? await this.orderService['cartService'].getActiveCart(ctx, userId) : null,
    };
  }

  /**
   * Cancel order
   *
   * @example
   * mutation {
   *   cancelOrder(orderId: "123")
   * }
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async cancelOrder(
    @Ctx() ctx: RequestContext,
    @Args('orderId') orderId: string
  ) {
    return this.orderService.cancelOrder(ctx, orderId);
  }

  /**
   * Update vendor fulfillment status (vendor only)
   *
   * @example
   * mutation {
   *   updateFulfillment(
   *     orderId: "123"
   *     vendorId: "vendor-456"
   *     status: SHIPPED
   *     trackingNumber: "1Z999AA10123456784"
   *   ) {
   *     id
   *     fulfillmentStatus
   *     vendorOrders {
   *       vendorId
   *       fulfillmentStatus
   *       trackingNumber
   *     }
   *   }
   * }
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async updateFulfillment(
    @Ctx() ctx: RequestContext,
    @Args('orderId') orderId: string,
    @Args('vendorId') vendorId: string,
    @Args('status') status: string,
    @Args('trackingNumber') trackingNumber?: string
  ) {
    return this.orderService.updateFulfillmentStatus(
      ctx,
      orderId,
      vendorId,
      status as any,
      trackingNumber
    );
  }

  // Field resolvers for OrderSummary
  @ResolveField()
  async id(@Parent() order: any) {
    return order.id;
  }

  @ResolveField()
  async orderNumber(@Parent() order: any) {
    return order.orderNumber;
  }

  @ResolveField()
  async spaOrganizationId(@Parent() order: any) {
    return order.spaOrganizationId;
  }

  @ResolveField()
  async placedByUserId(@Parent() order: any) {
    return order.placedByUserId;
  }

  @ResolveField()
  async placedAt(@Parent() order: any) {
    return order.placedAt;
  }

  @ResolveField()
  async fulfillmentStatus(@Parent() order: any) {
    return order.fulfillmentStatus;
  }

  @ResolveField()
  async paymentStatus(@Parent() order: any) {
    return order.paymentStatus;
  }

  @ResolveField()
  async total(@Parent() order: any) {
    return order.total;
  }

  @ResolveField()
  async itemCount(@Parent() order: any) {
    return order.itemCount;
  }

  @ResolveField()
  async vendorCount(@Parent() order: any) {
    return order.vendorCount;
  }

  @ResolveField()
  async vendorOrders(@Parent() order: any) {
    return order.vendorOrders;
  }
}

/**
 * OrderDetail Resolver
 */
@Resolver('OrderDetail')
export class OrderDetailResolver {
  @ResolveField()
  async lines(@Parent() order: any) {
    return order.lines;
  }

  @ResolveField()
  async shippingAddress(@Parent() order: any) {
    return order.shippingAddress;
  }

  @ResolveField()
  async billingAddress(@Parent() order: any) {
    return order.billingAddress;
  }

  @ResolveField()
  async subtotal(@Parent() order: any) {
    return order.subtotal;
  }

  @ResolveField()
  async tax(@Parent() order: any) {
    return order.tax;
  }

  @ResolveField()
  async shipping(@Parent() order: any) {
    return order.shipping;
  }

  @ResolveField()
  async discount(@Parent() order: any) {
    return order.discount;
  }

  @ResolveField()
  async notes(@Parent() order: any) {
    return order.notes;
  }

  @ResolveField()
  async fulfilledAt(@Parent() order: any) {
    return order.fulfilledAt;
  }
}

/**
 * VendorOrderSplit Resolver
 */
@Resolver('VendorOrderSplit')
export class VendorOrderSplitResolver {
  @ResolveField()
  async vendorId(@Parent() split: any) {
    return split.vendorId;
  }

  @ResolveField()
  async orderLineIds(@Parent() split: any) {
    return split.orderLineIds;
  }

  @ResolveField()
  async subtotal(@Parent() split: any) {
    return split.subtotal;
  }

  @ResolveField()
  async shippingCost(@Parent() split: any) {
    return split.shippingCost;
  }

  @ResolveField()
  async vendorTotal(@Parent() split: any) {
    return split.vendorTotal;
  }

  @ResolveField()
  async fulfillmentStatus(@Parent() split: any) {
    return split.fulfillmentStatus;
  }

  @ResolveField()
  async trackingNumber(@Parent() split: any) {
    return split.trackingNumber;
  }

  @ResolveField()
  async estimatedDelivery(@Parent() split: any) {
    return split.estimatedDelivery;
  }

  @ResolveField()
  async shippedAt(@Parent() split: any) {
    return split.shippedAt;
  }
}

/**
 * ReorderResult Resolver
 */
@Resolver('ReorderResult')
export class ReorderResultResolver {
  @ResolveField()
  async success(@Parent() result: any) {
    return result.success;
  }

  @ResolveField()
  async unavailableItems(@Parent() result: any) {
    return result.unavailableItems;
  }

  @ResolveField()
  async cart(@Parent() result: any) {
    return result.cart;
  }
}

/**
 * OrderConnection Resolver
 */
@Resolver('OrderConnection')
export class OrderConnectionResolver {
  @ResolveField()
  async items(@Parent() connection: any) {
    return connection.items;
  }

  @ResolveField()
  async totalCount(@Parent() connection: any) {
    return connection.totalCount;
  }
}
