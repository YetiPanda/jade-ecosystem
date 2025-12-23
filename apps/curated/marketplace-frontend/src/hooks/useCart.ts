/**
 * Custom hooks for cart operations
 * Task: T088 - Create custom hooks for cart/checkout
 */

import { useState, useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { MY_CART, MY_CART_BY_VENDOR, VALIDATE_CART } from '../graphql/queries/marketplace-cart.graphql';
import {
  ADD_TO_CART,
  UPDATE_CART_ITEM,
  REMOVE_FROM_CART,
  CLEAR_CART,
  APPLY_PROMO_CODE,
  REMOVE_PROMO_CODE,
} from '../graphql/mutations/cart.graphql';

/**
 * Hook for managing shopping cart
 */
export function useCart() {
  const { data, loading, error, refetch } = useQuery(MY_CART, {
    fetchPolicy: 'cache-and-network',
  });

  const [addToCartMutation, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
    refetchQueries: [{ query: MY_CART }],
  });

  const [updateCartItemMutation, { loading: updatingCart }] = useMutation(UPDATE_CART_ITEM, {
    refetchQueries: [{ query: MY_CART }],
  });

  const [removeFromCartMutation, { loading: removingFromCart }] = useMutation(REMOVE_FROM_CART, {
    refetchQueries: [{ query: MY_CART }],
  });

  const [clearCartMutation, { loading: clearingCart }] = useMutation(CLEAR_CART, {
    refetchQueries: [{ query: MY_CART }],
  });

  const [applyPromoCodeMutation, { loading: applyingPromo }] = useMutation(APPLY_PROMO_CODE, {
    refetchQueries: [{ query: MY_CART }],
  });

  const [removePromoCodeMutation, { loading: removingPromo }] = useMutation(REMOVE_PROMO_CODE, {
    refetchQueries: [{ query: MY_CART }],
  });

  const cart = data?.myCart;
  const isEmpty = !cart || cart.totalItems === 0;

  // Add item to cart
  const addToCart = useCallback(
    async (productId: string, variantId: string, quantity: number) => {
      try {
        const result = await addToCartMutation({
          variables: { productId, variantId, quantity },
        });

        if (result.data?.addToCart?.success) {
          return { success: true, cart: result.data.addToCart.cart };
        } else {
          return {
            success: false,
            errors: result.data?.addToCart?.errors || [{ message: 'Failed to add to cart' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [addToCartMutation]
  );

  // Update cart item quantity
  const updateQuantity = useCallback(
    async (lineId: string, quantity: number) => {
      try {
        const result = await updateCartItemMutation({
          variables: { lineId, quantity },
          optimisticResponse: {
            updateCartItem: {
              __typename: 'UpdateCartItemResult',
              success: true,
              message: 'Updating cart...',
              cart: {
                ...cart,
                items: cart.items.map((item: any) =>
                  item.id === lineId ? { ...item, quantity } : item
                ),
              },
              errors: [],
            },
          },
        });

        if (result.data?.updateCartItem?.success) {
          return { success: true, cart: result.data.updateCartItem.cart };
        } else {
          return {
            success: false,
            errors: result.data?.updateCartItem?.errors || [{ message: 'Failed to update cart' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [updateCartItemMutation, cart]
  );

  // Remove item from cart
  const removeItem = useCallback(
    async (lineId: string) => {
      try {
        const result = await removeFromCartMutation({
          variables: { lineId },
          optimisticResponse: {
            removeFromCart: {
              __typename: 'RemoveFromCartResult',
              success: true,
              message: 'Removing item...',
              cart: {
                ...cart,
                items: cart.items.filter((item: any) => item.id !== lineId),
              },
              errors: [],
            },
          },
        });

        if (result.data?.removeFromCart?.success) {
          return { success: true, cart: result.data.removeFromCart.cart };
        } else {
          return {
            success: false,
            errors: result.data?.removeFromCart?.errors || [{ message: 'Failed to remove item' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [removeFromCartMutation, cart]
  );

  // Clear entire cart
  const clearCart = useCallback(async () => {
    try {
      const result = await clearCartMutation();

      if (result.data?.clearCart?.success) {
        return { success: true };
      } else {
        return {
          success: false,
          errors: result.data?.clearCart?.errors || [{ message: 'Failed to clear cart' }],
        };
      }
    } catch (err: any) {
      return { success: false, errors: [{ message: err.message }] };
    }
  }, [clearCartMutation]);

  // Apply promo code
  const applyPromoCode = useCallback(
    async (code: string) => {
      try {
        const result = await applyPromoCodeMutation({
          variables: { code },
        });

        if (result.data?.applyPromoCode?.success) {
          return { success: true, cart: result.data.applyPromoCode.cart };
        } else {
          return {
            success: false,
            errors: result.data?.applyPromoCode?.errors || [{ message: 'Invalid promo code' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [applyPromoCodeMutation]
  );

  // Remove promo code
  const removePromoCode = useCallback(async () => {
    try {
      const result = await removePromoCodeMutation();

      if (result.data?.removePromoCode?.success) {
        return { success: true, cart: result.data.removePromoCode.cart };
      } else {
        return {
          success: false,
          errors: result.data?.removePromoCode?.errors || [{ message: 'Failed to remove promo code' }],
        };
      }
    } catch (err: any) {
      return { success: false, errors: [{ message: err.message }] };
    }
  }, [removePromoCodeMutation]);

  return {
    cart,
    isEmpty,
    loading,
    error,
    refetch,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
    // Loading states for individual operations
    addingToCart,
    updatingCart,
    removingFromCart,
    clearingCart,
    applyingPromo,
    removingPromo,
  };
}

/**
 * Hook for viewing cart grouped by vendor
 */
export function useCartByVendor() {
  const { data, loading, error } = useQuery(MY_CART_BY_VENDOR, {
    fetchPolicy: 'cache-and-network',
  });

  const vendorCarts = data?.myCartByVendor?.vendorCarts || [];
  const total = data?.myCartByVendor?.total || 0;

  return {
    vendorCarts,
    total,
    loading,
    error,
  };
}

/**
 * Hook for validating cart before checkout
 */
export function useCartValidation() {
  const { data, loading, error, refetch } = useQuery(VALIDATE_CART, {
    fetchPolicy: 'network-only',
  });

  const validation = data?.validateCart;
  const isValid = validation?.valid || false;
  const errors = validation?.errors || [];

  return {
    isValid,
    errors,
    loading,
    error,
    validate: refetch,
  };
}

/**
 * Hook for cart item quantity selector with validation
 */
export function useQuantitySelector(
  initialQuantity: number = 1,
  maxQuantity: number = 999,
  pricingTiers?: any[]
) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const increment = useCallback(() => {
    setQuantity(prev => Math.min(prev + 1, maxQuantity));
  }, [maxQuantity]);

  const decrement = useCallback(() => {
    setQuantity(prev => Math.max(prev - 1, 1));
  }, []);

  const setCustomQuantity = useCallback(
    (value: number) => {
      const clampedValue = Math.max(1, Math.min(value, maxQuantity));
      setQuantity(clampedValue);
    },
    [maxQuantity]
  );

  // Calculate applicable pricing tier
  const applicableTier = pricingTiers
    ? [...pricingTiers]
        .sort((a, b) => b.minQuantity - a.minQuantity)
        .find(tier => quantity >= tier.minQuantity) || pricingTiers[0]
    : null;

  // Check if quantity qualifies for next tier
  const nextTier = pricingTiers
    ? pricingTiers
        .filter(tier => tier.minQuantity > quantity)
        .sort((a, b) => a.minQuantity - b.minQuantity)[0]
    : null;

  const unitsToNextTier = nextTier ? nextTier.minQuantity - quantity : null;

  return {
    quantity,
    setQuantity: setCustomQuantity,
    increment,
    decrement,
    applicableTier,
    nextTier,
    unitsToNextTier,
  };
}
