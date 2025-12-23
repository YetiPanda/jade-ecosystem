/**
 * Skincare Search GraphQL Resolvers
 *
 * Resolvers for semantic skincare product search using Zilliz
 */

import {
  skincareSearchService,
  SkincareSearchFilters,
  SkincareProductResult,
  SkinProfile,
} from '../services/skincare-search.service';

/**
 * Map price tier string to enum value
 */
function mapPriceTier(tier: string): string {
  const mapping: Record<string, string> = {
    $: 'BUDGET',
    $$: 'MODERATE',
    $$$: 'PREMIUM',
    $$$$: 'LUXURY',
    BUDGET: 'BUDGET',
    MODERATE: 'MODERATE',
    PREMIUM: 'PREMIUM',
    LUXURY: 'LUXURY',
  };
  return mapping[tier] || tier;
}

/**
 * Map enum value back to price tier string for filtering
 */
function mapPriceTierToString(tier: string): string {
  const mapping: Record<string, string> = {
    BUDGET: '$',
    MODERATE: '$$',
    PREMIUM: '$$$',
    LUXURY: '$$$$',
  };
  return mapping[tier] || tier;
}

/**
 * Transform service result to GraphQL type
 */
function transformProduct(product: SkincareProductResult) {
  return {
    id: product.id,
    productName: product.productName,
    brand: product.brand,
    category: product.category,
    subcategory: product.subcategory,
    skinTypes: product.skinTypes,
    concerns: product.concerns,
    ingredients: product.ingredients,
    benefits: product.benefits,
    keyBenefits: product.keyBenefits,
    priceTier: mapPriceTier(product.priceTier),
    texture: product.texture,
    routineStep: product.routineStep,
    volume: product.volume,
    fragranceFree: product.fragranceFree,
    vegan: product.vegan,
    crueltyFree: product.crueltyFree,
    score: product.score,
  };
}

/**
 * Query resolvers for skincare search
 */
