/**
 * Vendor Portal Enums
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.1: Vendor Profile Schema (Task A.1.5, A.1.7)
 *
 * Defines enums for vendor values and certification types that spas can
 * search and filter by in the marketplace.
 */

/**
 * Vendor Values - Searchable attributes that vendors can claim
 *
 * These values are used for:
 * - Spa filtering and discovery
 * - Values-based search
 * - Discovery analytics and performance tracking
 *
 * Total: 25 values across 4 categories
 */
export enum VendorValue {
  // ──────────────────────────────────────────────────────────────
  // INGREDIENT PHILOSOPHY (8 values)
  // ──────────────────────────────────────────────────────────────
  CLEAN_BEAUTY = 'CLEAN_BEAUTY',
  ORGANIC = 'ORGANIC',
  NATURAL = 'NATURAL',
  VEGAN = 'VEGAN',
  CRUELTY_FREE = 'CRUELTY_FREE',
  FRAGRANCE_FREE = 'FRAGRANCE_FREE',
  PARABEN_FREE = 'PARABEN_FREE',
  SULFATE_FREE = 'SULFATE_FREE',

  // ──────────────────────────────────────────────────────────────
  // SUSTAINABILITY (6 values)
  // ──────────────────────────────────────────────────────────────
  SUSTAINABLE = 'SUSTAINABLE',
  ECO_PACKAGING = 'ECO_PACKAGING',
  REFILLABLE = 'REFILLABLE',
  ZERO_WASTE = 'ZERO_WASTE',
  CARBON_NEUTRAL = 'CARBON_NEUTRAL',
  REEF_SAFE = 'REEF_SAFE',

  // ──────────────────────────────────────────────────────────────
  // FOUNDER IDENTITY (6 values)
  // ──────────────────────────────────────────────────────────────
  WOMAN_FOUNDED = 'WOMAN_FOUNDED',
  BIPOC_OWNED = 'BIPOC_OWNED',
  LGBTQ_OWNED = 'LGBTQ_OWNED',
  VETERAN_OWNED = 'VETERAN_OWNED',
  FAMILY_OWNED = 'FAMILY_OWNED',
  SMALL_BATCH = 'SMALL_BATCH',

  // ──────────────────────────────────────────────────────────────
  // SPECIALIZATION (5 values)
  // ──────────────────────────────────────────────────────────────
  MEDICAL_GRADE = 'MEDICAL_GRADE',
  ESTHETICIAN_DEVELOPED = 'ESTHETICIAN_DEVELOPED',
  DERMATOLOGIST_TESTED = 'DERMATOLOGIST_TESTED',
  CLINICAL_RESULTS = 'CLINICAL_RESULTS',
  PROFESSIONAL_ONLY = 'PROFESSIONAL_ONLY',
}

/**
 * Certification Types - Official certifications requiring verification
 *
 * These certifications:
 * - Require human-in-the-loop verification (3 business day SLA)
 * - Require document upload as proof
 * - Display trust badges in vendor profile
 * - Affect visibility score and discovery ranking
 *
 * Total: 13 certification types
 */
export enum CertificationType {
  // ──────────────────────────────────────────────────────────────
  // ORGANIC & ECO CERTIFICATIONS
  // ──────────────────────────────────────────────────────────────
  USDA_ORGANIC = 'USDA_ORGANIC',
  ECOCERT = 'ECOCERT',
  COSMOS_ORGANIC = 'COSMOS_ORGANIC',
  COSMOS_NATURAL = 'COSMOS_NATURAL',

  // ──────────────────────────────────────────────────────────────
  // ANIMAL WELFARE
  // ──────────────────────────────────────────────────────────────
  LEAPING_BUNNY = 'LEAPING_BUNNY',
  PETA_CERTIFIED = 'PETA_CERTIFIED',

  // ──────────────────────────────────────────────────────────────
  // SOCIAL & ENVIRONMENTAL
  // ──────────────────────────────────────────────────────────────
  B_CORP = 'B_CORP',
  FAIR_TRADE = 'FAIR_TRADE',
  FSC_CERTIFIED = 'FSC_CERTIFIED',

  // ──────────────────────────────────────────────────────────────
  // SAFETY & QUALITY
  // ──────────────────────────────────────────────────────────────
  MADE_SAFE = 'MADE_SAFE',
  EWG_VERIFIED = 'EWG_VERIFIED',

  // ──────────────────────────────────────────────────────────────
  // BUSINESS OWNERSHIP
  // ──────────────────────────────────────────────────────────────
  WOMEN_OWNED_WBENC = 'WOMEN_OWNED_WBENC',
  MINORITY_OWNED_NMSDC = 'MINORITY_OWNED_NMSDC',
}

/**
 * Certification Verification Status
 *
 * Workflow: PENDING → UNDER_REVIEW → VERIFIED | REJECTED | EXPIRED
 */
export enum CertificationStatus {
  PENDING = 'PENDING',
  UNDER_REVIEW = 'UNDER_REVIEW',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
}

/**
 * Team Size Categories
 */
export enum TeamSize {
  SOLO = 'SOLO',
  TWO_TO_TEN = '2-10',
  ELEVEN_TO_FIFTY = '11-50',
  FIFTY_ONE_TO_TWO_HUNDRED = '51-200',
  TWO_HUNDRED_PLUS = '200+',
}

/**
 * Vendor Application Status
 *
 * Workflow: SUBMITTED → UNDER_REVIEW → APPROVED | CONDITIONALLY_APPROVED | REJECTED
 * Alternative: SUBMITTED → UNDER_REVIEW → ADDITIONAL_INFO_REQUESTED → UNDER_REVIEW
 * Vendor can WITHDRAW at any time before decision
 *
 * SLA: 3 business days from SUBMITTED to decision
 */
export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ADDITIONAL_INFO_REQUESTED = 'ADDITIONAL_INFO_REQUESTED',
  APPROVED = 'APPROVED',
  CONDITIONALLY_APPROVED = 'CONDITIONALLY_APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

/**
 * Onboarding Step Status
 *
 * Tracks completion status of individual onboarding steps
 */
export enum OnboardingStepStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
}

/**
 * Risk Assessment Level
 *
 * Used during application review to flag potential issues
 */
export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

/**
 * Vendor Value Metadata
 *
 * Display information for vendor values in UI
 */
export interface VendorValueMetadata {
  value: VendorValue;
  displayName: string;
  description: string;
  category: 'ingredient_philosophy' | 'sustainability' | 'founder_identity' | 'specialization';
  icon: string; // Emoji or icon identifier
}

/**
 * Certification Type Metadata
 *
 * Display and verification information for certification types
 */
export interface CertificationTypeMetadata {
  type: CertificationType;
  displayName: string;
  description: string;
  issuingBody: string;
  verificationRequired: boolean;
  requiresDocument: boolean;
  requiresCertificateNumber: boolean;
  requiresExpirationDate: boolean;
}
