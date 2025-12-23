/**
 * Custom hooks for checkout operations
 * Task: T088 - Create custom hooks for cart/checkout
 */

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import {
  CHECKOUT,
  UPDATE_SHIPPING_ADDRESS,
  UPDATE_BILLING_ADDRESS,
  ADD_PAYMENT_METHOD,
  PROCESS_PAYMENT,
  CANCEL_ORDER,
  REORDER,
  REQUEST_RETURN,
  TRACK_ORDER,
} from '../graphql/mutations/checkout.graphql';
import { MY_CART } from '../graphql/queries/marketplace-cart.graphql';

export interface Address {
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

export interface CheckoutInput {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethodId: string;
  notes?: string;
}

export type CheckoutStep = 'shipping' | 'payment' | 'review';

/**
 * Hook for managing checkout process
 */
export function useCheckout(spaOrganizationId: string) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null);
  const [billingAddress, setBillingAddress] = useState<Address | null>(null);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>(null);
  const [useSameAddress, setUseSameAddress] = useState(true);

  const [checkoutMutation, { loading: processing }] = useMutation(CHECKOUT, {
    refetchQueries: [{ query: MY_CART }],
  });

  const [updateShippingMutation] = useMutation(UPDATE_SHIPPING_ADDRESS);
  const [updateBillingMutation] = useMutation(UPDATE_BILLING_ADDRESS);
  const [addPaymentMethodMutation] = useMutation(ADD_PAYMENT_METHOD);
  const [processPaymentMutation] = useMutation(PROCESS_PAYMENT);

  // Navigate between steps
  const goToStep = useCallback((step: CheckoutStep) => {
    setCurrentStep(step);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('review');
    }
  }, [currentStep]);

  const previousStep = useCallback(() => {
    if (currentStep === 'review') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    }
  }, [currentStep]);

  // Update shipping address
  const updateShipping = useCallback(
    async (address: Address) => {
      setShippingAddress(address);

      if (useSameAddress) {
        setBillingAddress(address);
      }

      try {
        await updateShippingMutation({
          variables: { input: address },
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [updateShippingMutation, useSameAddress]
  );

  // Update billing address
  const updateBilling = useCallback(
    async (address: Address) => {
      setBillingAddress(address);

      try {
        await updateBillingMutation({
          variables: { input: address },
        });
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    [updateBillingMutation]
  );

  // Add payment method
  const addPaymentMethod = useCallback(
    async (paymentInput: any) => {
      try {
        const result = await addPaymentMethodMutation({
          variables: { input: paymentInput },
        });

        if (result.data?.addPaymentMethod?.success) {
          setPaymentMethodId(result.data.addPaymentMethod.paymentMethodId);
          return { success: true, paymentMethodId: result.data.addPaymentMethod.paymentMethodId };
        } else {
          return {
            success: false,
            errors: result.data?.addPaymentMethod?.errors || [{ message: 'Failed to add payment method' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [addPaymentMethodMutation]
  );

  // Complete checkout
  const completeCheckout = useCallback(
    async (notes?: string) => {
      if (!shippingAddress || !billingAddress || !paymentMethodId) {
        return {
          success: false,
          errors: [{ message: 'Please complete all checkout steps' }],
        };
      }

      try {
        const result = await checkoutMutation({
          variables: {
            spaOrganizationId,
            input: {
              shippingAddress,
              billingAddress,
              paymentMethodId,
              notes,
            },
          },
        });

        if (result.data?.checkout?.success) {
          const orderId = result.data.checkout.order.id;
          navigate(`/marketplace/orders/${orderId}?success=true`);
          return { success: true, order: result.data.checkout.order };
        } else {
          return {
            success: false,
            errors: result.data?.checkout?.errors || [{ message: 'Checkout failed' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [shippingAddress, billingAddress, paymentMethodId, checkoutMutation, spaOrganizationId, navigate]
  );

  // Validate current step
  const canProceed = useCallback(() => {
    if (currentStep === 'shipping') {
      return !!shippingAddress;
    } else if (currentStep === 'payment') {
      return !!paymentMethodId && !!billingAddress;
    } else if (currentStep === 'review') {
      return !!shippingAddress && !!billingAddress && !!paymentMethodId;
    }
    return false;
  }, [currentStep, shippingAddress, billingAddress, paymentMethodId]);

  return {
    currentStep,
    shippingAddress,
    billingAddress,
    paymentMethodId,
    useSameAddress,
    setUseSameAddress,
    goToStep,
    nextStep,
    previousStep,
    updateShipping,
    updateBilling,
    addPaymentMethod,
    completeCheckout,
    canProceed,
    processing,
  };
}

/**
 * Hook for canceling an order
 */
export function useCancelOrder() {
  const [cancelOrderMutation, { loading }] = useMutation(CANCEL_ORDER);

  const cancelOrder = useCallback(
    async (orderId: string, reason?: string) => {
      try {
        const result = await cancelOrderMutation({
          variables: { orderId, reason },
        });

        if (result.data?.cancelOrder?.success) {
          return { success: true, order: result.data.cancelOrder.order };
        } else {
          return {
            success: false,
            errors: result.data?.cancelOrder?.errors || [{ message: 'Failed to cancel order' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [cancelOrderMutation]
  );

  return { cancelOrder, loading };
}

/**
 * Hook for reordering a previous order
 */
export function useReorder() {
  const navigate = useNavigate();
  const [reorderMutation, { loading }] = useMutation(REORDER, {
    refetchQueries: [{ query: MY_CART }],
  });

  const reorder = useCallback(
    async (orderId: string) => {
      try {
        const result = await reorderMutation({
          variables: { orderId },
        });

        if (result.data?.reorder?.success) {
          navigate('/marketplace/cart');
          return {
            success: true,
            cart: result.data.reorder.cart,
            unavailableItems: result.data.reorder.unavailableItems || [],
          };
        } else {
          return {
            success: false,
            errors: result.data?.reorder?.errors || [{ message: 'Failed to reorder' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [reorderMutation, navigate]
  );

  return { reorder, loading };
}

/**
 * Hook for requesting a return
 */
export function useReturnRequest() {
  const [requestReturnMutation, { loading }] = useMutation(REQUEST_RETURN);

  const requestReturn = useCallback(
    async (orderId: string, lineIds: string[], reason: string) => {
      try {
        const result = await requestReturnMutation({
          variables: { orderId, lineIds, reason },
        });

        if (result.data?.requestReturn?.success) {
          return {
            success: true,
            returnRequestId: result.data.requestReturn.returnRequestId,
          };
        } else {
          return {
            success: false,
            errors: result.data?.requestReturn?.errors || [{ message: 'Failed to request return' }],
          };
        }
      } catch (err: any) {
        return { success: false, errors: [{ message: err.message }] };
      }
    },
    [requestReturnMutation]
  );

  return { requestReturn, loading };
}

/**
 * Hook for tracking order status
 */
export function useOrderTracking(orderId: string) {
  const { data, loading, error, refetch } = useQuery(TRACK_ORDER, {
    variables: { orderId },
    skip: !orderId,
    pollInterval: 30000, // Poll every 30 seconds for updates
  });

  const order = data?.trackOrder?.order;

  return {
    order,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for validating address input
 */
export function useAddressValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAddress = useCallback((address: Partial<Address>): boolean => {
    const newErrors: Record<string, string> = {};

    if (!address.firstName?.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!address.lastName?.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!address.street?.trim()) {
      newErrors.street = 'Street address is required';
    }

    if (!address.city?.trim()) {
      newErrors.city = 'City is required';
    }

    if (!address.state?.trim()) {
      newErrors.state = 'State is required';
    }

    if (!address.zipCode?.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5}(-\d{4})?$/.test(address.zipCode)) {
      newErrors.zipCode = 'Invalid ZIP code format';
    }

    if (!address.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[1-9]\d{1,14}$/.test(address.phone.replace(/[\s()-]/g, ''))) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validateAddress,
    clearErrors,
  };
}
