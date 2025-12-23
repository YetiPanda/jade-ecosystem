/**
 * Error handling and retry logic utilities
 * Task: T090 - Add error handling and retry logic
 */

import { ApolloError } from '@apollo/client';

/**
 * Error types
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  UNKNOWN = 'UNKNOWN',
}

export interface AppError {
  type: ErrorType;
  message: string;
  code?: string;
  field?: string;
  originalError?: any;
  retryable: boolean;
}

/**
 * Parse Apollo GraphQL errors
 */
export function parseApolloError(error: ApolloError): AppError[] {
  const errors: AppError[] = [];

  // Network errors
  if (error.networkError) {
    errors.push({
      type: ErrorType.NETWORK,
      message: 'Network error. Please check your internet connection.',
      originalError: error.networkError,
      retryable: true,
    });
  }

  // GraphQL errors
  if (error.graphQLErrors && error.graphQLErrors.length > 0) {
    error.graphQLErrors.forEach(gqlError => {
      const extensions = gqlError.extensions || {};
      const code = extensions.code as string;

      let type = ErrorType.UNKNOWN;
      let retryable = false;

      switch (code) {
        case 'UNAUTHENTICATED':
          type = ErrorType.AUTHENTICATION;
          retryable = false;
          break;
        case 'FORBIDDEN':
          type = ErrorType.AUTHORIZATION;
          retryable = false;
          break;
        case 'BAD_USER_INPUT':
          type = ErrorType.VALIDATION;
          retryable = false;
          break;
        case 'NOT_FOUND':
          type = ErrorType.NOT_FOUND;
          retryable = false;
          break;
        case 'INTERNAL_SERVER_ERROR':
          type = ErrorType.SERVER;
          retryable = true;
          break;
        default:
          type = ErrorType.UNKNOWN;
          retryable = true;
      }

      errors.push({
        type,
        message: gqlError.message,
        code,
        originalError: gqlError,
        retryable,
      });
    });
  }

  // If no specific errors, create a generic error
  if (errors.length === 0) {
    errors.push({
      type: ErrorType.UNKNOWN,
      message: error.message || 'An unexpected error occurred',
      originalError: error,
      retryable: true,
    });
  }

  return errors;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: ErrorType[];
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableErrors: [ErrorType.NETWORK, ErrorType.SERVER, ErrorType.UNKNOWN],
};

/**
 * Exponential backoff delay
 */
function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt - 1);
  return Math.min(delay, config.maxDelay);
}

/**
 * Sleep utility
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry wrapper for async functions
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const finalConfig = { ...DEFAULT_RETRY_CONFIG, ...config };
  let lastError: any;

  for (let attempt = 1; attempt <= finalConfig.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      // Parse error to determine if retryable
      let isRetryable = false;

      if (error instanceof ApolloError) {
        const appErrors = parseApolloError(error);
        isRetryable = appErrors.some(e =>
          finalConfig.retryableErrors?.includes(e.type) && e.retryable
        );
      } else {
        // For non-Apollo errors, retry network-related errors
        isRetryable = true;
      }

      // Don't retry if not retryable or max attempts reached
      if (!isRetryable || attempt >= finalConfig.maxAttempts) {
        throw error;
      }

      // Wait before retrying
      const delay = calculateBackoffDelay(attempt, finalConfig);
      console.log(`Retry attempt ${attempt}/${finalConfig.maxAttempts} after ${delay}ms`);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Error message formatter
 */
