/**
 * Form validation hooks
 * Task: T089 - Add client-side validation
 */

import { useState, useCallback } from 'react';
import {
  validateEmail,
  validatePhone,
  validateZipCode,
  validateAddress,
  validateQuantity,
  validateSearchQuery,
  validateCreditCard,
  validatePromoCode,
  validatePassword,
  validatePasswordConfirmation,
  validateRequired,
  type ValidationError,
  type Address,
  type CreditCard,
} from '../utils/validation';

/**
 * Generic form validation hook
 */
export function useFormValidation<T extends Record<string, any>>() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const setFieldError = useCallback((field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  }, []);

  const clearFieldError = useCallback((field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  const setFieldTouched = useCallback((field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const isFieldTouched = useCallback((field: string) => {
    return touched[field] || false;
  }, [touched]);

  const getFieldError = useCallback((field: string) => {
    return errors[field];
  }, [errors]);

  const hasErrors = Object.keys(errors).length > 0;

  return {
    errors,
    touched,
    hasErrors,
    setFieldError,
    clearFieldError,
    clearAllErrors,
    setFieldTouched,
    isFieldTouched,
    getFieldError,
  };
}

/**
 * Address form validation hook
 */
export function useAddressValidation() {
  const form = useFormValidation<Address>();

  const validate = useCallback((address: Partial<Address>) => {
    form.clearAllErrors();
    const result = validateAddress(address);

    result.errors.forEach(error => {
      form.setFieldError(error.field, error.message);
    });

    return result.isValid;
  }, [form]);

  const validateField = useCallback((field: keyof Address, value: any) => {
    form.clearFieldError(field);

    switch (field) {
      case 'phone':
        if (value) {
          const result = validatePhone(value);
          if (!result.isValid) {
            form.setFieldError(field, result.errors[0].message);
          }
        }
        break;

      case 'zipCode':
        if (value) {
          const result = validateZipCode(value);
          if (!result.isValid) {
            form.setFieldError(field, result.errors[0].message);
          }
        }
        break;

      case 'state':
        if (value && !/^[A-Z]{2}$/.test(value)) {
          form.setFieldError(field, 'State must be a 2-letter code');
        }
        break;

      default:
        if (!value || !value.trim()) {
          form.setFieldError(field, `${field} is required`);
        }
    }
  }, [form]);

  return {
    ...form,
    validate,
    validateField,
  };
}

/**
 * Credit card validation hook
 */
export function useCreditCardValidation() {
  const form = useFormValidation<CreditCard>();

  const validate = useCallback((card: Partial<CreditCard>) => {
    form.clearAllErrors();
    const result = validateCreditCard(card);

    result.errors.forEach(error => {
      form.setFieldError(error.field, error.message);
    });

    return result.isValid;
  }, [form]);

  const validateField = useCallback((field: keyof CreditCard, value: any, allValues?: Partial<CreditCard>) => {
    form.clearFieldError(field);

    // Re-validate the entire card to check expiry date logic
    if (allValues) {
      const result = validateCreditCard(allValues);
      const fieldError = result.errors.find(e => e.field === field);
      if (fieldError) {
        form.setFieldError(field, fieldError.message);
      }
    }
  }, [form]);

  return {
    ...form,
    validate,
    validateField,
  };
}

/**
 * Quantity validation hook
 */
export function useQuantityValidation(options: { min?: number; max?: number; inventoryLevel?: number } = {}) {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((quantity: number) => {
    const result = validateQuantity(quantity, options);
    setError(result.isValid ? null : result.errors[0].message);
    return result.isValid;
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    validate,
    clearError,
  };
}

/**
 * Search validation hook
 */
export function useSearchValidation(options: { minLength?: number; maxLength?: number } = {}) {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((query: string) => {
    const result = validateSearchQuery(query, options);
    setError(result.isValid ? null : result.errors[0]?.message || null);
    return result.isValid;
  }, [options]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    validate,
    clearError,
  };
}

/**
 * Promo code validation hook
 */
export function usePromoCodeValidation() {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((code: string) => {
    const result = validatePromoCode(code);
    setError(result.isValid ? null : result.errors[0].message);
    return result.isValid;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    validate,
    clearError,
  };
}

/**
 * Password validation hook
 */
export function usePasswordValidation() {
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});

  const validate = useCallback((password: string, confirmPassword?: string) => {
    const newErrors: typeof errors = {};

    const passwordResult = validatePassword(password);
    if (!passwordResult.isValid) {
      newErrors.password = passwordResult.errors[0].message;
    }

    if (confirmPassword !== undefined) {
      const confirmResult = validatePasswordConfirmation(password, confirmPassword);
      if (!confirmResult.isValid) {
        newErrors.confirmPassword = confirmResult.errors[0].message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, []);

  const validatePassword = useCallback((password: string) => {
    const result = validatePassword(password);
    setErrors(prev => ({
      ...prev,
      password: result.isValid ? undefined : result.errors[0].message,
    }));
    return result.isValid;
  }, []);

  const validateConfirmation = useCallback((password: string, confirmPassword: string) => {
    const result = validatePasswordConfirmation(password, confirmPassword);
    setErrors(prev => ({
      ...prev,
      confirmPassword: result.isValid ? undefined : result.errors[0].message,
    }));
    return result.isValid;
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    errors,
    validate,
    validatePassword,
    validateConfirmation,
    clearErrors,
  };
}

/**
 * Email validation hook
 */
export function useEmailValidation() {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((email: string) => {
    const result = validateEmail(email);
    setError(result.isValid ? null : result.errors[0].message);
    return result.isValid;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    validate,
    clearError,
  };
}

/**
 * Phone validation hook
 */
export function usePhoneValidation() {
  const [error, setError] = useState<string | null>(null);

  const validate = useCallback((phone: string) => {
    const result = validatePhone(phone);
    setError(result.isValid ? null : result.errors[0].message);
    return result.isValid;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    validate,
    clearError,
  };
}

/**
 * Real-time field validation hook
 */
export function useFieldValidation<T>(
  validator: (value: T) => { isValid: boolean; errors: ValidationError[] },
  debounceMs: number = 300
) {
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const validate = useCallback((value: T) => {
    setIsValidating(true);

    // Simulate async validation with debounce
    const timer = setTimeout(() => {
      const result = validator(value);
      setError(result.isValid ? null : result.errors[0]?.message || null);
      setIsValidating(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [validator, debounceMs]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isValidating,
    validate,
    clearError,
  };
}
