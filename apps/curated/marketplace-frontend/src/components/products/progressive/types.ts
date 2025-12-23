/**
 * Progressive Disclosure Pattern - Type Definitions
 *
 * Based on SKA (Semantic Knowledge Atoms) framework principles:
 * - Glance: 3 seconds - Quick scanning, hero information
 * - Scan: 30 seconds - Detailed evaluation, key facts
 * - Study: 5+ minutes - Deep analysis, comprehensive data
 */

import { ReactNode } from 'react';

/**
 * Progressive disclosure levels
 */
export type ProgressiveLevel = 'glance' | 'scan' | 'study';

/**
 * Transition state for animations
 */
export interface TransitionState {
  isTransitioning: boolean;
  previousLevel: ProgressiveLevel | null;
  currentLevel: ProgressiveLevel;
}

/**
 * Progressive content component props (generic)
 */
export interface ProgressiveContentProps<T> {
  /** The data to display */
  data: T;
  /** Renderer for glance level (3 second view) */
  glanceRenderer: (data: T) => ReactNode;
  /** Renderer for scan level (30 second view) */
  scanRenderer: (data: T) => ReactNode;
  /** Renderer for study level (5+ minute view) */
  studyRenderer: (data: T) => ReactNode;
  /** Initial disclosure level */
  initialLevel?: ProgressiveLevel;
  /** Transition duration in milliseconds */
  transitionDuration?: number;
  /** Callback when level changes */
  onLevelChange?: (level: ProgressiveLevel) => void;
  /** Optional CSS class name */
  className?: string;
}

/**
 * Product Glance Data (3 second view)
 * What users see during quick scanning
 */
export interface ProductGlanceData {
  id: string;
  name: string;
  image: string;
  price: number;
  /** Single most important benefit (hero copy) */
  heroBenefit: string;
  /** Average rating 0-5 */
  rating: number;
  /** Number of reviews */
  reviewCount: number;
  /** Is the product in stock? */
  inStock: boolean;
}

/**
 * Product Scan Data (30 second view)
 * Detailed information for evaluation
 */
export interface ProductScanData extends ProductGlanceData {
  /** Brand information */
  brand: {
    name: string;
    logo?: string;
  };
  /** Key ingredients (top 5) */
  keyIngredients: Array<{
    name: string;
    purpose: string;
    isActive: boolean;
  }>;
  /** Suitable skin types */
  skinTypes: Array<'normal' | 'dry' | 'oily' | 'combination' | 'sensitive'>;
  /** Certifications and badges */
  certifications: Array<{
    name: string;
    icon?: string;
    description: string;
  }>;
  /** Volume/Size information */
  size: {
    value: number;
    unit: string;
  };
  /** Price per unit for comparison */
  pricePerUnit?: {
    value: number;
    unit: string;
  };
  /** Quick benefits list (3-5 items) */
  benefits: string[];
}

/**
 * Product Study Data (5+ minute deep dive)
 * Comprehensive clinical and scientific data
 */
export interface ProductStudyData extends ProductScanData {
  /** Full description */
  description: string;
  /** Complete ingredient list */
  fullIngredientList: Array<{
    name: string;
    inci: string; // International Nomenclature of Cosmetic Ingredients
    percentage?: number;
    purpose: string;
    isActive: boolean;
  }>;
  /** Clinical studies and efficacy data */
  clinicalData?: {
    studies: Array<{
      title: string;
      summary: string;
      methodology?: string;
      results: string;
      source?: string;
    }>;
    efficacyMetrics?: Array<{
      claim: string;
      improvement: number;
      unit: string;
      timeframe: string;
    }>;
  };
  /** Usage instructions */
  usage: {
    frequency: string;
    instructions: string;
    tips?: string[];
    warnings?: string[];
  };
  /** Treatment protocols this product is part of */
  protocols?: Array<{
    id: string;
    name: string;
    role: string; // e.g., "Step 2: Active Treatment"
  }>;
  /** Safety information */
  safety?: {
    phLevel?: number;
    allergenWarnings?: string[];
    contraindications?: string[];
    pregnancySafe?: boolean;
  };
  /** Professional recommendations */
  professionalNotes?: {
    pairsWith?: string[]; // Product IDs
    avoidWith?: string[]; // Product IDs
    bestFor?: string[];
    notes?: string;
  };
  /** Vendor/SKU information */
  vendor?: {
    id: string;
    name: string;
    sku: string;
    catalogNumber?: string;
  };
}

/**
 * Hook return type for useProgressiveState
 */
export interface UseProgressiveStateReturn {
  /** Current disclosure level */
  level: ProgressiveLevel;
  /** Is currently transitioning between levels */
  isTransitioning: boolean;
  /** Transition to scan level */
  transitionToScan: () => void;
  /** Transition to study level */
  transitionToStudy: () => void;
  /** Reset to glance level */
  resetToGlance: () => void;
  /** Transition state for animations */
  transitionState: TransitionState;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Duration in milliseconds */
  duration: number;
  /** CSS easing function */
  easing: string;
  /** Delay before transition starts */
  delay?: number;
}
