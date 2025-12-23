/**
 * Vendor Profile Types
 *
 * Types for vendor profile management including brand identity,
 * visual assets, values, and certifications.
 */

export interface VendorProfile {
  id: string;
  brandName: string;
  tagline?: string;
  story?: string;

  // Visual Identity
  logoUrl?: string;
  heroImageUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;

  // Social Links (JSON field)
  socialLinks?: SocialLinks;

  // Contact
  contactEmail: string;

  // Status
  isVerified: boolean;
  completenessScore: number;

  // Relations
  values: VendorValue[];
  certifications: VendorCertification[];
}

export interface SocialLinks {
  website?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedin?: string;
  tiktok?: string;
}

export enum VendorValue {
  // Sourcing & Production
  ORGANIC = 'organic',
  VEGAN = 'vegan',
  CRUELTY_FREE = 'cruelty_free',
  SUSTAINABLY_SOURCED = 'sustainably_sourced',
  FAIR_TRADE = 'fair_trade',
  HANDMADE = 'handmade',
  SMALL_BATCH = 'small_batch',

  // Ingredients
  NATURAL_INGREDIENTS = 'natural_ingredients',
  PLANT_BASED = 'plant_based',
  CLEAN_BEAUTY = 'clean_beauty',
  FRAGRANCE_FREE = 'fragrance_free',
  ESSENTIAL_OILS_ONLY = 'essential_oils_only',
  PARABEN_FREE = 'paraben_free',
  SULFATE_FREE = 'sulfate_free',

  // Business Practices
  WOMAN_OWNED = 'woman_owned',
  MINORITY_OWNED = 'minority_owned',
  FAMILY_OWNED = 'family_owned',
  CARBON_NEUTRAL = 'carbon_neutral',
  GIVES_BACK = 'gives_back',

  // Packaging
  RECYCLABLE_PACKAGING = 'recyclable_packaging',
  PLASTIC_FREE = 'plastic_free',
  REFILLABLE = 'refillable',
  MINIMAL_PACKAGING = 'minimal_packaging',

  // Origin
  MADE_IN_USA = 'made_in_usa',
  LOCAL = 'local',
}

export const VENDOR_VALUE_LABELS: Record<VendorValue, string> = {
  [VendorValue.ORGANIC]: 'Organic',
  [VendorValue.VEGAN]: 'Vegan',
  [VendorValue.CRUELTY_FREE]: 'Cruelty-Free',
  [VendorValue.SUSTAINABLY_SOURCED]: 'Sustainably Sourced',
  [VendorValue.FAIR_TRADE]: 'Fair Trade',
  [VendorValue.HANDMADE]: 'Handmade',
  [VendorValue.SMALL_BATCH]: 'Small Batch',
  [VendorValue.NATURAL_INGREDIENTS]: 'Natural Ingredients',
  [VendorValue.PLANT_BASED]: 'Plant-Based',
  [VendorValue.CLEAN_BEAUTY]: 'Clean Beauty',
  [VendorValue.FRAGRANCE_FREE]: 'Fragrance-Free',
  [VendorValue.ESSENTIAL_OILS_ONLY]: 'Essential Oils Only',
  [VendorValue.PARABEN_FREE]: 'Paraben-Free',
  [VendorValue.SULFATE_FREE]: 'Sulfate-Free',
  [VendorValue.WOMAN_OWNED]: 'Woman-Owned',
  [VendorValue.MINORITY_OWNED]: 'Minority-Owned',
  [VendorValue.FAMILY_OWNED]: 'Family-Owned',
  [VendorValue.CARBON_NEUTRAL]: 'Carbon Neutral',
  [VendorValue.GIVES_BACK]: 'Gives Back',
  [VendorValue.RECYCLABLE_PACKAGING]: 'Recyclable Packaging',
  [VendorValue.PLASTIC_FREE]: 'Plastic-Free',
  [VendorValue.REFILLABLE]: 'Refillable',
  [VendorValue.MINIMAL_PACKAGING]: 'Minimal Packaging',
  [VendorValue.MADE_IN_USA]: 'Made in USA',
  [VendorValue.LOCAL]: 'Local',
};

export enum CertificationType {
  USDA_ORGANIC = 'usda_organic',
  LEAPING_BUNNY = 'leaping_bunny',
  PETA_CRUELTY_FREE = 'peta_cruelty_free',
  VEGAN_SOCIETY = 'vegan_society',
  B_CORP = 'b_corp',
  ECOCERT = 'ecocert',
  NATRUE = 'natrue',
  COSMOS = 'cosmos',
  NSF_ORGANIC = 'nsf_organic',
  FAIR_TRADE_USA = 'fair_trade_usa',
  RAINFOREST_ALLIANCE = 'rainforest_alliance',
  ISO_14001 = 'iso_14001',
  WOMAN_OWNED_BUSINESS = 'woman_owned_business',
}

export const CERTIFICATION_TYPE_LABELS: Record<CertificationType, string> = {
  [CertificationType.USDA_ORGANIC]: 'USDA Organic',
  [CertificationType.LEAPING_BUNNY]: 'Leaping Bunny (Cruelty-Free)',
  [CertificationType.PETA_CRUELTY_FREE]: 'PETA Cruelty-Free',
  [CertificationType.VEGAN_SOCIETY]: 'Vegan Society',
  [CertificationType.B_CORP]: 'B Corporation',
  [CertificationType.ECOCERT]: 'Ecocert',
  [CertificationType.NATRUE]: 'NaTrue',
  [CertificationType.COSMOS]: 'COSMOS',
  [CertificationType.NSF_ORGANIC]: 'NSF Organic',
  [CertificationType.FAIR_TRADE_USA]: 'Fair Trade USA',
  [CertificationType.RAINFOREST_ALLIANCE]: 'Rainforest Alliance',
  [CertificationType.ISO_14001]: 'ISO 14001',
  [CertificationType.WOMAN_OWNED_BUSINESS]: 'Women-Owned Business',
};

export interface VendorCertification {
  id: string;
  type: CertificationType;
  certificationNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  documentUrl?: string;
  isVerified: boolean;
}

export interface UpdateVendorProfileInput {
  brandName?: string;
  tagline?: string;
  story?: string;
  logoUrl?: string;
  heroImageUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  socialLinks?: SocialLinks;
  contactEmail?: string;
}

export interface AddVendorValueInput {
  value: VendorValue;
}

export interface RemoveVendorValueInput {
  value: VendorValue;
}

export interface AddCertificationInput {
  type: CertificationType;
  certificationNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  documentUrl?: string;
}

export interface UpdateCertificationInput {
  id: string;
  certificationNumber?: string;
  issuedDate?: string;
  expiryDate?: string;
  documentUrl?: string;
}
