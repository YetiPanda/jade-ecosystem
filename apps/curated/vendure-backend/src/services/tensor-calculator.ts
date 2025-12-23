/**
 * 13D Tensor Calculator for Product Compatibility
 *
 * Generates 13-dimensional compatibility vectors based on:
 * - Ingredient profiles (pH, molecular weight, active concentration)
 * - Skin concern targeting
 * - Usage context (time of day, professional level)
 * - Product format compatibility
 */

import type { ProductTaxonomy } from '../types/product';

export interface ProductTensor {
  productId: string;
  tensor: number[]; // 13D vector
  metadata: TensorMetadata;
}

export interface TensorMetadata {
  ph_level: number;
  molecular_weight: number;
  active_concentration: number;
  lipid_solubility: number;
  water_solubility: number;
  exfoliation_strength: number;
  hydration_intensity: number;
  anti_aging_potency: number;
  brightening_efficacy: number;
  soothing_capacity: number;
  barrier_support: number;
  penetration_depth: number;
  irritation_risk: number;
}

/**
 * Calculates 13D tensor from product taxonomy and ingredient data
 */
export function calculateProductTensor(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): ProductTensor {
  // Initialize tensor with default values
  const tensor: number[] = new Array(13).fill(0);

  // Dimension 0: pH Level (normalized 0-1, where 0.5 = neutral pH 7)
  tensor[0] = estimatePHLevel(taxonomy, ingredients);

  // Dimension 1: Molecular Weight (normalized 0-1, low to high)
  tensor[1] = estimateMolecularWeight(ingredients);

  // Dimension 2: Active Concentration (normalized 0-1)
  tensor[2] = estimateActiveConcentration(taxonomy, ingredients);

  // Dimension 3: Lipid Solubility (normalized 0-1)
  tensor[3] = estimateLipidSolubility(ingredients);

  // Dimension 4: Water Solubility (normalized 0-1)
  tensor[4] = estimateWaterSolubility(taxonomy.formulation_base);

  // Dimension 5: Exfoliation Strength (normalized 0-1)
  tensor[5] = estimateExfoliationStrength(taxonomy, ingredients);

  // Dimension 6: Hydration Intensity (normalized 0-1)
  tensor[6] = estimateHydrationIntensity(taxonomy, ingredients);

  // Dimension 7: Anti-Aging Potency (normalized 0-1)
  tensor[7] = estimateAntiAgingPotency(taxonomy, ingredients);

  // Dimension 8: Brightening Efficacy (normalized 0-1)
  tensor[8] = estimateBrighteningEfficacy(taxonomy, ingredients);

  // Dimension 9: Soothing Capacity (normalized 0-1)
  tensor[9] = estimateSoothingCapacity(taxonomy, ingredients);

  // Dimension 10: Barrier Support (normalized 0-1)
  tensor[10] = estimateBarrierSupport(ingredients);

  // Dimension 11: Penetration Depth (normalized 0-1, surface to deep)
  tensor[11] = estimatePenetrationDepth(taxonomy, ingredients);

  // Dimension 12: Irritation Risk (normalized 0-1)
  tensor[12] = estimateIrritationRisk(taxonomy, ingredients);

  return {
    productId: taxonomy.product_id,
    tensor,
    metadata: {
      ph_level: tensor[0],
      molecular_weight: tensor[1],
      active_concentration: tensor[2],
      lipid_solubility: tensor[3],
      water_solubility: tensor[4],
      exfoliation_strength: tensor[5],
      hydration_intensity: tensor[6],
      anti_aging_potency: tensor[7],
      brightening_efficacy: tensor[8],
      soothing_capacity: tensor[9],
      barrier_support: tensor[10],
      penetration_depth: tensor[11],
      irritation_risk: tensor[12],
    },
  };
}

// Dimension estimation functions

function estimatePHLevel(taxonomy: ProductTaxonomy, ingredients: string[]): number {
  // Default to neutral (0.5 = pH 7)
  let ph = 0.5;

  // Check for acidic ingredients
  const acidicIngredients = [
    'glycolic acid', 'lactic acid', 'salicylic acid', 'citric acid',
    'mandelic acid', 'kojic acid', 'azelaic acid', 'vitamin c', 'ascorbic acid'
  ];

  const hasAcidic = ingredients.some(ing =>
    acidicIngredients.some(acid => ing.toLowerCase().includes(acid))
  );

  if (hasAcidic) {
    ph = 0.3; // pH ~4-5
  }

  // Check for alkaline ingredients
  const alkalineIngredients = ['sodium hydroxide', 'potassium hydroxide'];
  const hasAlkaline = ingredients.some(ing =>
    alkalineIngredients.some(base => ing.toLowerCase().includes(base))
  );

  if (hasAlkaline) {
    ph = 0.7; // pH ~8-9
  }

  return ph;
}

