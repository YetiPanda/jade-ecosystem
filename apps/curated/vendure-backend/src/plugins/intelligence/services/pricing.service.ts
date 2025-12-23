/**
 * PricingService for JADE Spa Marketplace
 *
 * Task: T068 - Implement pricing tier calculation logic
 *
 * Handles pricing calculations including:
 * - Wholesale pricing tier calculation (base, 10%, 20% off)
 * - Bulk discount application
 * - Custom pricing tier management
 * - Price validation
 */

import { Injectable } from '@nestjs/common';
import {
  PricingTier,
  getApplicableTier,
  createDefaultPricingTiers,
  validatePricingTiers,
} from '../entities/product.entity';

/**
 * Pricing calculation result
 */
export interface PricingCalculation {
  /** Base price (tier 1 price) */
  basePrice: number;

  /** Unit price after tier discount */
  unitPrice: number;

  /** Total price (unitPrice * quantity) */
  totalPrice: number;

  /** Applied tier */
  appliedTier: PricingTier;

  /** Discount amount per unit */
  discountPerUnit: number;

  /** Total discount amount */
  totalDiscount: number;

  /** Savings percentage */
  savingsPercentage: number;
}

/**
 * Pricing tier validation result
 */
export interface PricingValidation {
  /** Whether tiers are valid */
  valid: boolean;

  /** Validation errors */
  errors: string[];

  /** Warnings (non-fatal issues) */
  warnings: string[];
}

@Injectable()
export class PricingService {
  /**
   * Standard wholesale discount tiers
   */
  static readonly STANDARD_TIERS = {
    /** Base tier: 1-5 units, no discount */
    BASE: { minQuantity: 1, discountPercentage: 0 },

    /** Tier 2: 6-11 units, 10% off */
    TIER_2: { minQuantity: 6, discountPercentage: 10 },

    /** Tier 3: 12+ units, 20% off */
    TIER_3: { minQuantity: 12, discountPercentage: 20 },
  };

  /**
   * Calculate price for a given quantity using pricing tiers
   *
   * @param pricingTiers - Available pricing tiers
   * @param quantity - Quantity to purchase
   * @returns Pricing calculation with applied tier and discounts
   */
  calculatePrice(
    pricingTiers: PricingTier[],
    quantity: number
  ): PricingCalculation {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    if (!pricingTiers || pricingTiers.length === 0) {
      throw new Error('Pricing tiers are required');
    }

    // Get applicable tier
    const appliedTier = getApplicableTier(pricingTiers, quantity);

    // Get base price (tier with minQuantity = 1)
    const baseTier = pricingTiers.find(t => t.minQuantity === 1) || pricingTiers[0];
    const basePrice = baseTier.unitPrice;

    // Calculate pricing
    const unitPrice = appliedTier.unitPrice;
    const totalPrice = unitPrice * quantity;

    const discountPerUnit = basePrice - unitPrice;
    const totalDiscount = discountPerUnit * quantity;
    const savingsPercentage = appliedTier.discountPercentage;

    return {
      basePrice,
      unitPrice,
      totalPrice,
      appliedTier,
      discountPerUnit,
      totalDiscount,
      savingsPercentage,
    };
  }

  /**
   * Create standard 3-tier pricing structure from base price
   *
   * Standard tiers:
   * - Tier 1 (1-5 units): Base price, 0% discount
   * - Tier 2 (6-11 units): 10% discount
   * - Tier 3 (12+ units): 20% discount
   *
   * @param basePrice - Base unit price in cents
   * @returns Standard pricing tiers
   */
  createStandardTiers(basePrice: number): PricingTier[] {
    if (basePrice <= 0) {
      throw new Error('Base price must be greater than 0');
    }

    return createDefaultPricingTiers(basePrice);
  }

  /**
   * Create custom pricing tiers
   *
   * @param tiers - Array of tier definitions { minQuantity, discountPercentage }
   * @param basePrice - Base unit price in cents
   * @returns Custom pricing tiers
   */
  createCustomTiers(
    tiers: Array<{ minQuantity: number; discountPercentage: number }>,
    basePrice: number
  ): PricingTier[] {
    if (basePrice <= 0) {
      throw new Error('Base price must be greater than 0');
    }

    const pricingTiers: PricingTier[] = tiers.map(tier => ({
      minQuantity: tier.minQuantity,
      unitPrice: basePrice * (1 - tier.discountPercentage / 100),
      discountPercentage: tier.discountPercentage,
    }));

    // Validate tiers
    const validation = this.validateTiers(pricingTiers);
    if (!validation.valid) {
      throw new Error(`Invalid pricing tiers: ${validation.errors.join(', ')}`);
    }

    return pricingTiers;
  }

