/**
 * Product Validation Rules Engine
 * Week 4 Day 5: Comprehensive validation for product submissions
 */

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  completenessScore: number; // 0-100
  qualityScore: number; // 0-100
}

export interface ProductSubmissionData {
  // Product Info
  productName: string;
  brandName: string;
  description: string;
  price: number;

  // Taxonomy
  categoryId?: string;
  functionIds: string[];
  concernIds: string[];
  targetAreaIds: string[];

  // Ingredients
  ingredients: string[];
  keyActives: Array<{ name: string; concentration: number }>;

  // Usage
  usageInstructions: string;
  frequency: string;
  timeOfDay: string;
  warnings: string[];

  // Training
  trainingCompleted: boolean;
}

// Validation rules configuration
const VALIDATION_RULES = {
  productName: {
    minLength: 3,
    maxLength: 100,
    required: true,
  },
  brandName: {
    minLength: 2,
    maxLength: 50,
    required: true,
  },
  description: {
    minLength: 50,
    maxLength: 2000,
    optimalLength: 200,
    required: true,
  },
  price: {
    min: 0.01,
    max: 10000,
    required: true,
  },
  taxonomy: {
    minFunctions: 1,
    maxFunctions: 5,
    minConcerns: 1,
    maxConcerns: 8,
    minTargetAreas: 1,
    maxTargetAreas: 4,
  },
  ingredients: {
    minCount: 3,
    recommendedMinCount: 5,
  },
  keyActives: {
    minCount: 1,
    maxCount: 5,
    minConcentration: 0.01,
    maxConcentration: 100,
  },
  usageInstructions: {
    minLength: 20,
    maxLength: 1000,
    optimalLength: 100,
  },
};

/**
 * Main validation function
 */
export function validateProductSubmission(
  data: ProductSubmissionData
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Validate product info
  validateProductInfo(data, errors, warnings);

  // Validate taxonomy
  validateTaxonomy(data, errors, warnings);

  // Validate ingredients
  validateIngredients(data, errors, warnings);

  // Validate usage
  validateUsage(data, errors, warnings);

  // Validate training
  validateTraining(data, errors, warnings);

  // Calculate scores
  const completenessScore = calculateCompletenessScore(data, errors, warnings);
  const qualityScore = calculateQualityScore(data, errors, warnings);

  return {
    isValid: errors.filter((e) => e.severity === 'error').length === 0,
    errors,
    warnings,
    completenessScore,
    qualityScore,
  };
}

/**
 * Validate product information fields
 */
function validateProductInfo(
  data: ProductSubmissionData,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Product Name
  if (!data.productName || data.productName.trim().length === 0) {
    errors.push({
      field: 'productName',
      message: 'Product name is required',
      severity: 'error',
      code: 'REQUIRED_FIELD',
    });
  } else if (data.productName.length < VALIDATION_RULES.productName.minLength) {
    errors.push({
      field: 'productName',
      message: `Product name must be at least ${VALIDATION_RULES.productName.minLength} characters`,
      severity: 'error',
      code: 'MIN_LENGTH',
    });
  } else if (data.productName.length > VALIDATION_RULES.productName.maxLength) {
    errors.push({
      field: 'productName',
      message: `Product name must not exceed ${VALIDATION_RULES.productName.maxLength} characters`,
      severity: 'error',
      code: 'MAX_LENGTH',
    });
  }

  // Brand Name
  if (!data.brandName || data.brandName.trim().length === 0) {
    errors.push({
      field: 'brandName',
      message: 'Brand name is required',
      severity: 'error',
      code: 'REQUIRED_FIELD',
    });
  } else if (data.brandName.length < VALIDATION_RULES.brandName.minLength) {
    errors.push({
      field: 'brandName',
      message: `Brand name must be at least ${VALIDATION_RULES.brandName.minLength} characters`,
      severity: 'error',
      code: 'MIN_LENGTH',
    });
  }

  // Description
  if (!data.description || data.description.trim().length === 0) {
    errors.push({
      field: 'description',
      message: 'Product description is required',
      severity: 'error',
      code: 'REQUIRED_FIELD',
    });
  } else if (data.description.length < VALIDATION_RULES.description.minLength) {
    errors.push({
      field: 'description',
      message: `Description must be at least ${VALIDATION_RULES.description.minLength} characters`,
      severity: 'error',
      code: 'MIN_LENGTH',
    });
  } else if (data.description.length < VALIDATION_RULES.description.optimalLength) {
    warnings.push({
      field: 'description',
      message: 'Description is shorter than recommended',
      suggestion: `Consider providing more detail (current: ${data.description.length}, recommended: ${VALIDATION_RULES.description.optimalLength}+ characters)`,
    });
  }

  // Price
  if (data.price <= 0) {
    errors.push({
      field: 'price',
      message: 'Price must be greater than zero',
      severity: 'error',
      code: 'INVALID_VALUE',
    });
  } else if (data.price < VALIDATION_RULES.price.min) {
    errors.push({
      field: 'price',
      message: `Price must be at least $${VALIDATION_RULES.price.min}`,
      severity: 'error',
      code: 'MIN_VALUE',
    });
  } else if (data.price > VALIDATION_RULES.price.max) {
    warnings.push({
      field: 'price',
      message: 'Price is unusually high',
      suggestion: 'Please verify this is the wholesale price',
    });
  }
}

