/**
 * Optimistic UI update utilities
 * Task: T091 - Implement optimistic UI updates
 */

/**
 * Generate optimistic response for adding to cart
 */
export function optimisticAddToCart(
  currentCart: any,
  productId: string,
  productName: string,
  variantId: string,
  variantName: string,
  quantity: number,
  unitPrice: number,
  pricingTiers: any[]
) {
  // Find applicable tier
  const applicableTier = findApplicableTier(pricingTiers, quantity);

  const newItem = {
    __typename: 'CartItem',
    id: `temp-${Date.now()}`, // Temporary ID
    productId,
    productName,
    variantId,
    variantName,
    quantity,
    unitPrice: applicableTier.unitPrice,
    appliedTier: {
      __typename: 'PricingTier',
      ...applicableTier,
    },
    lineTotal: applicableTier.unitPrice * quantity,
  };

  // Check if item already exists
  const existingItemIndex = currentCart?.items?.findIndex(
    (item: any) => item.productId === productId && item.variantId === variantId
  );

  let updatedItems;
  if (existingItemIndex >= 0) {
    // Update existing item
    updatedItems = [...currentCart.items];
    const existingItem = updatedItems[existingItemIndex];
    const newQuantity = existingItem.quantity + quantity;
    const newTier = findApplicableTier(pricingTiers, newQuantity);

    updatedItems[existingItemIndex] = {
      ...existingItem,
      quantity: newQuantity,
      unitPrice: newTier.unitPrice,
      appliedTier: { __typename: 'PricingTier', ...newTier },
      lineTotal: newTier.unitPrice * newQuantity,
    };
  } else {
    // Add new item
    updatedItems = [...(currentCart?.items || []), newItem];
  }

  const subtotal = updatedItems.reduce((sum: number, item: any) => sum + item.lineTotal, 0);

  return {
    __typename: 'AddToCartResult',
    success: true,
    message: 'Adding to cart...',
    cart: {
      __typename: 'Cart',
      orderId: currentCart?.orderId || 'temp-order',
      items: updatedItems,
      vendorCarts: recalculateVendorCarts(updatedItems),
      totalItems: updatedItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
      subtotal,
      total: subtotal,
    },
    errors: [],
  };
}

/**
 * Generate optimistic response for updating cart item
 */
export function optimisticUpdateCartItem(
  currentCart: any,
  lineId: string,
  newQuantity: number,
  pricingTiers: any[]
) {
  const updatedItems = currentCart.items.map((item: any) => {
    if (item.id === lineId) {
      const newTier = findApplicableTier(pricingTiers, newQuantity);
      return {
        ...item,
        quantity: newQuantity,
        unitPrice: newTier.unitPrice,
        appliedTier: { __typename: 'PricingTier', ...newTier },
        lineTotal: newTier.unitPrice * newQuantity,
      };
    }
    return item;
  });

  const subtotal = updatedItems.reduce((sum: number, item: any) => sum + item.lineTotal, 0);

  return {
    __typename: 'UpdateCartItemResult',
    success: true,
    message: 'Updating cart...',
    cart: {
      __typename: 'Cart',
      ...currentCart,
      items: updatedItems,
      vendorCarts: recalculateVendorCarts(updatedItems),
      totalItems: updatedItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
      subtotal,
      total: subtotal,
    },
    errors: [],
  };
}

/**
 * Generate optimistic response for removing from cart
 */
export function optimisticRemoveFromCart(currentCart: any, lineId: string) {
  const updatedItems = currentCart.items.filter((item: any) => item.id !== lineId);
  const subtotal = updatedItems.reduce((sum: number, item: any) => sum + item.lineTotal, 0);

  return {
    __typename: 'RemoveFromCartResult',
    success: true,
    message: 'Removing item...',
    cart: {
      __typename: 'Cart',
      ...currentCart,
      items: updatedItems,
      vendorCarts: recalculateVendorCarts(updatedItems),
      totalItems: updatedItems.reduce((sum: number, item: any) => sum + item.quantity, 0),
      subtotal,
      total: subtotal,
    },
    errors: [],
  };
}

/**
 * Generate optimistic response for clearing cart
 */
export function optimisticClearCart() {
  return {
    __typename: 'ClearCartResult',
    success: true,
    message: 'Clearing cart...',
    errors: [],
  };
}

/**
 * Generate optimistic response for applying promo code
 */
export function optimisticApplyPromoCode(
  currentCart: any,
  promoCode: string,
  discountPercentage: number = 10 // Default estimate
) {
  const discount = Math.floor(currentCart.subtotal * (discountPercentage / 100));
  const total = currentCart.subtotal - discount;

  return {
    __typename: 'ApplyPromoCodeResult',
    success: true,
    message: 'Applying promo code...',
    cart: {
      __typename: 'Cart',
      ...currentCart,
      promoCode,
      discount,
      total,
    },
    errors: [],
  };
}

