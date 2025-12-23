/**
 * Product-related types
 */

export enum SkinType {
  NORMAL = 'NORMAL',
  DRY = 'DRY',
  OILY = 'OILY',
  COMBINATION = 'COMBINATION',
  SENSITIVE = 'SENSITIVE',
}

export enum TimeOfDay {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  BOTH = 'BOTH',
}

export enum ProductCategory {
  CLEANSER = 'CLEANSER',
  TONER = 'TONER',
  SERUM = 'SERUM',
  MOISTURIZER = 'MOISTURIZER',
  MASK = 'MASK',
  EXFOLIANT = 'EXFOLIANT',
  SUNSCREEN = 'SUNSCREEN',
  EYE_CARE = 'EYE_CARE',
  TREATMENT = 'TREATMENT',
  TOOLS = 'TOOLS',
}

export enum CompatibilityLevel {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  MODERATE = 'MODERATE',
  POOR = 'POOR',
  INCOMPATIBLE = 'INCOMPATIBLE',
}

export enum ConflictSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

/**
 * Progressive Disclosure Data Structure
 * Following SKA framework pattern
 */
export interface ProductGlance {
  heroBenefit: string;
  skinTypes: SkinType[];
  rating?: number;
  reviewCount?: number;
}

export interface ProductScan {
  ingredients: IngredientList;
  usageInstructions: UsageInstructions;
  keyActives: ActiveIngredient[];
  warnings: string[];
}

export interface ProductStudy {
  clinicalData?: ClinicalData;
  formulationScience?: string;
  contraindications: string[];
  professionalNotes?: string;
  detailedSteps: string[];
  expectedResults: string;
  timeToResults: string;
}

export interface IngredientList {
  inci: Ingredient[];
  actives: ActiveIngredient[];
  allergens: string[];
  vegan: boolean;
  crueltyFree: boolean;
}

export interface Ingredient {
  name: string;
  concentration?: number;
  function: string;
  warnings?: string[];
}

export interface ActiveIngredient {
  name: string;
  concentration: number;
  type: string;
}

export interface UsageInstructions {
  application: string;
  frequency: string;
  timeOfDay: TimeOfDay;
  patchTestRequired: boolean;
}

export interface ClinicalData {
  trials: ClinicalTrial[];
  certifications: string[];
  testReports: TestReport[];
}

export interface ClinicalTrial {
  studyName: string;
  participants: number;
  duration: string;
  results: string;
  publicationUrl?: string;
}

export interface TestReport {
  testType: string;
  reportUrl: string;
  testedAt: string;
}
