/**
 * Vendor Profile Validation Schemas
 * Feature 011: Vendor Portal MVP
 * Sprint B.3: Profile Management - Task B.3.6
 *
 * Zod schemas for validating vendor profile inputs
 */

import { z } from 'zod';

// ──────────────────────────────────────────────────────────────
// ENUMS
// ──────────────────────────────────────────────────────────────

export const VendorValueSchema = z.enum([
  // Ingredient Philosophy
  'CLEAN_BEAUTY',
  'ORGANIC',
  'NATURAL',
  'VEGAN',
  'CRUELTY_FREE',
  'FRAGRANCE_FREE',
  'PARABEN_FREE',
  'SULFATE_FREE',
  // Sustainability
  'SUSTAINABLE',
  'ECO_PACKAGING',
  'REFILLABLE',
  'ZERO_WASTE',
  'CARBON_NEUTRAL',
  'REEF_SAFE',
  // Founder Identity
  'WOMAN_FOUNDED',
  'BIPOC_OWNED',
  'LGBTQ_OWNED',
  'VETERAN_OWNED',
  'FAMILY_OWNED',
  'SMALL_BATCH',
  // Specialization
  'MEDICAL_GRADE',
  'ESTHETICIAN_DEVELOPED',
  'DERMATOLOGIST_TESTED',
  'CLINICAL_RESULTS',
  'PROFESSIONAL_ONLY',
]);

export const CertificationTypeSchema = z.enum([
  'USDA_ORGANIC',
  'ECOCERT',
  'COSMOS_ORGANIC',
  'COSMOS_NATURAL',
  'LEAPING_BUNNY',
  'PETA_CERTIFIED',
  'B_CORP',
  'FAIR_TRADE',
  'FSC_CERTIFIED',
  'MADE_SAFE',
  'EWG_VERIFIED',
  'WOMEN_OWNED_WBENC',
  'MINORITY_OWNED_NMSDC',
]);

export const TeamSizeSchema = z.enum([
  'SOLO',
  'TWO_TO_TEN',
  'ELEVEN_TO_FIFTY',
  'FIFTY_ONE_TO_TWO_HUNDRED',
  'TWO_HUNDRED_PLUS',
]);

// ──────────────────────────────────────────────────────────────
// HELPER SCHEMAS
// ──────────────────────────────────────────────────────────────

const urlSchema = z.string().url('Must be a valid URL').max(500, 'URL too long');

const hexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g., #FF5733)')
  .length(7, 'Hex color must be exactly 7 characters (#RRGGBB)');

const yearSchema = z
  .number()
  .int('Year must be an integer')
  .min(1800, 'Founded year must be after 1800')
  .max(new Date().getFullYear(), 'Founded year cannot be in the future');

export const SocialLinksSchema = z.object({
  instagram: urlSchema.optional(),
  facebook: urlSchema.optional(),
  tiktok: urlSchema.optional(),
  linkedin: urlSchema.optional(),
}).strict();

// ──────────────────────────────────────────────────────────────
// PROFILE INPUT SCHEMAS
// ──────────────────────────────────────────────────────────────

export const CreateVendorProfileInputSchema = z.object({
  vendorId: z.string().uuid('Vendor ID must be a valid UUID').min(1, 'Vendor ID is required'),
  brandName: z.string().min(2, 'Brand name must be at least 2 characters').max(255, 'Brand name too long'),
});

export const UpdateVendorProfileInputSchema = z.object({
  // Brand Identity
  brandName: z.string().min(2, 'Brand name must be at least 2 characters').max(255, 'Brand name too long').optional(),
  tagline: z.string().max(200, 'Tagline too long (max 200 characters)').optional(),
  founderStory: z.string().max(2000, 'Founder story too long (max 2000 characters)').optional(),
  missionStatement: z.string().max(500, 'Mission statement too long (max 500 characters)').optional(),
  brandVideoUrl: urlSchema.optional(),

  // Visual Identity
  logoUrl: urlSchema.optional(),
  heroImageUrl: urlSchema.optional(),
  brandColorPrimary: hexColorSchema.optional(),
  brandColorSecondary: hexColorSchema.optional(),
  galleryImages: z.array(urlSchema).max(10, 'Maximum 10 gallery images allowed').optional(),

  // Contact & Links
  websiteUrl: urlSchema.optional(),
  socialLinks: SocialLinksSchema.optional(),

  // Business Info
  foundedYear: yearSchema.optional(),
  headquarters: z.string().max(255, 'Headquarters location too long').optional(),
  teamSize: TeamSizeSchema.optional(),

  // Values
  values: z.array(VendorValueSchema).max(25, 'Cannot select more than 25 values').optional(),
}).strict();

export const AddCertificationInputSchema = z.object({
  type: CertificationTypeSchema,
  certificateNumber: z.string().max(100, 'Certificate number too long').optional(),
  expirationDate: z.string().datetime('Must be a valid ISO date').optional(),
  documentUrl: urlSchema,
  issuingBody: z.string().min(1, 'Issuing body is required').max(255, 'Issuing body name too long'),
}).strict();

export const RemoveCertificationInputSchema = z.object({
  certificationId: z.string().uuid('Certification ID must be a valid UUID'),
});

// ──────────────────────────────────────────────────────────────
// VALIDATION FUNCTIONS
// ──────────────────────────────────────────────────────────────

export function validateUpdateVendorProfile(input: unknown) {
  return UpdateVendorProfileInputSchema.parse(input);
}

export function validateAddCertification(input: unknown) {
  return AddCertificationInputSchema.parse(input);
}

export function validateRemoveCertification(input: unknown) {
  return RemoveCertificationInputSchema.parse(input);
}

// ──────────────────────────────────────────────────────────────
// TYPE EXPORTS (for TypeScript)
// ──────────────────────────────────────────────────────────────

export type VendorValue = z.infer<typeof VendorValueSchema>;
export type CertificationType = z.infer<typeof CertificationTypeSchema>;
export type TeamSize = z.infer<typeof TeamSizeSchema>;
export type SocialLinks = z.infer<typeof SocialLinksSchema>;
export type CreateVendorProfileInput = z.infer<typeof CreateVendorProfileInputSchema>;
export type UpdateVendorProfileInput = z.infer<typeof UpdateVendorProfileInputSchema>;
export type AddCertificationInput = z.infer<typeof AddCertificationInputSchema>;
export type RemoveCertificationInput = z.infer<typeof RemoveCertificationInputSchema>;