/**
 * Helper: Find applicable pricing tier
 */
function findApplicableTier(pricingTiers: any[], quantity: number): any {
  const sortedTiers = [...pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);
  return sortedTiers.find(tier => quantity >= tier.minQuantity) || pricingTiers[0];
}

/**
 * Helper: Recalculate vendor carts from items
 */
function recalculateVendorCarts(items: any[]): any[] {
  const vendorMap = new Map<string, any>();

  items.forEach(item => {
    const vendorId = item.vendorId || 'unknown';
    const vendorName = item.vendorName || 'Unknown Vendor';

    if (!vendorMap.has(vendorId)) {
      vendorMap.set(vendorId, {
        __typename: 'VendorCart',
        vendorId,
        vendorName,
        items: [],
        subtotal: 0,
      });
    }

    const vendorCart = vendorMap.get(vendorId);
    vendorCart.items.push({
      __typename: 'VendorCartItem',
      productName: item.productName,
      quantity: item.quantity,
      lineTotal: item.lineTotal,
    });
    vendorCart.subtotal += item.lineTotal;
  });

  return Array.from(vendorMap.values());
}

/**
 * Optimistic update for product inventory
 */
export function optimisticInventoryUpdate(
  product: any,
  quantityChange: number // negative for decrease
): any {
  return {
    ...product,
    inventoryLevel: Math.max(0, product.inventoryLevel + quantityChange),
  };
}

/**
 * Optimistic update for order status
 */
export function optimisticOrderStatusUpdate(order: any, newStatus: string): any {
  return {
    ...order,
    fulfillmentStatus: newStatus,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Optimistic update for search results
 */
export function optimisticSearchUpdate(
  currentResults: any[],
  filters: any
): any[] {
  // Client-side filtering as optimistic update
  let filtered = [...currentResults];

  if (filters.inStockOnly) {
    filtered = filtered.filter(item => item.inventoryLevel > 0);
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter(
      item => item.pricingTiers[0]?.unitPrice >= filters.minPrice
    );
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter(
      item => item.pricingTiers[0]?.unitPrice <= filters.maxPrice
    );
  }

  if (filters.skinTypes && filters.skinTypes.length > 0) {
    filtered = filtered.filter(item =>
      item.glance?.skinTypes?.some((type: string) =>
        filters.skinTypes.includes(type)
      )
    );
  }

  return filtered;
}

/**
 * Hook for managing optimistic updates
 */
import { useCallback } from 'react';

export function useOptimisticUpdate() {
  const createOptimisticResponse = useCallback(
    <T>(data: T, updateFn: (data: T) => T): T => {
      try {
        return updateFn(data);
      } catch (error) {
        console.error('Optimistic update failed:', error);
        return data; // Return original on error
      }
    },
    []
  );

  const withOptimisticUpdate = useCallback(
    async <T, R>(
      currentData: T,
      optimisticData: T,
      mutation: () => Promise<R>,
      onSuccess?: (result: R) => void,
      onError?: (error: any, rollback: () => void) => void
    ): Promise<R> => {
      // Store original for rollback
      const original = currentData;

      try {
        // Mutation should apply optimisticData immediately via Apollo
        const result = await mutation();
        onSuccess?.(result);
        return result;
      } catch (error) {
        // Provide rollback function
        const rollback = () => {
          // Apollo will automatically roll back on error
          console.log('Rolling back optimistic update');
        };
        onError?.(error, rollback);
        throw error;
      }
    },
    []
  );

  return {
    createOptimisticResponse,
    withOptimisticUpdate,
  };
}

/**
 * Cache update utilities for Apollo
 */
export const cacheUpdates = {
  /**
   * Update cache after adding to cart
   */
  addToCart: (cache: any, { data }: any, queryName: string) => {
    if (data?.addToCart?.success) {
      cache.writeQuery({
        query: queryName,
        data: {
          myCart: data.addToCart.cart,
        },
      });
    }
  },

  /**
   * Update cache after removing from cart
   */
  removeFromCart: (cache: any, { data }: any, lineId: string) => {
    if (data?.removeFromCart?.success) {
      cache.modify({
        fields: {
          myCart(existingCart: any) {
            return {
              ...existingCart,
              items: existingCart.items.filter((item: any) => item.id !== lineId),
            };
          },
        },
      });
    }
  },

  /**
   * Update cache after checkout
   */
  checkout: (cache: any) => {
    cache.modify({
      fields: {
        myCart() {
          return null; // Clear cart after checkout
        },
      },
    });
  },

  /**
   * Update product inventory in cache
   */
  updateInventory: (cache: any, productId: string, quantityChange: number) => {
    cache.modify({
      id: cache.identify({ __typename: 'Product', id: productId }),
      fields: {
        inventoryLevel(currentLevel: number) {
          return Math.max(0, currentLevel + quantityChange);
        },
      },
    });
  },
};