export function formatErrorMessage(error: AppError): string {
  switch (error.type) {
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    case ErrorType.AUTHENTICATION:
      return 'You need to be logged in to perform this action.';
    case ErrorType.AUTHORIZATION:
      return 'You do not have permission to perform this action.';
    case ErrorType.VALIDATION:
      return error.field
        ? `Invalid ${error.field}: ${error.message}`
        : `Validation error: ${error.message}`;
    case ErrorType.NOT_FOUND:
      return 'The requested resource was not found.';
    case ErrorType.SERVER:
      return 'A server error occurred. Please try again later.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * User-friendly error messages
 */
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT: 'The request took too long. Please try again.',

  // Authentication errors
  UNAUTHENTICATED: 'Please log in to continue.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  INVALID_CREDENTIALS: 'Invalid email or password.',

  // Authorization errors
  FORBIDDEN: 'You do not have permission to perform this action.',

  // Validation errors
  INVALID_INPUT: 'Please check your input and try again.',
  REQUIRED_FIELD: 'This field is required.',

  // Product errors
  PRODUCT_NOT_FOUND: 'Product not found.',
  OUT_OF_STOCK: 'This product is currently out of stock.',
  INSUFFICIENT_STOCK: 'Not enough inventory available.',

  // Cart errors
  CART_EMPTY: 'Your cart is empty.',
  INVALID_QUANTITY: 'Invalid quantity.',
  CART_UPDATE_FAILED: 'Failed to update cart. Please try again.',

  // Checkout errors
  CHECKOUT_FAILED: 'Checkout failed. Please try again.',
  INVALID_ADDRESS: 'Please provide a valid address.',
  PAYMENT_FAILED: 'Payment failed. Please check your payment details.',
  INVALID_PROMO_CODE: 'Invalid or expired promo code.',

  // Order errors
  ORDER_NOT_FOUND: 'Order not found.',
  CANCEL_FAILED: 'Failed to cancel order. Please contact support.',

  // Generic errors
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  SERVER_ERROR: 'A server error occurred. Please try again later.',
};

/**
 * Get user-friendly error message
 */
export function getUserFriendlyError(error: any): string {
  if (error instanceof ApolloError) {
    const appErrors = parseApolloError(error);
    if (appErrors.length > 0) {
      return formatErrorMessage(appErrors[0]);
    }
  }

  if (typeof error === 'string') {
    return error;
  }

  if (error?.message) {
    return error.message;
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Error boundary error handler
 */
export function handleErrorBoundaryError(error: Error, errorInfo: any): void {
  console.error('Error Boundary caught error:', error, errorInfo);

  // Log to error reporting service (e.g., Sentry)
  // if (window.Sentry) {
  //   window.Sentry.captureException(error, { extra: errorInfo });
  // }
}

/**
 * Global error handler for unhandled promise rejections
 */
export function setupGlobalErrorHandlers(): void {
  window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled promise rejection:', event.reason);

    // Log to error reporting service
    // if (window.Sentry) {
    //   window.Sentry.captureException(event.reason);
    // }

    event.preventDefault();
  });

  window.addEventListener('error', event => {
    console.error('Uncaught error:', event.error);

    // Log to error reporting service
    // if (window.Sentry) {
    //   window.Sentry.captureException(event.error);
    // }
  });
}

/**
 * Apollo error link for global error handling
 */
import { onError } from '@apollo/client/link/error';

export const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}, Code: ${extensions?.code}`
      );

      // Handle authentication errors
      if (extensions?.code === 'UNAUTHENTICATED') {
        // Redirect to login or refresh token
        // window.location.href = '/login';
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

/**
 * Retry operation for specific errors
 */
export function shouldRetryOperation(error: ApolloError): boolean {
  const appErrors = parseApolloError(error);
  return appErrors.some(e => e.retryable);
}

/**
 * Circuit breaker pattern for preventing cascading failures
 */
export class CircuitBreaker {
  private failureCount = 0;
  private lastFailureTime: number | null = null;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (this.lastFailureTime && Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN. Service temporarily unavailable.');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= this.threshold) {
      this.state = 'OPEN';
      console.warn('Circuit breaker opened due to consecutive failures');
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failureCount = 0;
    this.lastFailureTime = null;
    this.state = 'CLOSED';
  }
}

/**
 * Create a circuit breaker instance
 */
export const circuitBreaker = new CircuitBreaker(5, 60000);
