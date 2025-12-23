/**
 * Product Type Definitions
 */

export enum UsageTime {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  ANYTIME = 'ANYTIME',
  NIGHT_ONLY = 'NIGHT_ONLY',
  POST_TREATMENT = 'POST_TREATMENT',
}

export enum ProfessionalLevel {
  OTC = 'OTC',
  PROFESSIONAL = 'PROFESSIONAL',
  MEDICAL_GRADE = 'MEDICAL_GRADE',
  IN_OFFICE_ONLY = 'IN_OFFICE_ONLY',
}

export enum ConcernSeverity {
  MILD = 'MILD',
  MODERATE = 'MODERATE',
  SEVERE = 'SEVERE',
}

export interface ProductCategory {
  id: string;
  name: string;
  parent_id: string | null;
  level: number;
  description: string | null;
  seo_slug: string;
  display_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductFunction {
  id: string;
  name: string;
  description: string | null;
  category_compatibility: any;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface SkinConcern {
  id: string;
  name: string;
  description: string | null;
  severity_levels: any;
  related_ingredients: any;
  display_order: number;
  is_active: boolean;
  created_at: Date;
}

export interface ProductFormat {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface TargetArea {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface ProductRegion {
  id: string;
  name: string;
  country_code: string | null;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface ProductTaxonomy {
  id: string;
  product_id: string;
  category_id: string | null;
  primary_function_ids: string[] | null;
  skin_concern_ids: string[] | null;
  target_area_ids: string[] | null;
  product_format_id: string | null;
  region_id: string | null;
  usage_time: UsageTime;
  professional_level: ProfessionalLevel;
  protocol_required: boolean;
  formulation_base: string | null;
  taxonomy_completeness_score: number | null;
  last_reviewed_at: Date | null;
  reviewed_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProductExtension {
  id: string;
  vendure_product_id: string;
  brand_name: string;
  tier: string;
  clinical_validation: boolean;
  ai_certainty_score: number | null;
  created_at: Date;
  updated_at: Date;
}

// Expanded product type for GraphQL responses
export interface ProductWithTaxonomy extends ProductExtension {
  taxonomy: ProductTaxonomy | null;
  category: ProductCategory | null;
  functions: ProductFunction[];
  concerns: SkinConcern[];
  format: ProductFormat | null;
  region: ProductRegion | null;
  targetAreas: TargetArea[];
}
