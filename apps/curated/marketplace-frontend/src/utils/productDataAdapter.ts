/**
 * Product Data Adapter
 *
 * Maps GraphQL Product types to Progressive Disclosure types
 * Handles transformation between backend data structure and frontend component requirements
 *
 * Task: Day 3 - Integration Priority 2
 */

import type {
  ProductGlanceData,
  ProductScanData,
} from '../components/products/progressive/types';

/**
 * NOTE: The following adapter functions (mapGlanceData, mapScanData, mapStudyData, adaptProductData)
 * were written for an older Product type structure that included `name`, `inStock`, `sku` properties
 * directly on the Product type. The current JADE backend GraphQL schema does not include these fields.
 *
 * These functions are DEPRECATED and should not be used.
 * Use the JADE-specific adapter functions below (mapJADEGlanceData, mapJADEScanData, adaptJADEProduct) instead.
 *
 * Keeping these here for reference only.
 */

/*
// DEPRECATED - DO NOT USE
const convertMoney = (money: Money): number => {
  return money.amount;
};

export const mapGlanceData = (product: Product): ProductGlanceData => {
  const glance = product.glance;
  return {
    id: product.id,
    name: product.name, // ERROR: Product type doesn't have 'name'
    image: glance.thumbnail || '',
    price: convertMoney(glance.price),
    heroBenefit: glance.heroBenefit,
    rating: glance.rating || 0,
    reviewCount: glance.reviewCount || 0,
    inStock: product.inStock, // ERROR: Product type doesn't have 'inStock'
  };
};

export const mapScanData = (product: Product): ProductScanData => {
  // ... (deprecated)
};

export const mapStudyData = (product: Product): ProductStudyData => {
  // ... (deprecated)
};

export const adaptProductData = (product: Product) => {
  // ... (deprecated)
};

export const hasStudyData = (product: Product): boolean => {
  return product.study !== null && product.study !== undefined;
};

export const hasScanData = (product: Product): boolean => {
  return product.scan !== null && product.scan !== undefined;
};
*/

/**
 * Adapter for JADE Backend Products (homepage integration)
 * Maps JADEProduct from homepage queries to Progressive Disclosure format
 */
import type { JADEProduct } from '../types/homepage';

/**
 * Map JADE Product glance data to Progressive ProductGlanceData
 */
export const mapJADEGlanceData = (product: JADEProduct): ProductGlanceData => {
  return {
    id: product.id,
    name: `Product ${product.id}`, // TODO: Fetch from Vendure using vendureProductId
    image: product.glance.thumbnail || 'https://via.placeholder.com/300',
    price: product.glance.price.amount,
    heroBenefit: product.glance.heroBenefit,
    rating: product.glance.rating || 0,
    reviewCount: product.glance.reviewCount || 0,
    inStock: true, // TODO: Get from inventory system
  };
};

/**
 * Map JADE Product scan data to Progressive ProductScanData
 */
export const mapJADEScanData = (product: JADEProduct): ProductScanData => {
  const glanceData = mapJADEGlanceData(product);
  const scan = product.scan;

  const brand = {
    name: product.vendorOrganization.displayName || product.vendorOrganization.companyName,
    logo: undefined,
  };

  const keyIngredients = scan.keyActives.map(active => ({
    name: active.name,
    purpose: `${active.type} - ${active.concentration}%`,
    isActive: true,
  }));

  const certifications = [];
  if (scan.ingredients.vegan) {
    certifications.push({
      name: 'Vegan',
      description: 'Contains no animal-derived ingredients',
    });
  }
  if (scan.ingredients.crueltyFree) {
    certifications.push({
      name: 'Cruelty-Free',
      description: 'Not tested on animals',
    });
  }

  const benefits = [
    glanceData.heroBenefit,
    ...scan.keyActives.slice(0, 4).map(active => `${active.name} - ${active.type}`),
  ].filter(Boolean);

  const size = { value: 50, unit: 'ml' }; // TODO: Get from product data

  return {
    ...glanceData,
    brand,
    keyIngredients,
    benefits,
    size,
    skinTypes: product.glance.skinTypes as Array<'normal' | 'dry' | 'oily' | 'combination' | 'sensitive'>,
    certifications,
    pricePerUnit: {
      value: glanceData.price / size.value,
      unit: `/${size.unit}`,
    },
  };
};

/**
 * Complete adapter for JADE Products
 */
export const adaptJADEProduct = (product: JADEProduct) => {
  return {
    glance: mapJADEGlanceData(product),
    scan: mapJADEScanData(product),
    study: null, // Study data loaded lazily on product detail page
  };
};
