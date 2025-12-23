/**
 * Client-side validation utilities
 * Task: T089 - Add client-side validation
 */

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Email validation
 */
export function validateEmail(email: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!email || !email.trim()) {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Phone number validation (E.164 format)
 */
export function validatePhone(phone: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!phone || !phone.trim()) {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  } else {
    const cleaned = phone.replace(/[\s()-]/g, '');
    if (!/^\+?[1-9]\d{1,14}$/.test(cleaned)) {
      errors.push({ field: 'phone', message: 'Invalid phone number format (use E.164: +1234567890)' });
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * ZIP code validation (US format)
 */
export function validateZipCode(zipCode: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!zipCode || !zipCode.trim()) {
    errors.push({ field: 'zipCode', message: 'ZIP code is required' });
  } else if (!/^\d{5}(-\d{4})?$/.test(zipCode)) {
    errors.push({ field: 'zipCode', message: 'Invalid ZIP code format (use 12345 or 12345-6789)' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Address validation
 */
export interface Address {
  firstName?: string;
  lastName?: string;
  company?: string;
  street?: string;
  street2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phone?: string;
}

export function validateAddress(address: Partial<Address>): ValidationResult {
  const errors: ValidationError[] = [];

  // Required fields
  if (!address.firstName?.trim()) {
    errors.push({ field: 'firstName', message: 'First name is required' });
  } else if (address.firstName.length > 100) {
    errors.push({ field: 'firstName', message: 'First name must be less than 100 characters' });
  }

  if (!address.lastName?.trim()) {
    errors.push({ field: 'lastName', message: 'Last name is required' });
  } else if (address.lastName.length > 100) {
    errors.push({ field: 'lastName', message: 'Last name must be less than 100 characters' });
  }

  if (!address.street?.trim()) {
    errors.push({ field: 'street', message: 'Street address is required' });
  } else if (address.street.length > 200) {
    errors.push({ field: 'street', message: 'Street address must be less than 200 characters' });
  }

  if (!address.city?.trim()) {
    errors.push({ field: 'city', message: 'City is required' });
  } else if (address.city.length > 100) {
    errors.push({ field: 'city', message: 'City name must be less than 100 characters' });
  }

  if (!address.state?.trim()) {
    errors.push({ field: 'state', message: 'State is required' });
  } else if (!/^[A-Z]{2}$/.test(address.state)) {
    errors.push({ field: 'state', message: 'State must be a 2-letter code (e.g., CA, NY)' });
  }

  if (address.zipCode) {
    const zipValidation = validateZipCode(address.zipCode);
    errors.push(...zipValidation.errors);
  } else {
    errors.push({ field: 'zipCode', message: 'ZIP code is required' });
  }

  if (!address.country?.trim()) {
    errors.push({ field: 'country', message: 'Country is required' });
  } else if (address.country !== 'US') {
    errors.push({ field: 'country', message: 'Currently only US addresses are supported' });
  }

  if (address.phone) {
    const phoneValidation = validatePhone(address.phone);
    errors.push(...phoneValidation.errors);
  } else {
    errors.push({ field: 'phone', message: 'Phone number is required' });
  }

  // Optional fields validation
  if (address.company && address.company.length > 200) {
    errors.push({ field: 'company', message: 'Company name must be less than 200 characters' });
  }

  if (address.street2 && address.street2.length > 200) {
    errors.push({ field: 'street2', message: 'Address line 2 must be less than 200 characters' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Quantity validation
 */
export function validateQuantity(
  quantity: number,
  options: { min?: number; max?: number; inventoryLevel?: number } = {}
): ValidationResult {
  const errors: ValidationError[] = [];
  const min = options.min || 1;
  const max = options.max || 999;

  if (!Number.isInteger(quantity)) {
    errors.push({ field: 'quantity', message: 'Quantity must be a whole number' });
  } else if (quantity < min) {
    errors.push({ field: 'quantity', message: `Quantity must be at least ${min}` });
  } else if (quantity > max) {
    errors.push({ field: 'quantity', message: `Quantity cannot exceed ${max}` });
  } else if (options.inventoryLevel !== undefined && quantity > options.inventoryLevel) {
    errors.push({ field: 'quantity', message: `Only ${options.inventoryLevel} units available` });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Price validation
 */
export function validatePrice(price: number): ValidationResult {
  const errors: ValidationError[] = [];

  if (typeof price !== 'number' || isNaN(price)) {
    errors.push({ field: 'price', message: 'Price must be a number' });
  } else if (price < 0) {
    errors.push({ field: 'price', message: 'Price cannot be negative' });
  } else if (!Number.isInteger(price)) {
    errors.push({ field: 'price', message: 'Price must be in cents (whole number)' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Search query validation
 */
export function validateSearchQuery(query: string, options: { minLength?: number; maxLength?: number } = {}): ValidationResult {
  const errors: ValidationError[] = [];
  const minLength = options.minLength || 2;
  const maxLength = options.maxLength || 200;

  if (query && query.trim().length < minLength) {
    errors.push({ field: 'query', message: `Search query must be at least ${minLength} characters` });
  } else if (query && query.length > maxLength) {
    errors.push({ field: 'query', message: `Search query must be less than ${maxLength} characters` });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Credit card validation (basic)
 */
export interface CreditCard {
  number?: string;
  cvv?: string;
  expiryMonth?: string;
  expiryYear?: string;
  nameOnCard?: string;
}

export function validateCreditCard(card: Partial<CreditCard>): ValidationResult {
  const errors: ValidationError[] = [];

  // Card number validation (Luhn algorithm)
  if (!card.number?.trim()) {
    errors.push({ field: 'number', message: 'Card number is required' });
  } else {
    const cleaned = card.number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) {
      errors.push({ field: 'number', message: 'Invalid card number format' });
    } else if (!luhnCheck(cleaned)) {
      errors.push({ field: 'number', message: 'Invalid card number' });
    }
  }

  // CVV validation
  if (!card.cvv?.trim()) {
    errors.push({ field: 'cvv', message: 'CVV is required' });
  } else if (!/^\d{3,4}$/.test(card.cvv)) {
    errors.push({ field: 'cvv', message: 'CVV must be 3 or 4 digits' });
  }

  // Expiry validation
  if (!card.expiryMonth) {
    errors.push({ field: 'expiryMonth', message: 'Expiry month is required' });
  } else {
    const month = parseInt(card.expiryMonth);
    if (month < 1 || month > 12) {
      errors.push({ field: 'expiryMonth', message: 'Invalid month (1-12)' });
    }
  }

  if (!card.expiryYear) {
    errors.push({ field: 'expiryYear', message: 'Expiry year is required' });
  } else {
    const year = parseInt(card.expiryYear);
    const currentYear = new Date().getFullYear();
    if (year < currentYear || year > currentYear + 20) {
      errors.push({ field: 'expiryYear', message: 'Invalid expiry year' });
    }

    // Check if card is expired
    if (card.expiryMonth && errors.length === 0) {
      const month = parseInt(card.expiryMonth);
      const expiry = new Date(year, month - 1);
      const now = new Date();
      if (expiry < now) {
        errors.push({ field: 'expiryMonth', message: 'Card has expired' });
      }
    }
  }

  // Name validation
  if (!card.nameOnCard?.trim()) {
    errors.push({ field: 'nameOnCard', message: 'Name on card is required' });
  } else if (card.nameOnCard.length > 100) {
    errors.push({ field: 'nameOnCard', message: 'Name must be less than 100 characters' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Luhn algorithm for credit card validation
 */
function luhnCheck(cardNumber: string): boolean {
  let sum = 0;
  let isEven = false;

  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber.charAt(i));

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Promo code validation
 */
export function validatePromoCode(code: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!code || !code.trim()) {
    errors.push({ field: 'promoCode', message: 'Promo code is required' });
  } else if (code.length < 3) {
    errors.push({ field: 'promoCode', message: 'Promo code must be at least 3 characters' });
  } else if (code.length > 20) {
    errors.push({ field: 'promoCode', message: 'Promo code must be less than 20 characters' });
  } else if (!/^[A-Z0-9-]+$/.test(code.toUpperCase())) {
    errors.push({ field: 'promoCode', message: 'Promo code can only contain letters, numbers, and hyphens' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Password validation
 */
export function validatePassword(password: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
  } else {
    if (password.length < 8) {
      errors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    }
    if (password.length > 100) {
      errors.push({ field: 'password', message: 'Password must be less than 100 characters' });
    }
    if (!/[a-z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one lowercase letter' });
    }
    if (!/[A-Z]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one uppercase letter' });
    }
    if (!/[0-9]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one number' });
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errors.push({ field: 'password', message: 'Password must contain at least one special character' });
    }
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Password confirmation validation
 */
export function validatePasswordConfirmation(password: string, confirmation: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (!confirmation) {
    errors.push({ field: 'confirmPassword', message: 'Password confirmation is required' });
  } else if (password !== confirmation) {
    errors.push({ field: 'confirmPassword', message: 'Passwords do not match' });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Generic required field validation
 */
export function validateRequired(value: any, fieldName: string): ValidationResult {
  const errors: ValidationError[] = [];

  if (value === null || value === undefined || (typeof value === 'string' && !value.trim())) {
    errors.push({ field: fieldName, message: `${fieldName} is required` });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Combine multiple validation results
 */
export function combineValidationResults(...results: ValidationResult[]): ValidationResult {
  const allErrors = results.flatMap(r => r.errors);
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): Record<string, string> {
  return errors.reduce((acc, error) => {
    acc[error.field] = error.message;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Get first error for a field
 */
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find(e => e.field === field)?.message;
}
