/**
 * Vendor Portal Validation Schemas
 *
 * Feature 011: Vendor Portal MVP
 * Sprint A.1: Vendor Profile Schema (Task A.1.11)
 *
 * Zod validation schemas for vendor profile and certification inputs.
 * Used for:
 * - GraphQL mutation input validation
 * - API request validation
 * - Data integrity checks
 */

import { z } from 'zod';
import { VendorValue, CertificationType, TeamSize } from './vendor.enums';

// ──────────────────────────────────────────────────────────────
// HELPER VALIDATORS
// ──────────────────────────────────────────────────────────────

/**
 * Hex color validator (#RRGGBB format)
 */
const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #2d5a47)');

/**
 * URL validator (HTTP/HTTPS only)
 */
const httpUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .regex(/^https?:\/\//, 'URL must start with http:// or https://');

/**
 * Year validator (1900 - current year)
 */
const foundedYearSchema = z
  .number()
  .int('Year must be an integer')
  .min(1900, 'Founded year cannot be before 1900')
  .max(new Date().getFullYear(), 'Founded year cannot be in the future');

// ──────────────────────────────────────────────────────────────
// SOCIAL LINKS SCHEMA
// ──────────────────────────────────────────────────────────────

/**
 * Social links validation
 * All links must be valid URLs to the respective platforms
 */
export const socialLinksSchema = z.object({
  instagram: z
    .string()
    .url()
    .regex(/instagram\.com/, 'Must be an Instagram URL')
    .optional(),
  facebook: z
    .string()
    .url()
    .regex(/facebook\.com/, 'Must be a Facebook URL')
    .optional(),
  tiktok: z
    .string()
    .url()
    .regex(/tiktok\.com/, 'Must be a TikTok URL')
    .optional(),
  linkedin: z
    .string()
    .url()
    .regex(/linkedin\.com/, 'Must be a LinkedIn URL')
    .optional(),
});

export type SocialLinksInput = z.infer<typeof socialLinksSchema>;

// ──────────────────────────────────────────────────────────────
// VENDOR PROFILE SCHEMAS
// ──────────────────────────────────────────────────────────────

/**
 * Create Vendor Profile Input
 * Required fields for initial profile creation
 */
export const createVendorProfileSchema = z.object({
  vendorId: z.string().uuid('Vendor ID must be a valid UUID'),
  brandName: z
    .string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(255, 'Brand name cannot exceed 255 characters')
    .trim(),
});

export type CreateVendorProfileInput = z.infer<typeof createVendorProfileSchema>;

/**
 * Update Vendor Profile Input
 * All fields optional for partial updates
 */
export const updateVendorProfileSchema = z
  .object({
    // Brand Identity
    brandName: z
      .string()
      .min(2, 'Brand name must be at least 2 characters')
      .max(255, 'Brand name cannot exceed 255 characters')
      .trim()
      .optional(),

    tagline: z
      .string()
      .max(200, 'Tagline cannot exceed 200 characters')
      .trim()
      .optional()
      .nullable(),

    founderStory: z
      .string()
      .max(2000, 'Founder story cannot exceed 2000 characters')
      .trim()
      .optional()
      .nullable(),

    missionStatement: z
      .string()
      .max(500, 'Mission statement cannot exceed 500 characters')
      .trim()
      .optional()
      .nullable(),

    brandVideoUrl: httpUrlSchema
      .refine(
        url => {
          // Must be YouTube or Vimeo
          return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
        },
        { message: 'Brand video must be from YouTube or Vimeo' },
      )
      .optional()
      .nullable(),

    // Visual Identity
    logoUrl: httpUrlSchema.optional().nullable(),

    heroImageUrl: httpUrlSchema.optional().nullable(),

    brandColorPrimary: hexColorSchema.optional().nullable(),

    brandColorSecondary: hexColorSchema.optional().nullable(),

    galleryImages: z
      .array(httpUrlSchema)
      .max(10, 'Cannot have more than 10 gallery images')
      .optional()
      .nullable(),

    // Contact & Links
    websiteUrl: httpUrlSchema.optional().nullable(),

    socialLinks: socialLinksSchema.optional().nullable(),

    // Business Info
    foundedYear: foundedYearSchema.optional().nullable(),

    headquarters: z
      .string()
      .max(255, 'Headquarters cannot exceed 255 characters')
      .trim()
      .optional()
      .nullable(),

    teamSize: z.nativeEnum(TeamSize).optional().nullable(),

    // Values
    values: z
      .array(z.nativeEnum(VendorValue))
      .max(10, 'Cannot select more than 10 values')
      .optional(),
  })
  .strict(); // Reject unknown fields

export type UpdateVendorProfileInput = z.infer<typeof updateVendorProfileSchema>;

/**
 * Profile completeness calculation
 * Validates that required fields are filled for full profile
 */
export const completeProfileSchema = z.object({
  brandName: z.string().min(1),
  tagline: z.string().min(1),
  founderStory: z.string().min(100, 'Founder story should be at least 100 characters'),
  logoUrl: z.string().url(),
  heroImageUrl: z.string().url(),
  websiteUrl: z.string().url(),
  foundedYear: z.number(),
  headquarters: z.string().min(1),
  values: z.array(z.nativeEnum(VendorValue)).min(3, 'Select at least 3 values'),
});

// ──────────────────────────────────────────────────────────────
// VENDOR CERTIFICATION SCHEMAS
// ──────────────────────────────────────────────────────────────

/**
 * Add Certification Input
 * For vendors submitting a new certification for verification
 */
export const addCertificationSchema = z.object({
  type: z.nativeEnum(CertificationType, {
    errorMap: () => ({ message: 'Invalid certification type' }),
  }),

  certificateNumber: z
    .string()
    .max(100, 'Certificate number cannot exceed 100 characters')
    .trim()
    .optional()
    .nullable(),

  expirationDate: z
    .string()
    .datetime()
    .or(z.date())
    .refine(
      date => {
        const expDate = typeof date === 'string' ? new Date(date) : date;
        return expDate > new Date();
      },
      { message: 'Expiration date must be in the future' },
    )
    .optional()
    .nullable(),

  documentUrl: httpUrlSchema.refine(
    url => {
      // Must be PDF, JPG, or PNG
      return /\.(pdf|jpe?g|png)$/i.test(url);
    },
    { message: 'Document must be PDF, JPG, or PNG' },
  ),

  issuingBody: z
    .string()
    .min(2, 'Issuing body must be at least 2 characters')
    .max(255, 'Issuing body cannot exceed 255 characters')
    .trim(),
});

export type AddCertificationInput = z.infer<typeof addCertificationSchema>;

/**
 * Certification Verification Decision Input
 * For admin reviewers making verification decisions
 */
export const certificationVerificationSchema = z.object({
  certificationId: z.string().uuid('Certification ID must be a valid UUID'),

  decision: z.enum(['approve', 'reject', 'request_clearer_document'], {
    errorMap: () => ({ message: 'Invalid verification decision' }),
  }),

  note: z
    .string()
    .max(1000, 'Note cannot exceed 1000 characters')
    .trim()
    .optional(),

  rejectionReason: z
    .string()
    .min(10, 'Rejection reason must be at least 10 characters')
    .max(500, 'Rejection reason cannot exceed 500 characters')
    .trim()
    .optional(),
});

export type CertificationVerificationInput = z.infer<typeof certificationVerificationSchema>;

// ──────────────────────────────────────────────────────────────
// VALIDATION HELPER FUNCTIONS
// ──────────────────────────────────────────────────────────────

/**
 * Calculate profile completeness score (0-100)
 * Based on filled fields and their importance weights
 */
export function calculateCompletenessScore(profile: {
  brandName?: string | null;
  tagline?: string | null;
  founderStory?: string | null;
  missionStatement?: string | null;
  logoUrl?: string | null;
  heroImageUrl?: string | null;
  brandColorPrimary?: string | null;
  brandColorSecondary?: string | null;
  galleryImages?: string[] | null;
  websiteUrl?: string | null;
  socialLinks?: object | null;
  foundedYear?: number | null;
  headquarters?: string | null;
  teamSize?: string | null;
  values?: string[];
  certifications?: { verificationStatus: string }[];
}): number {
  let score = 0;

  // Critical fields (10 points each)
  if (profile.brandName) score += 10;
  if (profile.logoUrl) score += 10;
  if (profile.websiteUrl) score += 10;

  // Important fields (8 points each)
  if (profile.tagline) score += 8;
  if (profile.founderStory && profile.founderStory.length >= 100) score += 8;
  if (profile.heroImageUrl) score += 8;

  // Medium importance (6 points each)
  if (profile.missionStatement) score += 6;
  if (profile.headquarters) score += 6;
  if (profile.foundedYear) score += 6;

  // Nice to have (4 points each)
  if (profile.brandColorPrimary) score += 4;
  if (profile.brandColorSecondary) score += 4;
  if (profile.galleryImages && profile.galleryImages.length > 0) score += 4;
  if (profile.socialLinks) score += 4;
  if (profile.teamSize) score += 4;

  // Values (5 points, up to 3 values recommended)
  if (profile.values && profile.values.length > 0) {
    score += Math.min(profile.values.length, 3) * (5 / 3);
  }

  // Verified certifications (10 points for having at least one)
  if (
    profile.certifications &&
    profile.certifications.some(c => c.verificationStatus === 'verified')
  ) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
}

/**
 * Validate that profile meets minimum requirements for going live
 */
export const minimumProfileRequirements = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  logoUrl: z.string().url('Logo is required'),
  websiteUrl: z.string().url('Website URL is required'),
  founderStory: z.string().min(100, 'Founder story must be at least 100 characters'),
  values: z.array(z.nativeEnum(VendorValue)).min(3, 'Select at least 3 values'),
});

