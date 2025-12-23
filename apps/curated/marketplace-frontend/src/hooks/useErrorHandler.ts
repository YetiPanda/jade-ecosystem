/**
 * Error handling hooks
 * Task: T090 - Add error handling and retry logic
 */

import { useState, useCallback, useEffect } from 'react';
import { ApolloError } from '@apollo/client';
import {
  parseApolloError,
  getUserFriendlyError,
  withRetry,
  type AppError,
  type RetryConfig,
} from '../utils/errorHandling';

/**
 * Hook for managing error state
 */
export function useErrorHandler() {
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<AppError[]>([]);

  const handleError = useCallback((err: any) => {
    if (err instanceof ApolloError) {
      const appErrors = parseApolloError(err);
      setErrors(appErrors);
      setError(getUserFriendlyError(err));
    } else {
      const message = getUserFriendlyError(err);
      setError(message);
      setErrors([
        {
          type: 'UNKNOWN' as any,
          message,
          originalError: err,
          retryable: false,
        },
      ]);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setErrors([]);
  }, []);

  const hasError = error !== null;

  return {
    error,
    errors,
    hasError,
    handleError,
    clearError,
  };
}

/**
 * Hook for retry logic
 */
export function useRetry<T>(
  fn: () => Promise<T>,
  config?: Partial<RetryConfig>
) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { handleError, clearError, error } = useErrorHandler();

  const execute = useCallback(async () => {
    clearError();
    setIsRetrying(true);
    setAttemptCount(0);

    try {
      const result = await withRetry(fn, {
        ...config,
        maxAttempts: config?.maxAttempts || 3,
      });
      return result;
    } catch (err) {
      handleError(err);
      throw err;
    } finally {
      setIsRetrying(false);
    }
  }, [fn, config, handleError, clearError]);

  return {
    execute,
    isRetrying,
    attemptCount,
    error,
    clearError,
  };
}

/**
 * Hook for operation with automatic retry
 */
export function useOperationWithRetry<TData, TVariables>(
  operation: (variables: TVariables) => Promise<TData>,
  options?: {
    retryConfig?: Partial<RetryConfig>;
    onSuccess?: (data: TData) => void;
    onError?: (error: any) => void;
  }
) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);
  const { error, handleError, clearError } = useErrorHandler();

  const execute = useCallback(
    async (variables: TVariables) => {
      clearError();
      setLoading(true);

      try {
        const result = await withRetry(
          () => operation(variables),
          options?.retryConfig
        );

        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        handleError(err);
        options?.onError?.(err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [operation, options, handleError, clearError]
  );

  return {
    execute,
    loading,
    data,
    error,
    clearError,
  };
}

/**
 * Hook for handling network status
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        // Network recovered, could trigger retry of failed operations
        console.log('Network connection restored');
      }
      setWasOffline(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      console.log('Network connection lost');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [wasOffline]);

  return {
    isOnline,
    wasOffline,
  };
}

/**
 * Hook for handling GraphQL errors with field-level granularity
 */
export function useFieldErrors() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const setFieldError = useCallback((field: string, message: string) => {
    setFieldErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const handleGraphQLErrors = useCallback((errors: AppError[]) => {
    const newFieldErrors: Record<string, string> = {};

    errors.forEach(error => {
      if (error.field) {
        newFieldErrors[error.field] = error.message;
      }
    });

    setFieldErrors(newFieldErrors);
  }, []);

  const hasErrors = Object.keys(fieldErrors).length > 0;

  return {
    fieldErrors,
    hasErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    handleGraphQLErrors,
  };
}

/**
 * Hook for timeout handling
 */
export function useTimeout(callback: () => void, delay: number | null) {
  useEffect(() => {
    if (delay === null) return;

    const timer = setTimeout(callback, delay);
    return () => clearTimeout(timer);
  }, [callback, delay]);
}

/**
 * Hook for debounced error clearing
 */
export function useAutoClearError(delay: number = 5000) {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [error, delay]);

  const showError = useCallback((message: string) => {
    setError(message);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    showError,
    clearError,
  };
}