export const skincareSearchQueryResolvers = {
  /**
   * Semantic search for skincare products
   */
  searchSkincareProducts: async (
    _: any,
    {
      query,
      filters,
      limit = 10,
    }: {
      query: string;
      filters?: {
        skinTypes?: string[];
        concerns?: string[];
        category?: string;
        subcategory?: string;
        priceTier?: string;
        fragranceFree?: boolean;
        vegan?: boolean;
        crueltyFree?: boolean;
        routineStep?: string;
        texture?: string;
      };
      limit?: number;
    }
  ) => {
    try {
      // Map filters if provided
      const searchFilters: SkincareSearchFilters | undefined = filters
        ? {
            skinTypes: filters.skinTypes,
            concerns: filters.concerns,
            category: filters.category,
            subcategory: filters.subcategory,
            priceTier: filters.priceTier
              ? mapPriceTierToString(filters.priceTier)
              : undefined,
            fragranceFree: filters.fragranceFree,
            vegan: filters.vegan,
            crueltyFree: filters.crueltyFree,
            routineStep: filters.routineStep,
            texture: filters.texture,
          }
        : undefined;

      const results = await skincareSearchService.search(
        query,
        searchFilters,
        Math.min(limit, 50) // Cap at 50
      );

      return results.map(transformProduct);
    } catch (error) {
      console.error('searchSkincareProducts error:', error);
      throw new Error(
        `Failed to search skincare products: ${(error as Error).message}`
      );
    }
  },

  /**
   * Find products similar to a given product
   */
  findSimilarSkincareProducts: async (
    _: any,
    { productId, limit = 5 }: { productId: string; limit?: number }
  ) => {
    try {
      const results = await skincareSearchService.findSimilar(
        productId,
        Math.min(limit, 20) // Cap at 20
      );

      return results.map(transformProduct);
    } catch (error) {
      console.error('findSimilarSkincareProducts error:', error);
      throw new Error(
        `Failed to find similar products: ${(error as Error).message}`
      );
    }
  },

  /**
   * Get personalized product recommendations
   */
  recommendSkincareProducts: async (
    _: any,
    {
      profile,
      limit = 10,
    }: {
      profile: {
        skinType: string;
        concerns: string[];
        sensitivities?: string[];
        preferFragranceFree?: boolean;
        preferVegan?: boolean;
        budgetTier?: string;
      };
      limit?: number;
    }
  ) => {
    try {
      const skinProfile: SkinProfile = {
        skinType: profile.skinType,
        concerns: profile.concerns,
        sensitivities: profile.sensitivities,
        preferFragranceFree: profile.preferFragranceFree,
        preferVegan: profile.preferVegan,
        budgetTier: profile.budgetTier
          ? mapPriceTierToString(profile.budgetTier)
          : undefined,
      };

      const results = await skincareSearchService.recommend(
        skinProfile,
        Math.min(limit, 50)
      );

      return results.map(transformProduct);
    } catch (error) {
      console.error('recommendSkincareProducts error:', error);
      throw new Error(
        `Failed to get recommendations: ${(error as Error).message}`
      );
    }
  },

  /**
   * Get products by category
   */
  skincareProductsByCategory: async (
    _: any,
    { category, limit = 20 }: { category: string; limit?: number }
  ) => {
    try {
      const results = await skincareSearchService.getByCategory(
        category,
        Math.min(limit, 50)
      );

      return results.map(transformProduct);
    } catch (error) {
      console.error('skincareProductsByCategory error:', error);
      throw new Error(
        `Failed to get products by category: ${(error as Error).message}`
      );
    }
  },

  /**
   * Get a single product by ID
   */
  skincareProduct: async (_: any, { id }: { id: string }) => {
    try {
      const product = await skincareSearchService.getById(id);
      return product ? transformProduct(product) : null;
    } catch (error) {
      console.error('skincareProduct error:', error);
      throw new Error(
        `Failed to get skincare product: ${(error as Error).message}`
      );
    }
  },

  /**
   * Build a complete skincare routine recommendation
   */
  buildSkincareRoutine: async (
    _: any,
    {
      profile,
    }: {
      profile: {
        skinType: string;
        concerns: string[];
        sensitivities?: string[];
        preferFragranceFree?: boolean;
        preferVegan?: boolean;
        budgetTier?: string;
      };
    }
  ) => {
    try {
      const skinProfile: SkinProfile = {
        skinType: profile.skinType,
        concerns: profile.concerns,
        sensitivities: profile.sensitivities,
        preferFragranceFree: profile.preferFragranceFree,
        preferVegan: profile.preferVegan,
        budgetTier: profile.budgetTier
          ? mapPriceTierToString(profile.budgetTier)
          : undefined,
      };

      const routine = await skincareSearchService.buildRoutine(skinProfile);

      return {
        steps: routine.map((step) => ({
          step: step.step,
          products: step.products.map(transformProduct),
        })),
      };
    } catch (error) {
      console.error('buildSkincareRoutine error:', error);
      throw new Error(
        `Failed to build skincare routine: ${(error as Error).message}`
      );
    }
  },

  /**
   * Get all available categories
   */
  skincareCategories: async () => {
    return [
      'Cleansers',
      'Treatments',
      'Moisturizers',
      'Mists & Toners',
      'Masks',
    ];
  },

  /**
   * Get filter options for UI
   */
  skincareFilterOptions: async () => {
    return {
      skinTypes: [
        'Normal',
        'Dry',
        'Oily',
        'Combination',
        'Sensitive',
        'Mature',
        'Acne-Prone',
        'All',
      ],
      concerns: [
        'Acne',
        'Aging',
        'Dark Spots',
        'Dryness',
        'Dullness',
        'Fine Lines',
        'Hyperpigmentation',
        'Large Pores',
        'Oil Control',
        'Redness',
        'Sensitivity',
        'Texture',
        'Uneven Skin Tone',
        'Wrinkles',
      ],
      categories: [
        'Cleansers',
        'Treatments',
        'Moisturizers',
        'Mists & Toners',
        'Masks',
      ],
      subcategories: [
        'Gel Cleanser',
        'Cream Cleanser',
        'Foam Cleanser',
        'Oil Cleanser',
        'Micellar Water',
        'Vitamin C Serum',
        'Retinol Serum',
        'Hyaluronic Acid Serum',
        'Niacinamide Serum',
        'Peptide Serum',
        'Exfoliating Serum',
        'Gel Moisturizer',
        'Cream Moisturizer',
        'Night Cream',
        'Hydrating Mist',
        'Exfoliating Toner',
        'Sheet Mask',
        'Clay Mask',
        'Overnight Mask',
      ],
      textures: [
        'Gel',
        'Cream',
        'Foam',
        'Oil',
        'Water',
        'Serum',
        'Lotion',
        'Balm',
        'Mist',
        'Liquid',
        'Sheet',
        'Clay',
      ],
      routineSteps: ['Cleanse', 'Treat', 'Moisturize', 'Protect', 'Tone'],
      priceTiers: ['BUDGET', 'MODERATE', 'PREMIUM', 'LUXURY'],
    };
  },
};

/**
 * Combined skincare search resolvers
 */
export const skincareSearchResolvers = {
  Query: skincareSearchQueryResolvers,
};