export type MinimumProfileRequirements = z.infer<typeof minimumProfileRequirements>;

// ──────────────────────────────────────────────────────────────
// VENDOR APPLICATION SCHEMAS (Sprint A.2)
// ──────────────────────────────────────────────────────────────

/**
 * Vendor Application Submission Input
 * For vendors applying to join the marketplace
 */
export const submitVendorApplicationSchema = z.object({
  // Contact Information
  contactFirstName: z
    .string()
    .min(2, 'First name must be at least 2 characters')
    .max(100, 'First name cannot exceed 100 characters')
    .trim(),

  contactLastName: z
    .string()
    .min(2, 'Last name must be at least 2 characters')
    .max(100, 'Last name cannot exceed 100 characters')
    .trim(),

  contactEmail: z
    .string()
    .email('Must be a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .trim(),

  contactPhone: z
    .string()
    .max(50, 'Phone number cannot exceed 50 characters')
    .trim()
    .optional()
    .nullable(),

  contactRole: z
    .string()
    .min(2, 'Role must be at least 2 characters')
    .max(100, 'Role cannot exceed 100 characters')
    .trim(),

  // Company Information
  brandName: z
    .string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(255, 'Brand name cannot exceed 255 characters')
    .trim(),

  legalName: z
    .string()
    .min(2, 'Legal name must be at least 2 characters')
    .max(255, 'Legal name cannot exceed 255 characters')
    .trim(),

  website: httpUrlSchema,

  yearFounded: foundedYearSchema,

  headquarters: z
    .string()
    .min(2, 'Headquarters must be at least 2 characters')
    .max(255, 'Headquarters cannot exceed 255 characters')
    .trim(),

  employeeCount: z
    .string()
    .min(1, 'Employee count is required')
    .max(50, 'Employee count cannot exceed 50 characters')
    .trim(),

  annualRevenue: z
    .string()
    .max(50, 'Annual revenue cannot exceed 50 characters')
    .trim()
    .optional()
    .nullable(),

  // Product Information
  productCategories: z
    .array(z.string().min(1))
    .min(1, 'Select at least one product category')
    .max(10, 'Cannot select more than 10 product categories'),

  skuCount: z
    .string()
    .min(1, 'SKU count is required')
    .max(50, 'SKU count cannot exceed 50 characters')
    .trim(),

  priceRange: z
    .string()
    .min(1, 'Price range is required')
    .max(50, 'Price range cannot exceed 50 characters')
    .trim(),

  targetMarket: z
    .array(z.string().min(1))
    .min(1, 'Select at least one target market')
    .max(10, 'Cannot select more than 10 target markets'),

  currentDistribution: z
    .array(z.string().min(1))
    .max(10, 'Cannot list more than 10 distribution channels')
    .optional()
    .nullable(),

  // Values & Certifications
  values: z
    .array(z.nativeEnum(VendorValue))
    .min(3, 'Select at least 3 values that describe your brand')
    .max(10, 'Cannot select more than 10 values'),

  certifications: z
    .array(z.nativeEnum(CertificationType))
    .max(10, 'Cannot list more than 10 certifications')
    .optional()
    .nullable(),

  // Why Jade
  whyJade: z
    .string()
    .min(100, 'Please provide at least 100 characters explaining why you want to join Jade')
    .max(2000, 'Why Jade cannot exceed 2000 characters')
    .trim(),

  // Documents (optional at submission, can be added later)
  productCatalogUrl: httpUrlSchema.optional().nullable(),
  lineSheetUrl: httpUrlSchema.optional().nullable(),
  insuranceCertificateUrl: httpUrlSchema.optional().nullable(),
  businessLicenseUrl: httpUrlSchema.optional().nullable(),
});

export type SubmitVendorApplicationInput = z.infer<typeof submitVendorApplicationSchema>;

/**
 * Application Review Decision Input
 * For admin reviewers making decisions on applications
 */
export const applicationReviewDecisionSchema = z.object({
  applicationId: z.string().uuid('Application ID must be a valid UUID'),

  decision: z.enum(['approve', 'conditionally_approve', 'reject', 'request_info'], {
    errorMap: () => ({ message: 'Invalid review decision' }),
  }),

  decisionNote: z
    .string()
    .max(2000, 'Decision note cannot exceed 2000 characters')
    .trim()
    .optional(),

  rejectionReason: z
    .string()
    .min(20, 'Rejection reason must be at least 20 characters')
    .max(1000, 'Rejection reason cannot exceed 1000 characters')
    .trim()
    .optional(),

  approvalConditions: z
    .array(z.string().min(10))
    .max(10, 'Cannot have more than 10 approval conditions')
    .optional(),
});

export type ApplicationReviewDecisionInput = z.infer<typeof applicationReviewDecisionSchema>;

// ──────────────────────────────────────────────────────────────
// ONBOARDING SCHEMAS (Sprint A.2)
// ──────────────────────────────────────────────────────────────

/**
 * Complete Onboarding Step Input
 * For vendors completing onboarding checklist items
 */
export const completeOnboardingStepSchema = z.object({
  stepId: z.string().uuid('Step ID must be a valid UUID'),

  data: z.record(z.any()).optional(),
});

export type CompleteOnboardingStepInput = z.infer<typeof completeOnboardingStepSchema>;

/**
 * Skip Onboarding Step Input
 * For vendors skipping optional onboarding steps
 */
export const skipOnboardingStepSchema = z.object({
  stepId: z.string().uuid('Step ID must be a valid UUID'),
});

export type SkipOnboardingStepInput = z.infer<typeof skipOnboardingStepSchema>;

/**
 * Validate that onboarding is complete
 */
export const completeOnboardingRequirements = z.object({
  completedSteps: z.number().min(6, 'At least 6 required steps must be completed'),
  percentComplete: z.number().min(100, 'All required steps must be completed'),
});