/**
 * Validate taxonomy selections
 */
function validateTaxonomy(
  data: ProductSubmissionData,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Category
  if (!data.categoryId) {
    errors.push({
      field: 'categoryId',
      message: 'Product category is required',
      severity: 'error',
      code: 'REQUIRED_FIELD',
    });
  }

  // Functions
  if (data.functionIds.length === 0) {
    errors.push({
      field: 'functionIds',
      message: 'At least one product function must be selected',
      severity: 'error',
      code: 'MIN_COUNT',
    });
  } else if (data.functionIds.length > VALIDATION_RULES.taxonomy.maxFunctions) {
    warnings.push({
      field: 'functionIds',
      message: 'Many functions selected',
      suggestion: `Consider focusing on the ${VALIDATION_RULES.taxonomy.maxFunctions} most important functions`,
    });
  }

  // Concerns
  if (data.concernIds.length === 0) {
    errors.push({
      field: 'concernIds',
      message: 'At least one skin concern must be selected',
      severity: 'error',
      code: 'MIN_COUNT',
    });
  } else if (data.concernIds.length > VALIDATION_RULES.taxonomy.maxConcerns) {
    warnings.push({
      field: 'concernIds',
      message: 'Many concerns selected',
      suggestion: `Products targeting many concerns may be less focused. Consider selecting the ${VALIDATION_RULES.taxonomy.maxConcerns} most important ones.`,
    });
  }

  // Target Areas
  if (data.targetAreaIds.length === 0) {
    errors.push({
      field: 'targetAreaIds',
      message: 'At least one target area must be selected',
      severity: 'error',
      code: 'MIN_COUNT',
    });
  }
}

/**
 * Validate ingredients
 */
function validateIngredients(
  data: ProductSubmissionData,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Ingredient list
  if (data.ingredients.length === 0) {
    errors.push({
      field: 'ingredients',
      message: 'Ingredient list is required',
      severity: 'error',
      code: 'REQUIRED_FIELD',
    });
  } else if (data.ingredients.length < VALIDATION_RULES.ingredients.minCount) {
    warnings.push({
      field: 'ingredients',
      message: 'Few ingredients listed',
      suggestion: `Most products have at least ${VALIDATION_RULES.ingredients.recommendedMinCount} ingredients. Please ensure all ingredients are listed.`,
    });
  }

  // Key actives
  if (data.keyActives.length === 0) {
    warnings.push({
      field: 'keyActives',
      message: 'No key active ingredients specified',
      suggestion: 'Adding key actives helps customers understand the product benefits',
    });
  } else {
    // Validate each active ingredient
    data.keyActives.forEach((active, index) => {
      if (!active.name || active.name.trim().length === 0) {
        errors.push({
          field: `keyActives[${index}].name`,
          message: 'Active ingredient name is required',
          severity: 'error',
          code: 'REQUIRED_FIELD',
        });
      }

      if (
        active.concentration < VALIDATION_RULES.keyActives.minConcentration ||
        active.concentration > VALIDATION_RULES.keyActives.maxConcentration
      ) {
        errors.push({
          field: `keyActives[${index}].concentration`,
          message: `Concentration must be between ${VALIDATION_RULES.keyActives.minConcentration}% and ${VALIDATION_RULES.keyActives.maxConcentration}%`,
          severity: 'error',
          code: 'INVALID_RANGE',
        });
      }
    });
  }
}

/**
 * Validate usage instructions
 */
