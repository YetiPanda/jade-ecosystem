/**
 * Homepage Data Transforms
 *
 * Feature: 008-homepage-integration
 *
 * Utilities to transform GraphQL responses to component props
 */

import type { ProductData, HomePageProduct, JADEProduct } from '../types/homepage';
import type { GridProduct } from '../components/home/ProductGrid';

/**
 * Transform GraphQL ProductData to GridProduct for ProductGrid component
 */
export function transformToGridProduct(productData: ProductData): GridProduct {
  const { product, glance, pricingTiers } = productData;

  // Get base price (first tier or lowest tier)
  const basePrice = pricingTiers.length > 0 ? pricingTiers[0].unitPrice / 100 : 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: product.featuredAsset?.preview || '/placeholder-product.jpg',
    price: basePrice,
    currencyCode: 'USD',
    rating: glance.rating ?? undefined,
    reviewCount: glance.reviewCount,
    heroBenefit: glance.heroBenefit,
  };
}

/**
 * Transform array of ProductData to GridProduct array
 */
export function transformProductsToGrid(products: ProductData[]): GridProduct[] {
  return products.map(transformToGridProduct);
}

/**
 * Transform GraphQL ProductData to HomePageProduct
 */
export function transformToHomePageProduct(productData: ProductData): HomePageProduct {
  const { product, glance, pricingTiers } = productData;

  // Get base price (first tier or lowest tier)
  const basePrice = pricingTiers.length > 0 ? pricingTiers[0].unitPrice / 100 : 0;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    image: product.featuredAsset?.preview || '/placeholder-product.jpg',
    price: basePrice,
    currencyCode: 'USD',
    rating: glance.rating ?? undefined,
    reviewCount: glance.reviewCount,
    heroBenefit: glance.heroBenefit,
  };
}

/**
 * Featured brands data using actual brand logos from /public/assets/brands/
 * Using real spa brand logos (temporary until backend provides vendor/brand data)
 * Brands are duplicated to enable smooth carousel scrolling
 */
export function getMockFeaturedBrands() {
  const baseBrands = [
    {
      id: '1',
      name: 'Circadia',
      logo: '/assets/brands/circadia-logo-mp8WB305JNfr4Z1j.avif',
    },
    {
      id: '2',
      name: 'Eminence',
      logo: '/assets/brands/eminence-AzGXajnbNnHkNyWy.avif',
    },
    {
      id: '3',
      name: 'Epicuren',
      logo: '/assets/brands/epicuren-logo-mp8WB305qRh8oxzD.avif',
    },
    {
      id: '4',
      name: 'HydraFacial',
      logo: '/assets/brands/hydrafacial-m2W8OB6V85u5Grv8.avif',
    },
    {
      id: '5',
      name: 'LightStim',
      logo: '/assets/brands/lightstim-Yan1e6DGz3cXB9aW.avif',
    },
    {
      id: '6',
      name: 'Lira Clinical',
      logo: '/assets/brands/lira-m6LZVP5NXOIeOxg7.avif',
    },
    {
      id: '7',
      name: 'Circadia',
      logo: '/assets/brands/circadia_logo-m5KLVG882KuP6JBG.avif',
    },
  ];

  // Duplicate brands for smoother carousel experience
  return [
    ...baseBrands,
    ...baseBrands.map((brand, index) => ({
      ...brand,
      id: `${brand.id}-dup-${index}`,
    })),
  ];
}

/**
 * Mock bestselling products using actual Circadia product images
 * Updated to JADEProduct format for Progressive Disclosure
 */
