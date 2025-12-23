/**
 * Toast notification hook and context
 * Task: T092 - Add toast notifications
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ToastContainer, type ToastData } from '../components/Toast/ToastContainer';
import type { ToastType } from '../components/Toast/Toast';

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  dismissToast: (id: string) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export function ToastProvider({ children, position = 'top-right', maxToasts = 5 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info', duration: number = 5000) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastData = { id, message, type, duration };

      setToasts(prev => {
        const updated = [...prev, newToast];
        // Limit number of toasts
        return updated.slice(-maxToasts);
      });
    },
    [maxToasts]
  );

  const showSuccess = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'success', duration);
    },
    [showToast]
  );

  const showError = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'error', duration);
    },
    [showToast]
  );

  const showWarning = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'warning', duration);
    },
    [showToast]
  );

  const showInfo = useCallback(
    (message: string, duration?: number) => {
      showToast(message, 'info', duration);
    },
    [showToast]
  );

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  const value: ToastContextValue = {
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    dismissToast,
    dismissAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onClose={dismissToast} position={position} />
    </ToastContext.Provider>
  );
}

/**
 * Hook to access toast notifications
 */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
}

/**
 * Standalone hook for toast without context (alternative approach)
 */
export function useToastState() {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastData = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return {
    toasts,
    showToast,
    showSuccess: (msg: string, dur?: number) => showToast(msg, 'success', dur),
    showError: (msg: string, dur?: number) => showToast(msg, 'error', dur),
    showWarning: (msg: string, dur?: number) => showToast(msg, 'warning', dur),
    showInfo: (msg: string, dur?: number) => showToast(msg, 'info', dur),
    dismissToast,
  };
}

/**
 * Hook for cart operations with toast notifications
 */
export function useCartWithToast() {
  const toast = useToast();

  return {
    onAddSuccess: (productName: string) => {
      toast.showSuccess(`${productName} added to cart`);
    },
    onAddError: (error: string) => {
      toast.showError(`Failed to add to cart: ${error}`);
    },
    onUpdateSuccess: () => {
      toast.showSuccess('Cart updated');
    },
    onUpdateError: (error: string) => {
      toast.showError(`Failed to update cart: ${error}`);
    },
    onRemoveSuccess: () => {
      toast.showInfo('Item removed from cart');
    },
    onRemoveError: (error: string) => {
      toast.showError(`Failed to remove item: ${error}`);
    },
    onClearSuccess: () => {
      toast.showInfo('Cart cleared');
    },
    onPromoSuccess: (code: string) => {
      toast.showSuccess(`Promo code "${code}" applied`);
    },
    onPromoError: () => {
      toast.showError('Invalid or expired promo code');
    },
  };
}

/**
 * Hook for checkout operations with toast notifications
 */
export function useCheckoutWithToast() {
  const toast = useToast();

  return {
    onCheckoutSuccess: (orderNumber: string) => {
      toast.showSuccess(`Order ${orderNumber} placed successfully!`, 7000);
    },
    onCheckoutError: (error: string) => {
      toast.showError(`Checkout failed: ${error}`, 7000);
    },
    onPaymentProcessing: () => {
      toast.showInfo('Processing payment...', 3000);
    },
    onAddressUpdated: () => {
      toast.showSuccess('Address updated');
    },
    onPaymentMethodAdded: () => {
      toast.showSuccess('Payment method added');
    },
  };
}

/**
 * Hook for order operations with toast notifications
 */
export function useOrderWithToast() {
  const toast = useToast();

  return {
    onCancelSuccess: () => {
      toast.showSuccess('Order cancelled successfully');
    },
    onCancelError: (error: string) => {
      toast.showError(`Failed to cancel order: ${error}`);
    },
    onReorderSuccess: () => {
      toast.showSuccess('Items added to cart from previous order');
    },
    onReorderPartialSuccess: (unavailableCount: number) => {
      toast.showWarning(
        `${unavailableCount} item(s) from your previous order are no longer available`,
        7000
      );
    },
    onReturnRequested: () => {
      toast.showSuccess('Return request submitted. We will contact you shortly.', 7000);
    },
  };
}

/**
 * Hook for generic operation feedback
 */
export function useOperationToast() {
  const toast = useToast();

  return {
    onSuccess: (message: string = 'Operation completed successfully') => {
      toast.showSuccess(message);
    },
    onError: (message: string = 'Operation failed') => {
      toast.showError(message);
    },
    onInfo: (message: string) => {
      toast.showInfo(message);
    },
    onWarning: (message: string) => {
      toast.showWarning(message);
    },
  };
}