  /**
   * Validate pricing tiers
   *
   * Checks:
   * - At least one tier exists
   * - All tiers have valid minQuantity (> 0)
   * - All tiers have valid unitPrice (> 0)
   * - Tiers are in ascending quantity order
   * - Prices decrease with higher quantity (wholesale logic)
   * - Discount percentages are reasonable (0-100%)
   *
   * @param pricingTiers - Pricing tiers to validate
   * @returns Validation result
   */
  validateTiers(pricingTiers: PricingTier[]): PricingValidation {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check if tiers exist
    if (!pricingTiers || pricingTiers.length === 0) {
      errors.push('At least one pricing tier is required');
      return { valid: false, errors, warnings };
    }

    // Use entity helper for basic validation
    const entityErrors = validatePricingTiers(pricingTiers);
    errors.push(...entityErrors);

    // Additional business logic validations
    const sortedTiers = [...pricingTiers].sort((a, b) => a.minQuantity - b.minQuantity);

    // Check for tier 1 existence
    if (!sortedTiers.find(t => t.minQuantity === 1)) {
      warnings.push('No tier with minQuantity = 1 (base tier)');
    }

    // Check price progression (should decrease or stay same)
    for (let i = 1; i < sortedTiers.length; i++) {
      const prevTier = sortedTiers[i - 1];
      const currentTier = sortedTiers[i];

      if (currentTier.unitPrice > prevTier.unitPrice) {
        errors.push(
          `Tier ${i + 1} price ($${currentTier.unitPrice / 100}) is higher than tier ${i} ` +
          `($${prevTier.unitPrice / 100}). Wholesale prices should decrease with quantity.`
        );
      }

      if (currentTier.unitPrice === prevTier.unitPrice) {
        warnings.push(
          `Tiers ${i} and ${i + 1} have the same price. Consider consolidating.`
        );
      }
    }

    // Check for reasonable discount percentages
    for (const tier of pricingTiers) {
      if (tier.discountPercentage > 50) {
        warnings.push(
          `Tier at ${tier.minQuantity} units has ${tier.discountPercentage}% discount (unusually high)`
        );
      }
    }

    // Check for too many tiers
    if (pricingTiers.length > 5) {
      warnings.push(
        `${pricingTiers.length} tiers defined. Consider simplifying to 3-5 tiers.`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Calculate savings compared to buying at base price
   *
   * @param pricingTiers - Pricing tiers
   * @param quantity - Quantity to purchase
   * @returns Savings information
   */
  calculateSavings(
    pricingTiers: PricingTier[],
    quantity: number
  ): {
    baseTotal: number;
    actualTotal: number;
    savings: number;
    savingsPercentage: number;
  } {
    const calculation = this.calculatePrice(pricingTiers, quantity);

    const baseTotal = calculation.basePrice * quantity;
    const actualTotal = calculation.totalPrice;
    const savings = baseTotal - actualTotal;
    const savingsPercentage = (savings / baseTotal) * 100;

    return {
      baseTotal,
      actualTotal,
      savings,
      savingsPercentage,
    };
  }

  /**
   * Find next tier discount threshold
   *
   * Returns how many more units needed to reach next discount tier
   *
   * @param pricingTiers - Pricing tiers
   * @param currentQuantity - Current cart quantity
   * @returns Next tier info or null if already at highest tier
   */
  findNextTierThreshold(
    pricingTiers: PricingTier[],
    currentQuantity: number
  ): {
    nextTier: PricingTier;
    quantityNeeded: number;
    additionalSavings: number;
  } | null {
    const sortedTiers = [...pricingTiers].sort((a, b) => a.minQuantity - b.minQuantity);

    // Find next tier
    const nextTier = sortedTiers.find(t => t.minQuantity > currentQuantity);

    if (!nextTier) {
      return null; // Already at highest tier
    }

    const quantityNeeded = nextTier.minQuantity - currentQuantity;

    // Calculate additional savings
    const currentTier = getApplicableTier(pricingTiers, currentQuantity);
    const priceAtNextTier = nextTier.unitPrice;
    const priceAtCurrentTier = currentTier.unitPrice;
    const additionalSavings = (priceAtCurrentTier - priceAtNextTier) * nextTier.minQuantity;

    return {
      nextTier,
      quantityNeeded,
      additionalSavings,
    };
  }

  /**
   * Apply bulk discount to a list of line items
   *
   * @param lineItems - Items with quantity and base price
   * @returns Items with pricing tiers applied
   */
  applyBulkDiscounts(
    lineItems: Array<{
      productId: string;
      quantity: number;
      basePrice: number;
      pricingTiers?: PricingTier[];
    }>
  ): Array<{
    productId: string;
    quantity: number;
    basePrice: number;
    unitPrice: number;
    totalPrice: number;
    appliedTier: PricingTier;
    savings: number;
  }> {
    return lineItems.map(item => {
      // Use provided tiers or create standard tiers
      const tiers = item.pricingTiers || this.createStandardTiers(item.basePrice);

      const calculation = this.calculatePrice(tiers, item.quantity);

      return {
        productId: item.productId,
        quantity: item.quantity,
        basePrice: item.basePrice,
        unitPrice: calculation.unitPrice,
        totalPrice: calculation.totalPrice,
        appliedTier: calculation.appliedTier,
        savings: calculation.totalDiscount,
      };
    });
  }

  /**
   * Calculate break-even point for a tier
   *
   * Calculates at what quantity the savings justify buying more units
   *
   * @param currentTier - Current pricing tier
   * @param nextTier - Next pricing tier
   * @returns Break-even quantity and savings
   */
  calculateBreakEven(
    currentTier: PricingTier,
    nextTier: PricingTier
  ): { breakEvenQuantity: number; totalSavings: number } {
    // At break-even: cost at current tier = cost at next tier
    // currentTier.unitPrice * qty = nextTier.unitPrice * nextTier.minQuantity
    // This is simplified - real break-even needs more context

    const breakEvenQuantity = nextTier.minQuantity;
    const costAtCurrent = currentTier.unitPrice * breakEvenQuantity;
    const costAtNext = nextTier.unitPrice * breakEvenQuantity;
    const totalSavings = costAtCurrent - costAtNext;

    return {
      breakEvenQuantity,
      totalSavings,
    };
  }

  /**
   * Format price for display
   *
   * @param priceInCents - Price in cents
   * @param currency - Currency code (default: USD)
   * @returns Formatted price string
   */
  formatPrice(priceInCents: number, currency: string = 'USD'): string {
    const dollars = priceInCents / 100;

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(dollars);
  }

  /**
   * Format discount percentage
   *
   * @param percentage - Discount percentage
   * @returns Formatted string (e.g., "20% off")
   */
  formatDiscount(percentage: number): string {
    return percentage > 0 ? `${percentage}% off` : 'No discount';
  }
}