export function getMockBestsellers(): JADEProduct[] {
  return [
    {
      id: 'mock-circadia-1',
      vendureProductId: 'vendure-circadia-1',
      glance: {
        heroBenefit: 'Brightens & evens skin tone with powerful antioxidants',
        skinTypes: ['normal', 'dry', 'combination'],
        rating: 4.8,
        reviewCount: 156,
        price: {
          amount: 89.00,
          currency: 'USD'
        },
        thumbnail: '/assets/products/Circadia/VITAMIN_C_REVERSAL_SERUM_34b76eca-5b54-4d45-90be-a91ccc96371c.webp'
      },
      scan: {
        keyActives: [
          { name: 'Vitamin C (L-Ascorbic Acid)', concentration: 15, type: 'Antioxidant' },
          { name: 'Vitamin E', concentration: 5, type: 'Antioxidant' },
          { name: 'Ferulic Acid', concentration: 1, type: 'Stabilizer' }
        ],
        usageInstructions: {
          application: 'Apply 3-4 drops to clean, dry skin morning and evening',
          frequency: 'Daily',
          timeOfDay: 'Morning & Evening',
          patchTestRequired: true
        },
        ingredients: {
          inci: [
            { name: 'Water', concentration: null, function: 'Solvent' },
            { name: 'L-Ascorbic Acid', concentration: 15, function: 'Antioxidant' },
            { name: 'Tocopherol', concentration: 5, function: 'Antioxidant' }
          ],
          actives: [
            { name: 'Vitamin C (L-Ascorbic Acid)', concentration: 15, type: 'Antioxidant' },
            { name: 'Vitamin E', concentration: 5, type: 'Antioxidant' }
          ],
          allergens: [],
          vegan: true,
          crueltyFree: true
        },
        warnings: ['For external use only', 'Avoid direct contact with eyes'],
        images: ['/assets/products/Circadia/VITAMIN_C_REVERSAL_SERUM_34b76eca-5b54-4d45-90be-a91ccc96371c.webp']
      },
      vendorOrganization: {
        id: 'circadia-org',
        displayName: 'Circadia',
        companyName: 'Circadia Skincare LLC'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-circadia-2',
      vendureProductId: 'vendure-circadia-2',
      glance: {
        heroBenefit: 'Deep hydration for all skin types with aquaporin technology',
        skinTypes: ['normal', 'dry', 'sensitive'],
        rating: 4.9,
        reviewCount: 203,
        price: {
          amount: 74.00,
          currency: 'USD'
        },
        thumbnail: '/assets/products/Circadia/aquaporin-hydrating-cream-circadia-1.webp'
      },
      scan: {
        keyActives: [
          { name: 'Aquaporin-3', concentration: 3, type: 'Hydrator' },
          { name: 'Hyaluronic Acid', concentration: 2, type: 'Humectant' },
          { name: 'Squalane', concentration: 5, type: 'Emollient' }
        ],
        usageInstructions: {
          application: 'Apply to clean skin, gently massage until absorbed',
          frequency: 'Twice daily',
          timeOfDay: 'Morning & Evening',
          patchTestRequired: false
        },
        ingredients: {
          inci: [
            { name: 'Water', concentration: null, function: 'Solvent' },
            { name: 'Aquaporin-3', concentration: 3, function: 'Cellular hydration' },
            { name: 'Sodium Hyaluronate', concentration: 2, function: 'Hydration' }
          ],
          actives: [
            { name: 'Aquaporin-3', concentration: 3, type: 'Hydrator' },
            { name: 'Hyaluronic Acid', concentration: 2, type: 'Humectant' }
          ],
          allergens: [],
          vegan: true,
          crueltyFree: true
        },
        warnings: ['For external use only'],
        images: ['/assets/products/Circadia/aquaporin-hydrating-cream-circadia-1.webp']
      },
      vendorOrganization: {
        id: 'circadia-org',
        displayName: 'Circadia',
        companyName: 'Circadia Skincare LLC'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-circadia-3',
      vendureProductId: 'vendure-circadia-3',
      glance: {
        heroBenefit: 'Gentle exfoliation with honey and natural enzymes',
        skinTypes: ['normal', 'oily', 'combination'],
        rating: 4.7,
        reviewCount: 128,
        price: {
          amount: 42.00,
          currency: 'USD'
        },
        thumbnail: '/assets/products/Circadia/MICRO-EXFOLIATING_HONEY_CLEANSER.webp'
      },
      scan: {
        keyActives: [
          { name: 'Honey Extract', concentration: 10, type: 'Humectant' },
          { name: 'Papain Enzyme', concentration: 2, type: 'Exfoliant' },
          { name: 'Jojoba Beads', concentration: 5, type: 'Physical Exfoliant' }
        ],
        usageInstructions: {
          application: 'Massage onto damp skin in circular motions, rinse thoroughly',
          frequency: '2-3 times weekly',
          timeOfDay: 'Evening',
          patchTestRequired: false
        },
        ingredients: {
          inci: [
            { name: 'Water', concentration: null, function: 'Solvent' },
            { name: 'Mel (Honey)', concentration: 10, function: 'Humectant' },
            { name: 'Papain', concentration: 2, function: 'Enzymatic exfoliation' }
          ],
          actives: [
            { name: 'Honey Extract', concentration: 10, type: 'Humectant' },
            { name: 'Papain Enzyme', concentration: 2, type: 'Exfoliant' }
          ],
          allergens: ['Honey (not suitable for vegans)'],
          vegan: false,
          crueltyFree: true
        },
        warnings: ['Avoid eye area', 'Discontinue if irritation occurs'],
        images: ['/assets/products/Circadia/MICRO-EXFOLIATING_HONEY_CLEANSER.webp']
      },
      vendorOrganization: {
        id: 'circadia-org',
        displayName: 'Circadia',
        companyName: 'Circadia Skincare LLC'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-circadia-4',
      vendureProductId: 'vendure-circadia-4',
      glance: {
        heroBenefit: 'Broad spectrum SPF 30 protection with antioxidants',
        skinTypes: ['normal', 'dry', 'sensitive'],
        rating: 4.6,
        reviewCount: 94,
        price: {
          amount: 52.00,
          currency: 'USD'
        },
        thumbnail: '/assets/products/Circadia/LIGHT_DAY_SUNSCREEN.webp'
      },
      scan: {
        keyActives: [
          { name: 'Zinc Oxide', concentration: 12, type: 'Physical UV Filter' },
          { name: 'Titanium Dioxide', concentration: 8, type: 'Physical UV Filter' },
          { name: 'Green Tea Extract', concentration: 2, type: 'Antioxidant' }
        ],
        usageInstructions: {
          application: 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours.',
          frequency: 'Daily',
          timeOfDay: 'Morning',
          patchTestRequired: false
        },
        ingredients: {
          inci: [
            { name: 'Water', concentration: null, function: 'Solvent' },
            { name: 'Zinc Oxide', concentration: 12, function: 'UV protection' },
            { name: 'Titanium Dioxide', concentration: 8, function: 'UV protection' },
            { name: 'Camellia Sinensis Leaf Extract', concentration: 2, function: 'Antioxidant' }
          ],
          actives: [
            { name: 'Zinc Oxide', concentration: 12, type: 'Physical UV Filter' },
            { name: 'Titanium Dioxide', concentration: 8, type: 'Physical UV Filter' }
          ],
          allergens: [],
          vegan: true,
          crueltyFree: true
        },
        warnings: ['For external use only', 'Water resistant (40 minutes)'],
        images: ['/assets/products/Circadia/LIGHT_DAY_SUNSCREEN.webp']
      },
      vendorOrganization: {
        id: 'circadia-org',
        displayName: 'Circadia',
        companyName: 'Circadia Skincare LLC'
      },
      createdAt: new Date().toISOString()
    }
  ];
}

/**
 * Mock new arrivals using actual Circadia product images
 * Updated to JADEProduct format for Progressive Disclosure
 */
export function getMockNewArrivals(): JADEProduct[] {
  return [
    {
      id: 'mock-circadia-5',
      vendureProductId: 'vendure-circadia-5',
      glance: {
        heroBenefit: 'Calms inflammation & reduces redness with peptide technology',
        skinTypes: ['sensitive', 'combination', 'dry'],
        rating: 4.9,
        reviewCount: 78,
        price: {
          amount: 95.00,
          currency: 'USD'
        },
        thumbnail: '/assets/products/Circadia/CHRONO-CALM_FACIAL_SERUM.webp'
      },
      scan: {
        keyActives: [
          { name: 'Palmitoyl Tripeptide-8', concentration: 4, type: 'Anti-inflammatory' },
          { name: 'Niacinamide', concentration: 5, type: 'Barrier Support' },
          { name: 'Bisabolol', concentration: 2, type: 'Calming Agent' }
        ],
        usageInstructions: {
          application: 'Apply 2-3 drops to clean skin, press gently into face and neck',
          frequency: 'Twice daily',
          timeOfDay: 'Morning & Evening',
          patchTestRequired: true
        },
        ingredients: {
          inci: [
            { name: 'Water', concentration: null, function: 'Solvent' },
            { name: 'Niacinamide', concentration: 5, function: 'Barrier repair' },
            { name: 'Palmitoyl Tripeptide-8', concentration: 4, function: 'Anti-inflammatory' },
            { name: 'Bisabolol', concentration: 2, function: 'Soothing' }
          ],
          actives: [
            { name: 'Palmitoyl Tripeptide-8', concentration: 4, type: 'Anti-inflammatory' },
            { name: 'Niacinamide', concentration: 5, type: 'Barrier Support' }
          ],
          allergens: [],
          vegan: true,
          crueltyFree: true
        },
        warnings: ['For external use only', 'Store in cool, dry place'],
        images: ['/assets/products/Circadia/CHRONO-CALM_FACIAL_SERUM.webp']
      },
      vendorOrganization: {
        id: 'circadia-org',
        displayName: 'Circadia',
        companyName: 'Circadia Skincare LLC'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-circadia-6',
      vendureProductId: 'vendure-circadia-6',
      glance: {
        heroBenefit: 'Gentle cleansing with nourishing almond milk and botanicals',
        skinTypes: ['dry', 'sensitive', 'normal'],
        rating: 4.7,
        reviewCount: 65,
        price: {
          amount: 38.00,
          currency: 'USD'
        },
        thumbnail: '/assets/products/Circadia/AMANDOLA_MILK_CLEANSER_87b7fa0c-552a-4787-994b-eeba1bbd7dc9.webp'
      },
      scan: {
        keyActives: [
          { name: 'Sweet Almond Milk', concentration: 8, type: 'Emollient' },
          { name: 'Chamomile Extract', concentration: 3, type: 'Soothing' },
          { name: 'Oat Kernel Extract', concentration: 2, type: 'Calming' }
        ],
        usageInstructions: {
          application: 'Massage onto dry or damp skin, remove with warm water or soft cloth',
          frequency: 'Daily',
          timeOfDay: 'Morning & Evening',
          patchTestRequired: false
        },
        ingredients: {
          inci: [
            { name: 'Water', concentration: null, function: 'Solvent' },
            { name: 'Prunus Amygdalus Dulcis (Sweet Almond) Milk', concentration: 8, function: 'Moisturizing' },
            { name: 'Chamomilla Recutita Extract', concentration: 3, function: 'Calming' }
          ],
          actives: [
            { name: 'Sweet Almond Milk', concentration: 8, type: 'Emollient' },
            { name: 'Chamomile Extract', concentration: 3, type: 'Soothing' }
          ],
          allergens: ['Tree nuts (almond)'],
          vegan: false,
          crueltyFree: true
        },
        warnings: ['Avoid if allergic to tree nuts', 'For external use only'],
        images: ['/assets/products/Circadia/AMANDOLA_MILK_CLEANSER_87b7fa0c-552a-4787-994b-eeba1bbd7dc9.webp']
      },
      vendorOrganization: {
        id: 'circadia-org',
        displayName: 'Circadia',
        companyName: 'Circadia Skincare LLC'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-circadia-7',
      vendureProductId: 'vendure-circadia-7',
      glance: {
        heroBenefit: 'Intense hydration & plumping with marshmallow root extract',
        skinTypes: ['dry', 'normal', 'sensitive'],
        rating: 4.8,
        reviewCount: 112,
        price: {
          amount: 68.00,
          currency: 'USD'
        },
        thumbnail: '/assets/products/Circadia/marshmallow-whip-hydrating-mask-circadia-1.webp'
      },
      scan: {
        keyActives: [
          { name: 'Marshmallow Root Extract', concentration: 10, type: 'Humectant' },
          { name: 'Hyaluronic Acid Complex', concentration: 3, type: 'Hydrator' },
          { name: 'Glycerin', concentration: 8, type: 'Humectant' }
        ],
        usageInstructions: {
          application: 'Apply thick layer to clean skin, leave for 10-15 minutes, rinse or tissue off',
          frequency: '2-3 times weekly',
          timeOfDay: 'Evening',
          patchTestRequired: false
        },
        ingredients: {
          inci: [
            { name: 'Water', concentration: null, function: 'Solvent' },
            { name: 'Althaea Officinalis Root Extract', concentration: 10, function: 'Hydration' },
            { name: 'Sodium Hyaluronate', concentration: 3, function: 'Moisture retention' },
            { name: 'Glycerin', concentration: 8, function: 'Humectant' }
          ],
          actives: [
            { name: 'Marshmallow Root Extract', concentration: 10, type: 'Humectant' },
            { name: 'Hyaluronic Acid Complex', concentration: 3, type: 'Hydrator' }
          ],
          allergens: [],
          vegan: true,
          crueltyFree: true
        },
        warnings: ['For external use only', 'Avoid eye area'],
        images: ['/assets/products/Circadia/marshmallow-whip-hydrating-mask-circadia-1.webp']
      },
      vendorOrganization: {
        id: 'circadia-org',
        displayName: 'Circadia',
        companyName: 'Circadia Skincare LLC'
      },
      createdAt: new Date().toISOString()
    },
    {
      id: 'mock-circadia-8',
      vendureProductId: 'vendure-circadia-8',
      glance: {
        heroBenefit: 'Refreshing antioxidant mist with blueberry & white tea extracts',
        skinTypes: ['normal', 'oily', 'combination', 'sensitive'],
        rating: 4.6,
        reviewCount: 89,
        price: {
          amount: 44.00,
          currency: 'USD'
        },
        thumbnail: '/assets/products/Circadia/blueberry-and-white-tea-hydrating-mist-circadia-1.webp'
      },
      scan: {
        keyActives: [
          { name: 'Blueberry Extract', concentration: 5, type: 'Antioxidant' },
          { name: 'White Tea Extract', concentration: 4, type: 'Antioxidant' },
          { name: 'Aloe Vera', concentration: 3, type: 'Soothing' }
        ],
        usageInstructions: {
          application: 'Mist over face and neck after cleansing or throughout the day for refreshment',
          frequency: 'As needed',
          timeOfDay: 'Anytime',
          patchTestRequired: false
        },
        ingredients: {
          inci: [
            { name: 'Water', concentration: null, function: 'Solvent' },
            { name: 'Vaccinium Myrtillus Fruit Extract', concentration: 5, function: 'Antioxidant protection' },
            { name: 'Camellia Sinensis (White Tea) Leaf Extract', concentration: 4, function: 'Antioxidant' },
            { name: 'Aloe Barbadensis Leaf Juice', concentration: 3, function: 'Hydration & soothing' }
          ],
          actives: [
            { name: 'Blueberry Extract', concentration: 5, type: 'Antioxidant' },
            { name: 'White Tea Extract', concentration: 4, type: 'Antioxidant' }
          ],
          allergens: [],
          vegan: true,
          crueltyFree: true
        },
        warnings: ['For external use only', 'Close eyes when spraying'],
        images: ['/assets/products/Circadia/blueberry-and-white-tea-hydrating-mist-circadia-1.webp']
      },
      vendorOrganization: {
        id: 'circadia-org',
        displayName: 'Circadia',
        companyName: 'Circadia Skincare LLC'
      },
      createdAt: new Date().toISOString()
    }
  ];
}

/**
 * Editorial content (static for now)
 * Can be moved to CMS or backend in future
 */
export function getEditorialContent() {
  return {
    title: 'Discover Our Curated Collection',
    description:
      'Explore premium skincare products hand-selected from leading spa brands around the world. Every product meets our rigorous standards for quality, efficacy, and ingredient transparency.',
    image: '/assets/editorial/curated-collection.jpg',
    imageAlt: 'Curated collection of premium skincare products',
    ctaText: 'Explore Collection',
    ctaLink: '/app/marketplace/products',
  };
}