function estimateMolecularWeight(ingredients: string[]): number {
  // Low molecular weight ingredients penetrate deeper
  const lowMW = ['glycerin', 'hyaluronic acid', 'niacinamide', 'peptides'];
  const highMW = ['hyaluronic acid (high molecular)', 'collagen', 'elastin'];

  const hasLowMW = ingredients.some(ing =>
    lowMW.some(mw => ing.toLowerCase().includes(mw))
  );

  const hasHighMW = ingredients.some(ing =>
    highMW.some(mw => ing.toLowerCase().includes(mw))
  );

  if (hasLowMW) return 0.3;
  if (hasHighMW) return 0.8;
  return 0.5; // Medium MW
}

function estimateActiveConcentration(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): number {
  // Professional products typically have higher active concentrations
  let concentration = 0.3; // OTC baseline

  if (taxonomy.professional_level === 'PROFESSIONAL') {
    concentration = 0.6;
  } else if (taxonomy.professional_level === 'MEDICAL_GRADE') {
    concentration = 0.8;
  } else if (taxonomy.professional_level === 'IN_OFFICE_ONLY') {
    concentration = 1.0;
  }

  // Boost if strong actives are present
  const strongActives = [
    'retinol', 'tretinoin', 'hydroquinone', 'benzoyl peroxide',
    'glycolic acid', 'salicylic acid'
  ];

  const hasStrongActive = ingredients.some(ing =>
    strongActives.some(active => ing.toLowerCase().includes(active))
  );

  if (hasStrongActive) {
    concentration = Math.min(1.0, concentration + 0.2);
  }

  return concentration;
}

function estimateLipidSolubility(ingredients: string[]): number {
  const oilSolubleIngredients = [
    'retinol', 'vitamin e', 'squalane', 'jojoba oil', 'argan oil',
    'rosehip oil', 'ceramides', 'cholesterol'
  ];

  const count = ingredients.filter(ing =>
    oilSolubleIngredients.some(oil => ing.toLowerCase().includes(oil))
  ).length;

  return Math.min(1.0, count * 0.25);
}

function estimateWaterSolubility(formulationBase: string | null): number {
  if (!formulationBase) return 0.5;

  const waterBased = ['gel', 'serum', 'lotion', 'toner', 'essence'];
  const oilBased = ['oil', 'balm', 'cream'];

  if (waterBased.some(base => formulationBase.toLowerCase().includes(base))) {
    return 0.8;
  }

  if (oilBased.some(base => formulationBase.toLowerCase().includes(base))) {
    return 0.2;
  }

  return 0.5; // Emulsion
}

function estimateExfoliationStrength(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): number {
  const exfoliants = {
    strong: ['glycolic acid', 'tca peel', 'salicylic acid 2%'],
    medium: ['lactic acid', 'mandelic acid', 'salicylic acid'],
    gentle: ['pha', 'enzymes', 'fruit extract']
  };

  const hasStrong = ingredients.some(ing =>
    exfoliants.strong.some(ex => ing.toLowerCase().includes(ex))
  );

  const hasMedium = ingredients.some(ing =>
    exfoliants.medium.some(ex => ing.toLowerCase().includes(ex))
  );

  const hasGentle = ingredients.some(ing =>
    exfoliants.gentle.some(ex => ing.toLowerCase().includes(ex))
  );

  if (hasStrong) return 1.0;
  if (hasMedium) return 0.6;
  if (hasGentle) return 0.3;
  return 0.0;
}

function estimateHydrationIntensity(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): number {
  const hydrators = [
    'hyaluronic acid', 'glycerin', 'ceramides', 'squalane',
    'panthenol', 'sodium pca', 'urea', 'aloe vera'
  ];

  const count = ingredients.filter(ing =>
    hydrators.some(hyd => ing.toLowerCase().includes(hyd))
  ).length;

  return Math.min(1.0, count * 0.2);
}

function estimateAntiAgingPotency(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): number {
  const antiAging = {
    high: ['tretinoin', 'retinol', 'bakuchiol'],
    medium: ['peptides', 'vitamin c', 'niacinamide'],
    low: ['antioxidants', 'green tea', 'resveratrol']
  };

  const hasHigh = ingredients.some(ing =>
    antiAging.high.some(aa => ing.toLowerCase().includes(aa))
  );

  const hasMedium = ingredients.some(ing =>
    antiAging.medium.some(aa => ing.toLowerCase().includes(aa))
  );

  const hasLow = ingredients.some(ing =>
    antiAging.low.some(aa => ing.toLowerCase().includes(aa))
  );

  if (hasHigh) return 1.0;
  if (hasMedium) return 0.6;
  if (hasLow) return 0.3;
  return 0.0;
}

