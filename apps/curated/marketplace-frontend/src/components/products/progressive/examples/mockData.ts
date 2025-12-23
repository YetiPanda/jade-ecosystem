/**
 * Mock Product Data for Progressive Disclosure Demo
 *
 * Realistic spa product data for testing and demonstration
 */

import type { ProductStudyData } from '../types';

/**
 * Complete mock product data with all three disclosure levels
 */
export const mockProductData: ProductStudyData = {
  // Glance Level Data (3 seconds)
  id: 'prod-001',
  name: 'HydraGlow Advanced Vitamin C Serum',
  image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&h=600&fit=crop',
  price: 89.99,
  heroBenefit: 'Visibly reduces dark spots and brightens skin in 14 days',
  rating: 4.8,
  reviewCount: 1247,
  inStock: true,

  // Scan Level Data (30 seconds)
  brand: {
    name: 'DermaScience Pro',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop',
  },
  keyIngredients: [
    {
      name: 'L-Ascorbic Acid',
      purpose: 'Brightening and antioxidant protection',
      isActive: true,
    },
    {
      name: 'Ferulic Acid',
      purpose: 'Stabilizes Vitamin C and enhances efficacy',
      isActive: true,
    },
    {
      name: 'Hyaluronic Acid',
      purpose: 'Deep hydration and plumping',
      isActive: true,
    },
    {
      name: 'Niacinamide',
      purpose: 'Pore minimizing and skin barrier support',
      isActive: true,
    },
    {
      name: 'Vitamin E',
      purpose: 'Antioxidant and skin conditioning',
      isActive: false,
    },
  ],
  skinTypes: ['normal', 'dry', 'combination', 'oily'],
  certifications: [
    {
      name: 'Cruelty-Free Certified',
      icon: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=80&h=80&fit=crop',
      description: 'Never tested on animals',
    },
    {
      name: 'Dermatologist Tested',
      icon: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=80&h=80&fit=crop',
      description: 'Clinically tested for safety and efficacy',
    },
    {
      name: 'Vegan Formula',
      icon: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&h=80&fit=crop',
      description: '100% plant-based ingredients',
    },
  ],
  size: {
    value: 30,
    unit: 'ml',
  },
  pricePerUnit: {
    value: 3.00,
    unit: 'ml',
  },
  benefits: [
    'Reduces hyperpigmentation and dark spots',
    'Boosts collagen production for firmer skin',
    'Neutralizes free radicals and environmental damage',
    'Improves overall skin tone and texture',
    'Suitable for sensitive skin',
  ],

  // Study Level Data (5+ minutes)
  description: `HydraGlow Advanced Vitamin C Serum is a professional-grade antioxidant treatment
    formulated with 15% pure L-Ascorbic Acid, Ferulic Acid, and Hyaluronic Acid. This powerful
    combination delivers superior brightening, anti-aging, and protective benefits. Our
    proprietary stability technology ensures maximum potency and efficacy, while the lightweight,
    fast-absorbing formula makes it suitable for all skin types. Clinical studies show visible
    improvement in skin brightness, tone, and texture within 14 days of consistent use.`,

  fullIngredientList: [
    {
      name: 'L-Ascorbic Acid',
      inci: 'Ascorbic Acid',
      percentage: 15.0,
      purpose: 'Primary active ingredient for brightening and antioxidant protection',
      isActive: true,
    },
    {
      name: 'Ferulic Acid',
      inci: 'Ferulic Acid',
      percentage: 0.5,
      purpose: 'Stabilizes Vitamin C and doubles antioxidant protection',
      isActive: true,
    },
    {
      name: 'Hyaluronic Acid',
      inci: 'Sodium Hyaluronate',
      percentage: 2.0,
      purpose: 'Binds moisture and plumps skin',
      isActive: true,
    },
    {
      name: 'Niacinamide',
      inci: 'Niacinamide',
      percentage: 3.0,
      purpose: 'Minimizes pores and strengthens skin barrier',
      isActive: true,
    },
    {
      name: 'Vitamin E',
      inci: 'Tocopherol',
      percentage: 1.0,
      purpose: 'Synergistic antioxidant and skin conditioning',
      isActive: false,
    },
    {
      name: 'Aloe Vera Extract',
      inci: 'Aloe Barbadensis Leaf Extract',
      purpose: 'Soothes and hydrates skin',
      isActive: false,
    },
    {
      name: 'Green Tea Extract',
      inci: 'Camellia Sinensis Leaf Extract',
      purpose: 'Additional antioxidant protection',
      isActive: false,
    },
    {
      name: 'Glycerin',
      inci: 'Glycerin',
      purpose: 'Humectant and skin conditioning',
      isActive: false,
    },
    {
      name: 'Panthenol',
      inci: 'Panthenol',
      purpose: 'Soothes and moisturizes skin',
      isActive: false,
    },
    {
      name: 'Propanediol',
      inci: 'Propanediol',
      purpose: 'Solvent and humectant',
      isActive: false,
    },
  ],

  clinicalData: {
    studies: [
      {
        title: 'Efficacy Study: Hyperpigmentation Reduction',
        summary: `A 12-week double-blind, placebo-controlled study with 120 participants
          demonstrated significant reduction in hyperpigmentation and improvement in skin
          brightness with twice-daily application.`,
        methodology: 'Randomized controlled trial, n=120, 12 weeks, twice-daily application',
        results: `87% of participants showed visible reduction in dark spots. Average
          improvement in skin brightness measured at 42% using chromameter readings.`,
        source: 'Journal of Cosmetic Dermatology, 2023',
      },
      {
        title: 'Safety Assessment: Sensitive Skin Compatibility',
        summary: `Patch testing and HRIPT (Human Repeat Insult Patch Test) conducted
          with 50 participants with self-reported sensitive skin showed no adverse reactions.`,
        methodology: 'HRIPT, n=50, 6 weeks, occlusive patch application',
        results: `Zero adverse reactions reported. Product rated non-irritating and
          non-sensitizing. Safe for daily use on sensitive skin.`,
        source: 'Independent Dermatology Testing, 2023',
      },
    ],
    efficacyMetrics: [
      {
        claim: 'Reduction in dark spots',
        improvement: 87,
        unit: '%',
        timeframe: '12 weeks',
      },
      {
        claim: 'Skin brightness improvement',
        improvement: 42,
        unit: '%',
        timeframe: '12 weeks',
      },
      {
        claim: 'Collagen synthesis increase',
        improvement: 34,
        unit: '%',
        timeframe: '8 weeks',
      },
      {
        claim: 'Fine line reduction',
        improvement: 29,
        unit: '%',
        timeframe: '12 weeks',
      },
    ],
  },

  usage: {
    frequency: 'Twice daily (morning and evening)',
    instructions: `Apply 3-4 drops to clean, dry skin. Gently massage into face and neck
      until fully absorbed. Follow with moisturizer and SPF (morning application). Allow
      5 minutes for absorption before applying additional products. For optimal results,
      use consistently for at least 12 weeks.`,
    tips: [
      'Store in a cool, dark place to maintain Vitamin C stability',
      'Refrigeration can extend product shelf life',
      'Use within 6 months of opening for maximum potency',
      'Apply on slightly damp skin for better absorption',
      'Layer under sunscreen in AM for enhanced protection',
      'Can be mixed with facial oil for extra hydration',
    ],
    warnings: [
      'For external use only',
      'Avoid direct contact with eyes',
      'Discontinue use if irritation occurs',
      'Patch test recommended for first-time users',
      'May cause slight tingling sensation - this is normal',
      'Product may oxidize (turn brown) over time - this reduces efficacy',
    ],
  },

  protocols: [
    {
      id: 'protocol-brightening-001',
      name: 'Advanced Brightening Protocol',
      role: 'Step 2: Active Treatment - Morning & Evening',
    },
    {
      id: 'protocol-antiaging-001',
      name: 'Complete Anti-Aging Regimen',
      role: 'Step 3: Antioxidant Serum - Morning Application',
    },
  ],

  safety: {
    phLevel: 3.5,
    allergenWarnings: [
      'Contains botanical extracts - may cause reactions in individuals with plant allergies',
      'Ferulic acid derived from wheat - may not be suitable for gluten-sensitive individuals',
    ],
    contraindications: [
      'Do not use with other strong acids (AHA, BHA, retinol) without professional guidance',
      'Not recommended during active skin inflammation or sunburn',
      'Consult dermatologist if using prescription retinoids',
    ],
    pregnancySafe: true,
  },

  professionalNotes: {
    pairsWith: [
      'prod-hyaluronic-moisturizer-001',
      'prod-peptide-eye-cream-001',
      'prod-spf50-sunscreen-001',
    ],
    avoidWith: [
      'prod-glycolic-acid-toner-001',
      'prod-retinol-night-serum-001',
      'prod-benzoyl-peroxide-treatment-001',
    ],
    bestFor: [
      'Clients seeking to address hyperpigmentation and uneven skin tone',
      'Post-inflammatory hyperpigmentation (PIH)',
      'Sun damage and age spots',
      'Dull, lackluster complexion',
      'Preventative anti-aging care',
      'Combination treatment with professional peels',
    ],
    notes: `This is an excellent first-line treatment for hyperpigmentation. The 15%
      L-Ascorbic Acid concentration is professional-grade but gentle enough for daily use.
      The addition of Ferulic Acid significantly enhances stability and efficacy.
      Best results when paired with consistent SPF use. Consider alternating with retinol
      at night for comprehensive anti-aging benefits. The low pH (3.5) ensures optimal
      Vitamin C absorption but may cause temporary tingling - educate clients that this
      is normal. For sensitive clients, start with every-other-day application and
      gradually increase frequency.`,
  },

  vendor: {
    id: 'vendor-dermascience-001',
    name: 'DermaScience Professional',
    sku: 'DSP-VC-SERUM-30ML',
    catalogNumber: 'CAT-2023-VC-001',
  },
};

/**
 * Additional mock products for grid display
 */
export const mockProductGrid: ProductStudyData[] = [
  mockProductData,
  {
    ...mockProductData,
    id: 'prod-002',
    name: 'RetinAge Pro Night Renewal Complex',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop',
    price: 124.99,
    heroBenefit: 'Powerful retinol complex reduces wrinkles while you sleep',
    rating: 4.9,
    reviewCount: 2103,
    brand: {
      name: 'NightScience Labs',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop',
    },
  },
  {
    ...mockProductData,
    id: 'prod-003',
    name: 'AquaLift Hydrating Gel Moisturizer',
    image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&h=600&fit=crop',
    price: 64.99,
    heroBenefit: 'Lightweight gel provides 72-hour hydration for all skin types',
    rating: 4.7,
    reviewCount: 856,
    inStock: true,
    brand: {
      name: 'AquaDerm Solutions',
      logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&h=60&fit=crop',
    },
  },
];
