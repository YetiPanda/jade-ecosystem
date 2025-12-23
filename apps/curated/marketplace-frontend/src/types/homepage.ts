/**
 * Homepage Type Definitions
 *
 * Feature: 008-homepage-integration
 *
 * TypeScript interfaces for homepage components and data
 */

/**
 * Brand information for BrandStrip component
 */
export interface Brand {
  id: string;
  name: string;
  logo: string;
}

/**
 * Product information for ProductGrid component
 */
export interface HomePageProduct {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  image: string;
  price: number;
  currencyCode: string;
  rating?: number;
  reviewCount?: number;
  heroBenefit?: string;
}

/**
 * GraphQL response types - Updated for JADE backend with Progressive Disclosure
 */

export interface Money {
  amount: number;
  currency: string;
}

export interface ProductGlanceData {
  heroBenefit: string;
  skinTypes: string[];
  rating: number | null;
  reviewCount: number | null;
  price: Money;
  thumbnail: string | null;
}

export interface ActiveIngredient {
  name: string;
  concentration: number;
  type: string;
}

export interface Ingredient {
  name: string;
  concentration?: number | null;
  function: string;
}

export interface IngredientList {
  inci: Ingredient[];
  actives: ActiveIngredient[];
  allergens: string[];
  vegan: boolean;
  crueltyFree: boolean;
}

export interface UsageInstructions {
  application: string;
  frequency: string;
  timeOfDay: string;
  patchTestRequired: boolean;
}

export interface ProductScanData {
  keyActives: ActiveIngredient[];
  usageInstructions: UsageInstructions;
  ingredients: IngredientList;
  warnings: string[];
  images: string[];
}

export interface VendorOrganization {
  id: string;
  displayName: string;
  companyName: string;
}

export interface JADEProduct {
  id: string;
  vendureProductId: string;
  glance: ProductGlanceData;
  scan: ProductScanData;
  vendorOrganization: VendorOrganization;
  createdAt: string;
}

/**
 * GraphQL query response types
 */

export interface GetBestsellersData {
  products: JADEProduct[];
}

export interface GetNewArrivalsData {
  products: JADEProduct[];
}

export interface GetFeaturedProductsData {
  searchProducts: SearchProductsResponse;
}

export interface GetProductsByVendorData {
  productsByVendor: ProductsByVendorResponse;
}

export interface GetProductsByVendorVariables {
  vendorId: string;
  limit?: number;
}

export interface GetFeaturedProductsVariables {
  limit?: number;
}

/**
 * Editorial content type
 */
export interface EditorialContent {
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  ctaText: string;
  ctaLink: string;
}

/**
 * Homepage data aggregation
 */
export interface HomepageData {
  bestsellers: HomePageProduct[];
  newArrivals: HomePageProduct[];
  featuredBrands: Brand[];
  editorial: EditorialContent;
}