function validateUsage(
  data: ProductSubmissionData,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  // Usage instructions
  if (!data.usageInstructions || data.usageInstructions.trim().length === 0) {
    errors.push({
      field: 'usageInstructions',
      message: 'Usage instructions are required',
      severity: 'error',
      code: 'REQUIRED_FIELD',
    });
  } else if (
    data.usageInstructions.length < VALIDATION_RULES.usageInstructions.minLength
  ) {
    errors.push({
      field: 'usageInstructions',
      message: `Usage instructions must be at least ${VALIDATION_RULES.usageInstructions.minLength} characters`,
      severity: 'error',
      code: 'MIN_LENGTH',
    });
  } else if (
    data.usageInstructions.length < VALIDATION_RULES.usageInstructions.optimalLength
  ) {
    warnings.push({
      field: 'usageInstructions',
      message: 'Usage instructions could be more detailed',
      suggestion: 'Include specific application methods and recommended amounts',
    });
  }

  // Frequency
  if (!data.frequency || data.frequency.trim().length === 0) {
    errors.push({
      field: 'frequency',
      message: 'Usage frequency is required',
      severity: 'error',
      code: 'REQUIRED_FIELD',
    });
  }

  // Time of day
  if (!data.timeOfDay || data.timeOfDay.trim().length === 0) {
    errors.push({
      field: 'timeOfDay',
      message: 'Recommended time of day is required',
      severity: 'error',
      code: 'REQUIRED_FIELD',
    });
  }

  // Warnings
  if (data.warnings.length === 0) {
    warnings.push({
      field: 'warnings',
      message: 'No warnings or precautions specified',
      suggestion: 'Consider adding any relevant warnings, allergen information, or usage precautions',
    });
  }
}

/**
 * Validate training completion
 */
function validateTraining(
  data: ProductSubmissionData,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): void {
  if (!data.trainingCompleted) {
    errors.push({
      field: 'trainingCompleted',
      message: 'Product submission training must be completed',
      severity: 'error',
      code: 'REQUIRED_TRAINING',
    });
  }
}

/**
 * Calculate completeness score (0-100)
 * Based on required and optional fields filled
 */
function calculateCompletenessScore(
  data: ProductSubmissionData,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): number {
  let score = 100;

  // Deduct points for errors
  const errorCount = errors.filter((e) => e.severity === 'error').length;
  score -= errorCount * 10;

  // Deduct points for warnings
  score -= warnings.length * 3;

  // Bonus points for optional fields
  if (data.keyActives.length > 0) score += 5;
  if (data.warnings.length > 0) score += 3;
  if (data.description.length >= VALIDATION_RULES.description.optimalLength) score += 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Calculate quality score (0-100)
 * Based on content quality and best practices
 */
function calculateQualityScore(
  data: ProductSubmissionData,
  errors: ValidationError[],
  warnings: ValidationWarning[]
): number {
  let score = 100;

  // Critical errors severely impact quality
  const criticalErrors = errors.filter((e) => e.severity === 'error').length;
  score -= criticalErrors * 15;

  // Warnings moderately impact quality
  score -= warnings.length * 5;

  // Quality bonuses
  if (data.description.length >= VALIDATION_RULES.description.optimalLength) {
    score += 10;
  }

  if (data.functionIds.length >= 2 && data.functionIds.length <= 4) {
    score += 5; // Sweet spot for function count
  }

  if (data.concernIds.length >= 2 && data.concernIds.length <= 5) {
    score += 5; // Sweet spot for concern count
  }

  if (data.keyActives.length >= 2) {
    score += 10; // Multiple key actives is good
  }

  if (data.usageInstructions.length >= VALIDATION_RULES.usageInstructions.optimalLength) {
    score += 5;
  }

  return Math.max(0, Math.min(100, score));
}

/**
 * Validate a single field
 * Useful for real-time validation as user types
 */
export function validateField(
  fieldName: keyof ProductSubmissionData,
  value: any,
  data: ProductSubmissionData
): ValidationError[] {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  switch (fieldName) {
    case 'productName':
    case 'brandName':
    case 'description':
    case 'price':
      validateProductInfo({ ...data, [fieldName]: value }, errors, warnings);
      break;
    case 'categoryId':
    case 'functionIds':
    case 'concernIds':
    case 'targetAreaIds':
      validateTaxonomy({ ...data, [fieldName]: value }, errors, warnings);
      break;
    case 'ingredients':
    case 'keyActives':
      validateIngredients({ ...data, [fieldName]: value }, errors, warnings);
      break;
    case 'usageInstructions':
    case 'frequency':
    case 'timeOfDay':
    case 'warnings':
      validateUsage({ ...data, [fieldName]: value }, errors, warnings);
      break;
  }

  return errors.filter((e) => e.field === fieldName);
}

/**
 * Get validation summary for display
 */
export function getValidationSummary(result: ValidationResult): string {
  if (result.isValid) {
    return `Product submission looks good! Completeness: ${result.completenessScore}%, Quality: ${result.qualityScore}%`;
  }

  const errorCount = result.errors.filter((e) => e.severity === 'error').length;
  const warningCount = result.warnings.length;

  return `${errorCount} error${errorCount !== 1 ? 's' : ''}, ${warningCount} warning${
    warningCount !== 1 ? 's' : ''
  }. Please address issues before submitting.`;
}
