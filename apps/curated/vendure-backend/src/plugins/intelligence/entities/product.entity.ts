/**
 * Product Entity Extensions for JADE Spa Marketplace
 *
 * Task: T062 - Create Product entity extending Vendure Product
 *
 * Extends Vendure's base Product entity with:
 * - Progressive disclosure data (glance/scan/study levels)
 * - Pricing tiers for wholesale
 * - Vector embeddings (13-D tensor, 792-D semantic)
 * - Professional skincare metadata
 */

import { Product } from '@vendure/core';

/**
 * Progressive Disclosure - Glance Level Data
 * Always loaded, optimized for 3-second scan
 */
export interface ProductGlance {
  /** One-sentence value proposition */
  heroBenefit: string;

  /** Average rating (0-5) */
  rating: number | null;

  /** Number of reviews */
  reviewCount: number;

  /** Suitable skin types */
  skinTypes: string[];
}

/**
 * Progressive Disclosure - Scan Level Data
 * Loaded on interaction, 30-second exploration
 */
export interface ProductScan {
  /** Ingredient information */
  ingredients: IngredientList;

  /** Usage instructions */
  usageInstructions: UsageInstructions;

  /** Key active ingredients */
  keyActives: ActiveIngredient[];

  /** Warnings and precautions */
  warnings: string[];
}

/**
 * Progressive Disclosure - Study Level Data
 * Loaded on detail page, 5-minute deep dive
 */
export interface ProductStudy {
  /** Clinical trial data */
  clinicalData: ClinicalData | null;

  /** Formulation science explanation */
  formulationScience: string;

  /** Contraindications */
  contraindications: string[];

  /** Professional notes */
  professionalNotes: string | null;

  /** Detailed application steps */
  detailedSteps: string[];

  /** Expected results */
  expectedResults: string;

  /** Time to see results */
  timeToResults: string;
}

/**
 * Ingredient list with INCI names and details
 */
export interface IngredientList {
  /** International Nomenclature Cosmetic Ingredient list */
  inci: Ingredient[];

  /** Active ingredients */
  actives: ActiveIngredient[];

  /** Known allergens */
  allergens: string[];

  /** Vegan formulation */
  vegan: boolean;

  /** Cruelty-free certification */
  crueltyFree: boolean;
}

/**
 * Individual ingredient details
 */
export interface Ingredient {
  /** INCI name */
  name: string;

  /** Concentration percentage (optional) */
  concentration?: number;

  /** Functional purpose */
  function: string;

  /** Warnings (optional) */
  warnings?: string[];
}

/**
 * Active ingredient details
 */
export interface ActiveIngredient {
  /** Active name */
  name: string;

  /** Concentration percentage */
  concentration: number;

  /** Active type (e.g., "retinoid", "AHA", "vitamin_c") */
  type: string;
}

/**
 * Usage instructions
 */
export interface UsageInstructions {
  /** Application method */
  application: string;

  /** Frequency (e.g., "twice daily") */
  frequency: string;

  /** Time of day */
  timeOfDay: 'AM' | 'PM' | 'BOTH';

  /** Patch test required */
  patchTestRequired: boolean;
}

/**
 * Clinical trial data
 */
export interface ClinicalData {
  /** Clinical trials */
  trials: ClinicalTrial[];

  /** Certifications */
  certifications: string[];

  /** Test reports */
  testReports: TestReport[];
}

/**
 * Clinical trial details
 */
export interface ClinicalTrial {
  /** Study name */
  studyName: string;

  /** Number of participants */
  participants: number;

  /** Study duration */
  duration: string;

  /** Results summary */
  results: string;

  /** Publication URL (optional) */
  publicationUrl?: string;
}

/**
 * Test report
 */
export interface TestReport {
  /** Test type */
  testType: string;

  /** Report URL */
  reportUrl: string;

  /** Test date */
  testedAt: string; // ISO 8601
}

/**
 * Wholesale pricing tier
 */
export interface PricingTier {
  /** Minimum quantity for this tier */
  minQuantity: number;

  /** Unit price at this tier */
  unitPrice: number;

  /** Discount percentage vs base price */
  discountPercentage: number;
}

/**
 * Extended Product type with JADE custom fields
 *
 * NOTE: These extensions are implemented via Vendure's CustomFields API
 * The actual implementation uses Product.customFields.*
 */
export interface JadeProduct extends Product {
  customFields: {
    /** Vendor organization ID */
    vendorId: string;

    /** Progressive disclosure - glance data (JSONB) */
    glanceData: string; // JSON string of ProductGlance

    /** Progressive disclosure - scan data (JSONB, nullable) */
    scanData?: string; // JSON string of ProductScan

    /** Progressive disclosure - study data (JSONB, nullable) */
    studyData?: string; // JSON string of ProductStudy

    /** Pricing tiers for wholesale (JSONB) */
    pricingTiers: string; // JSON string of PricingTier[]

    /** Inventory level */
    inventoryLevel: number;

    /** Tensor vector generated flag */
    tensorGenerated: boolean;

    /** Embedding generated flag */
    embeddingGenerated: boolean;

    /** Professional notes (nullable) */
    professionalNotes?: string;
  };
}

/**
 * Custom fields configuration for Product entity
 * Used in vendure-config.ts to extend the Product entity
 */
