/**
 * Cart Resolvers for JADE Spa Marketplace
 *
 * Task: T073 - Implement cart mutations
 *
 * Handles shopping cart operations:
 * - Get active cart
 * - Add to cart
 * - Update cart item
 * - Remove from cart
 * - Clear cart
 * - Validate cart
 */

import { Args, Mutation, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Ctx, RequestContext, Allow, Permission } from '@vendure/core';
import { CartService } from '../services/cart.service';

/**
 * Cart Resolver
 */
@Resolver('Cart')
export class CartResolver {
  constructor(private cartService: CartService) {}

  /**
   * Get active shopping cart
   *
   * @example
   * query {
   *   myCart {
   *     orderId
   *     items {
   *       id
   *       productName
   *       quantity
   *       unitPrice
   *       lineTotal
   *       appliedTier { minQuantity discountPercentage }
   *     }
   *     vendorCarts {
   *       vendorId
   *       vendorName
   *       subtotal
   *     }
   *     totalItems
   *     subtotal
   *     total
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Authenticated)
  async myCart(@Ctx() ctx: RequestContext) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.cartService.getActiveCart(ctx, userId);
  }

  /**
   * Get cart grouped by vendor
   *
   * @example
   * query {
   *   myCartByVendor {
   *     vendorId
   *     vendorName
   *     items {
   *       productName
   *       quantity
   *       lineTotal
   *     }
   *     subtotal
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Authenticated)
  async myCartByVendor(@Ctx() ctx: RequestContext) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.cartService.getVendorCarts(ctx, userId);
  }

  /**
   * Validate cart before checkout
   *
   * @example
   * query {
   *   validateCart {
   *     valid
   *     errors
   *   }
   * }
   */
  @Query()
  @Allow(Permission.Authenticated)
  async validateCart(@Ctx() ctx: RequestContext) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.cartService.validateCart(ctx, userId);
  }

  /**
   * Add item to cart
   *
   * @example
   * mutation {
   *   addToCart(productId: "1", variantId: "1", quantity: 12) {
   *     cart {
   *       totalItems
   *       total
   *     }
   *     item {
   *       productName
   *       quantity
   *       unitPrice
   *       appliedTier { discountPercentage }
   *     }
   *     isNew
   *   }
   * }
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async addToCart(
    @Ctx() ctx: RequestContext,
    @Args('productId') productId: string,
    @Args('variantId') variantId: string,
    @Args('quantity') quantity: number
  ) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.cartService.addItem(ctx, userId, productId, variantId, quantity);
  }

  /**
   * Update cart item quantity
   *
   * @example
   * mutation {
   *   updateCartItem(lineId: "123", quantity: 24) {
   *     totalItems
   *     total
   *     items {
   *       id
   *       quantity
   *       unitPrice
   *       appliedTier { discountPercentage }
   *     }
   *   }
   * }
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async updateCartItem(
    @Ctx() ctx: RequestContext,
    @Args('lineId') lineId: string,
    @Args('quantity') quantity: number
  ) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.cartService.updateItemQuantity(ctx, userId, lineId, quantity);
  }

  /**
   * Remove item from cart
   *
   * @example
   * mutation {
   *   removeFromCart(lineId: "123") {
   *     totalItems
   *     total
   *   }
   * }
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async removeFromCart(
    @Ctx() ctx: RequestContext,
    @Args('lineId') lineId: string
  ) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.cartService.removeItem(ctx, userId, lineId);
  }

  /**
   * Clear entire cart
   *
   * @example
   * mutation {
   *   clearCart {
   *     totalItems
   *   }
   * }
   */
  @Mutation()
  @Allow(Permission.Authenticated)
  async clearCart(@Ctx() ctx: RequestContext) {
    const userId = ctx.activeUserId;
    if (!userId) {
      throw new Error('User not authenticated');
    }

    return this.cartService.clearCart(ctx, userId);
  }

  // Field resolvers
  @ResolveField()
  async orderId(@Parent() cart: any) {
    return cart.orderId;
  }

  @ResolveField()
  async items(@Parent() cart: any) {
    return cart.items;
  }

  @ResolveField()
  async vendorCarts(@Parent() cart: any) {
    return cart.vendorCarts;
  }

  @ResolveField()
  async totalItems(@Parent() cart: any) {
    return cart.totalItems;
  }

  @ResolveField()
  async subtotal(@Parent() cart: any) {
    return cart.subtotal;
  }

  @ResolveField()
  async tax(@Parent() cart: any) {
    return cart.tax;
  }

  @ResolveField()
  async shipping(@Parent() cart: any) {
    return cart.shipping;
  }

  @ResolveField()
  async totalDiscount(@Parent() cart: any) {
    return cart.totalDiscount;
  }

  @ResolveField()
  async total(@Parent() cart: any) {
    return cart.total;
  }

  @ResolveField()
  async updatedAt(@Parent() cart: any) {
    return cart.updatedAt;
  }
}

/**
 * CartItem Resolver
 */
@Resolver('CartItem')
export class CartItemResolver {
  @ResolveField()
  async id(@Parent() item: any) {
    return item.id;
  }

  @ResolveField()
  async productId(@Parent() item: any) {
    return item.productId;
  }

  @ResolveField()
  async variantId(@Parent() item: any) {
    return item.variantId;
  }

  @ResolveField()
  async productName(@Parent() item: any) {
    return item.productName;
  }

  @ResolveField()
  async vendorId(@Parent() item: any) {
    return item.vendorId;
  }

  @ResolveField()
  async quantity(@Parent() item: any) {
    return item.quantity;
  }

  @ResolveField()
  async unitPrice(@Parent() item: any) {
    return item.unitPrice;
  }

  @ResolveField()
  async appliedTier(@Parent() item: any) {
    return item.appliedTier;
  }

  @ResolveField()
  async lineTotal(@Parent() item: any) {
    return item.lineTotal;
  }

  @ResolveField()
  async featuredAssetUrl(@Parent() item: any) {
    return item.featuredAssetUrl;
  }
}

/**
 * VendorCart Resolver
 */
@Resolver('VendorCart')
export class VendorCartResolver {
  @ResolveField()
  async vendorId(@Parent() vendorCart: any) {
    return vendorCart.vendorId;
  }

  @ResolveField()
  async vendorName(@Parent() vendorCart: any) {
    return vendorCart.vendorName;
  }

  @ResolveField()
  async items(@Parent() vendorCart: any) {
    return vendorCart.items;
  }

  @ResolveField()
  async subtotal(@Parent() vendorCart: any) {
    return vendorCart.subtotal;
  }
}

/**
 * AddToCartResult Resolver
 */
@Resolver('AddToCartResult')
export class AddToCartResultResolver {
  @ResolveField()
  async cart(@Parent() result: any) {
    return result.cart;
  }

  @ResolveField()
  async item(@Parent() result: any) {
    return result.item;
  }

  @ResolveField()
  async isNew(@Parent() result: any) {
    return result.isNew;
  }
}

/**
 * CartValidation Resolver
 */
@Resolver('CartValidation')
export class CartValidationResolver {
  @ResolveField()
  async valid(@Parent() validation: any) {
    return validation.valid;
  }

  @ResolveField()
  async errors(@Parent() validation: any) {
    return validation.errors;
  }
}