function estimateBrighteningEfficacy(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): number {
  const brightening = [
    'vitamin c', 'kojic acid', 'arbutin', 'niacinamide',
    'tranexamic acid', 'alpha arbutin', 'licorice root'
  ];

  const count = ingredients.filter(ing =>
    brightening.some(br => ing.toLowerCase().includes(br))
  ).length;

  return Math.min(1.0, count * 0.25);
}

function estimateSoothingCapacity(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): number {
  const soothing = [
    'centella asiatica', 'aloe vera', 'chamomile', 'allantoin',
    'bisabolol', 'colloidal oatmeal', 'panthenol', 'calendula'
  ];

  const count = ingredients.filter(ing =>
    soothing.some(so => ing.toLowerCase().includes(so))
  ).length;

  return Math.min(1.0, count * 0.25);
}

function estimateBarrierSupport(ingredients: string[]): number {
  const barrier = [
    'ceramides', 'cholesterol', 'fatty acids', 'niacinamide',
    'squalane', 'panthenol'
  ];

  const count = ingredients.filter(ing =>
    barrier.some(ba => ing.toLowerCase().includes(ba))
  ).length;

  return Math.min(1.0, count * 0.25);
}

function estimatePenetrationDepth(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): number {
  // Surface treatments (0.0-0.3)
  // Mid-depth (0.3-0.7)
  // Deep penetration (0.7-1.0)

  let depth = 0.3; // Default mid-depth

  // Deep penetrators
  const deepPenetrators = ['retinol', 'peptides', 'vitamin c'];
  const hasDeep = ingredients.some(ing =>
    deepPenetrators.some(dp => ing.toLowerCase().includes(dp))
  );

  if (hasDeep) depth = 0.8;

  // Surface treatments
  const surfaceTreatments = ['sunscreen', 'primer', 'makeup'];
  const hasSurface = ingredients.some(ing =>
    surfaceTreatments.some(st => ing.toLowerCase().includes(st))
  );

  if (hasSurface) depth = 0.1;

  return depth;
}

function estimateIrritationRisk(
  taxonomy: ProductTaxonomy,
  ingredients: string[]
): number {
  const irritants = {
    high: ['tretinoin', 'benzoyl peroxide', 'high concentration acids'],
    medium: ['retinol', 'glycolic acid', 'salicylic acid'],
    low: ['niacinamide', 'hyaluronic acid', 'ceramides']
  };

  const hasHigh = ingredients.some(ing =>
    irritants.high.some(ir => ing.toLowerCase().includes(ir))
  );

  const hasMedium = ingredients.some(ing =>
    irritants.medium.some(ir => ing.toLowerCase().includes(ir))
  );

  if (hasHigh) return 0.9;
  if (hasMedium) return 0.5;
  return 0.2;
}

/**
 * Calculate compatibility score between two product tensors
 * Returns a score between 0 (incompatible) and 1 (highly compatible)
 */
export function calculateCompatibilityScore(
  tensor1: number[],
  tensor2: number[]
): number {
  if (tensor1.length !== 13 || tensor2.length !== 13) {
    throw new Error('Invalid tensor dimensions. Expected 13D vectors.');
  }

  // Weighted Euclidean distance with dimension-specific weights
  const weights = [
    0.15, // pH level (very important for compatibility)
    0.05, // molecular weight
    0.10, // active concentration
    0.05, // lipid solubility
    0.05, // water solubility
    0.12, // exfoliation strength (important for layering)
    0.08, // hydration intensity
    0.08, // anti-aging potency
    0.08, // brightening efficacy
    0.08, // soothing capacity
    0.06, // barrier support
    0.05, // penetration depth
    0.15, // irritation risk (very important for safety)
  ];

  let weightedDistance = 0;

  for (let i = 0; i < 13; i++) {
    const diff = tensor1[i] - tensor2[i];
    weightedDistance += weights[i] * diff * diff;
  }

  // Convert distance to similarity score (inverse relationship)
  // Distance range: 0 (identical) to ~1.5 (very different)
  // Similarity range: 1 (identical) to 0 (very different)
  const similarity = Math.max(0, 1 - Math.sqrt(weightedDistance));

  return similarity;
}