export const ProductCustomFields = [
  {
    name: 'vendorId',
    type: 'string' as const,
    label: [{ languageCode: 'en' as const, value: 'Vendor ID' }],
    description: [{ languageCode: 'en' as const, value: 'Vendor organization that supplies this product' }],
    public: true,
  },
  {
    name: 'glanceData',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Glance Data (JSON)' }],
    description: [{ languageCode: 'en' as const, value: 'Progressive disclosure glance level data' }],
    public: true,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'scanData',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Scan Data (JSON)' }],
    description: [{ languageCode: 'en' as const, value: 'Progressive disclosure scan level data' }],
    nullable: true,
    public: true,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'studyData',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Study Data (JSON)' }],
    description: [{ languageCode: 'en' as const, value: 'Progressive disclosure study level data' }],
    nullable: true,
    public: true,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'pricingTiers',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Pricing Tiers (JSON)' }],
    description: [{ languageCode: 'en' as const, value: 'Wholesale pricing tiers array' }],
    public: true,
    ui: { component: 'textarea-form-input' },
  },
  {
    name: 'inventoryLevel',
    type: 'int' as const,
    label: [{ languageCode: 'en' as const, value: 'Inventory Level' }],
    description: [{ languageCode: 'en' as const, value: 'Current stock level' }],
    defaultValue: 0,
    public: true,
  },
  {
    name: 'tensorGenerated',
    type: 'boolean' as const,
    label: [{ languageCode: 'en' as const, value: 'Tensor Generated' }],
    description: [{ languageCode: 'en' as const, value: '13-D tensor vector has been generated' }],
    defaultValue: false,
    public: false,
  },
  {
    name: 'embeddingGenerated',
    type: 'boolean' as const,
    label: [{ languageCode: 'en' as const, value: 'Embedding Generated' }],
    description: [{ languageCode: 'en' as const, value: '792-D embedding has been generated' }],
    defaultValue: false,
    public: false,
  },
  {
    name: 'professionalNotes',
    type: 'text' as const,
    label: [{ languageCode: 'en' as const, value: 'Professional Notes' }],
    description: [{ languageCode: 'en' as const, value: 'Notes for licensed professionals only' }],
    nullable: true,
    public: false,
    ui: { component: 'textarea-form-input' },
  },
];

/**
 * Helper to parse glance data from JSON string
 */
export function parseGlanceData(glanceDataJson: string): ProductGlance {
  return JSON.parse(glanceDataJson);
}

/**
 * Helper to parse scan data from JSON string
 */
export function parseScanData(scanDataJson: string | undefined): ProductScan | null {
  return scanDataJson ? JSON.parse(scanDataJson) : null;
}

/**
 * Helper to parse study data from JSON string
 */
export function parseStudyData(studyDataJson: string | undefined): ProductStudy | null {
  return studyDataJson ? JSON.parse(studyDataJson) : null;
}

/**
 * Helper to parse pricing tiers from JSON string
 */
export function parsePricingTiers(pricingTiersJson: string): PricingTier[] {
  return JSON.parse(pricingTiersJson);
}

/**
 * Helper to get applicable pricing tier based on quantity
 */
export function getApplicableTier(pricingTiers: PricingTier[], quantity: number): PricingTier {
  // Sort tiers by minQuantity descending
  const sortedTiers = [...pricingTiers].sort((a, b) => b.minQuantity - a.minQuantity);

  // Find the highest tier that the quantity qualifies for
  for (const tier of sortedTiers) {
    if (quantity >= tier.minQuantity) {
      return tier;
    }
  }

  // Fallback to base tier (lowest minQuantity)
  return pricingTiers.reduce((lowest, tier) =>
    tier.minQuantity < lowest.minQuantity ? tier : lowest
  );
}

/**
 * Helper to calculate line total with tier pricing
 */
export function calculateLineTotal(pricingTiers: PricingTier[], quantity: number): {
  unitPrice: number;
  lineTotal: number;
  appliedTier: PricingTier;
} {
  const appliedTier = getApplicableTier(pricingTiers, quantity);
  const unitPrice = appliedTier.unitPrice;
  const lineTotal = unitPrice * quantity;

  return {
    unitPrice,
    lineTotal,
    appliedTier,
  };
}

/**
 * Helper to check if product is in stock
 */
export function isInStock(product: JadeProduct): boolean {
  return product.customFields.inventoryLevel > 0;
}

/**
 * Helper to check if product has vectors generated
 */
export function hasVectorsGenerated(product: JadeProduct): boolean {
  return product.customFields.tensorGenerated && product.customFields.embeddingGenerated;
}

/**
 * Helper to validate inventory availability
 */
export function checkInventoryAvailability(product: JadeProduct, requestedQuantity: number): {
  available: boolean;
  availableQuantity: number;
} {
  const available = product.customFields.inventoryLevel >= requestedQuantity;
  return {
    available,
    availableQuantity: product.customFields.inventoryLevel,
  };
}

/**
 * Default pricing tiers (example: $50 base, 10% off at 6, 20% off at 12)
 */
export function createDefaultPricingTiers(basePrice: number): PricingTier[] {
  return [
    {
      minQuantity: 1,
      unitPrice: basePrice,
      discountPercentage: 0,
    },
    {
      minQuantity: 6,
      unitPrice: basePrice * 0.9, // 10% off
      discountPercentage: 10,
    },
    {
      minQuantity: 12,
      unitPrice: basePrice * 0.8, // 20% off
      discountPercentage: 20,
    },
  ];
}
