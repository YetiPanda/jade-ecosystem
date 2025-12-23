/**
 * useTensorVisualization Hook
 *
 * DermaLogica Intelligence MVP - Phase 5: Ingredient Library
 *
 * Transforms tensor data for visualization:
 * - Convert raw tensor coordinates to chart-ready data
 * - Calculate differences between tensors
 * - Generate color scales
 * - Compute category scores
 * - Format labels and tooltips
 */

import { useMemo, useCallback } from 'react';

/**
 * Raw tensor coordinates (17 dimensions)
 */
export interface SkinTensorCoordinates {
  hydrationLevel: number;
  oilProduction: number;
  barrierHealth: number;
  elasticity: number;
  pigmentation: number;
  cellTurnover: number;
  inflammationLevel: number;
  antioxidantCapacity: number;
  collagenDensity: number;
  microbiomeBalance: number;
  sensitivityIndex: number;
  poreSize: number;
  surfaceTexture: number;
  photoaging: number;
  pHBalance: number;
  circulation: number;
  environmentalProtection: number;
}

/**
 * Tensor impact from ingredient
 */
export interface TensorImpact {
  dimension: string;
  impact: number;
  confidence: number;
}

/**
 * Dimension metadata
 */
export interface TensorDimensionInfo {
  key: keyof SkinTensorCoordinates;
  label: string;
  shortLabel: string;
  description: string;
  category: 'hydration' | 'aging' | 'clarity' | 'sensitivity' | 'protection';
  idealRange: { min: number; max: number };
  unit?: string;
  invertedScale?: boolean; // Higher is worse (e.g., inflammationLevel, sensitivityIndex)
}

/**
 * Chart data point for radar/bar charts
 */
export interface TensorChartDataPoint {
  dimension: string;
  label: string;
  shortLabel: string;
  value: number;
  idealMin: number;
  idealMax: number;
  category: string;
  categoryColor: string;
  status: 'optimal' | 'good' | 'warning' | 'critical';
  percentile: number;
}

/**
 * Comparison data for before/after visualization
 */
export interface TensorComparisonData {
  dimension: string;
  label: string;
  current: number;
  target: number;
  difference: number;
  improvement: boolean;
  category: string;
}

/**
 * Category summary
 */
export interface TensorCategorySummary {
  category: string;
  label: string;
  color: string;
  score: number;
  dimensions: string[];
  status: 'optimal' | 'good' | 'warning' | 'critical';
}

/**
 * Complete tensor dimension metadata
 */
const TENSOR_DIMENSIONS: TensorDimensionInfo[] = [
  // Hydration Category
  {
    key: 'hydrationLevel',
    label: 'Hydration Level',
    shortLabel: 'Hydration',
    description: 'Water content in skin cells',
    category: 'hydration',
    idealRange: { min: 60, max: 85 },
    unit: '%',
  },
  {
    key: 'barrierHealth',
    label: 'Barrier Health',
    shortLabel: 'Barrier',
    description: 'Strength of skin protective barrier',
    category: 'hydration',
    idealRange: { min: 70, max: 90 },
    unit: '%',
  },
  {
    key: 'pHBalance',
    label: 'pH Balance',
    shortLabel: 'pH',
    description: 'Acid mantle health',
    category: 'hydration',
    idealRange: { min: 65, max: 80 },
    unit: '%',
  },

  // Aging Category
  {
    key: 'elasticity',
    label: 'Elasticity',
    shortLabel: 'Elasticity',
    description: 'Skin bounce-back ability',
    category: 'aging',
    idealRange: { min: 65, max: 90 },
    unit: '%',
  },
  {
    key: 'collagenDensity',
    label: 'Collagen Density',
    shortLabel: 'Collagen',
    description: 'Structural protein levels',
    category: 'aging',
    idealRange: { min: 60, max: 85 },
    unit: '%',
  },
  {
    key: 'cellTurnover',
    label: 'Cell Turnover',
    shortLabel: 'Turnover',
    description: 'Rate of skin cell renewal',
    category: 'aging',
    idealRange: { min: 55, max: 80 },
    unit: '%',
  },
  {
    key: 'photoaging',
    label: 'Photoaging Score',
    shortLabel: 'Photo',
    description: 'Sun damage level (lower is better)',
    category: 'aging',
    idealRange: { min: 10, max: 35 },
    unit: '%',
    invertedScale: true,
  },

  // Clarity Category
  {
    key: 'pigmentation',
    label: 'Pigmentation',
    shortLabel: 'Pigment',
    description: 'Melanin distribution uniformity',
    category: 'clarity',
    idealRange: { min: 40, max: 65 },
    unit: '%',
  },
  {
    key: 'poreSize',
    label: 'Pore Size',
    shortLabel: 'Pores',
    description: 'Visible pore size (lower is better)',
    category: 'clarity',
    idealRange: { min: 20, max: 45 },
    unit: '%',
    invertedScale: true,
  },
  {
    key: 'surfaceTexture',
    label: 'Surface Texture',
    shortLabel: 'Texture',
    description: 'Skin smoothness',
    category: 'clarity',
    idealRange: { min: 65, max: 90 },
    unit: '%',
  },
  {
    key: 'oilProduction',
    label: 'Oil Production',
    shortLabel: 'Sebum',
    description: 'Sebum output level',
    category: 'clarity',
    idealRange: { min: 35, max: 55 },
    unit: '%',
  },

  // Sensitivity Category
  {
    key: 'inflammationLevel',
    label: 'Inflammation',
    shortLabel: 'Inflam',
    description: 'Inflammatory response (lower is better)',
    category: 'sensitivity',
    idealRange: { min: 10, max: 30 },
    unit: '%',
    invertedScale: true,
  },
  {
    key: 'sensitivityIndex',
    label: 'Sensitivity Index',
    shortLabel: 'Sensitive',
    description: 'Reactivity level (lower is better)',
    category: 'sensitivity',
    idealRange: { min: 15, max: 35 },
    unit: '%',
    invertedScale: true,
  },
  {
    key: 'microbiomeBalance',
    label: 'Microbiome Balance',
    shortLabel: 'Microbiome',
    description: 'Skin flora health',
    category: 'sensitivity',
    idealRange: { min: 60, max: 85 },
    unit: '%',
  },

  // Protection Category
  {
    key: 'antioxidantCapacity',
    label: 'Antioxidant Capacity',
    shortLabel: 'Antioxidant',
    description: 'Free radical defense',
    category: 'protection',
    idealRange: { min: 55, max: 80 },
    unit: '%',
  },
  {
    key: 'circulation',
    label: 'Circulation',
    shortLabel: 'Circulation',
    description: 'Blood flow to skin',
    category: 'protection',
    idealRange: { min: 60, max: 80 },
    unit: '%',
  },
  {
    key: 'environmentalProtection',
    label: 'Environmental Protection',
    shortLabel: 'Environ',
    description: 'External stressor defense',
    category: 'protection',
    idealRange: { min: 50, max: 75 },
    unit: '%',
  },
];

/**
 * Category metadata
 */
const CATEGORY_INFO: Record<
  string,
  { label: string; color: string; bgColor: string; description: string }
> = {
  hydration: {
    label: 'Hydration',
    color: '#3B82F6',
    bgColor: 'bg-blue-500',
    description: 'Moisture and barrier function',
  },
  aging: {
    label: 'Aging',
    color: '#8B5CF6',
    bgColor: 'bg-purple-500',
    description: 'Firmness and renewal',
  },
  clarity: {
    label: 'Clarity',
    color: '#10B981',
    bgColor: 'bg-emerald-500',
    description: 'Tone and texture',
  },
  sensitivity: {
    label: 'Sensitivity',
    color: '#F59E0B',
    bgColor: 'bg-amber-500',
    description: 'Reactivity and balance',
  },
  protection: {
    label: 'Protection',
    color: '#EF4444',
    bgColor: 'bg-red-500',
    description: 'Defense and repair',
  },
};

/**
 * Get status based on value relative to ideal range
 */
function getValueStatus(
  value: number,
  idealMin: number,
  idealMax: number,
  inverted: boolean = false
): 'optimal' | 'good' | 'warning' | 'critical' {
  // For inverted scales, being below the range is good
  if (inverted) {
    if (value <= idealMin) return 'optimal';
    if (value <= idealMax) return 'good';
    if (value <= idealMax * 1.5) return 'warning';
    return 'critical';
  }

  // Normal scales - within range is optimal
  if (value >= idealMin && value <= idealMax) return 'optimal';
  if (value >= idealMin * 0.8 && value <= idealMax * 1.2) return 'good';
  if (value >= idealMin * 0.5 || value <= idealMax * 1.5) return 'warning';
  return 'critical';
}

/**
 * Calculate percentile (0-100) relative to ideal range
 */
function calculatePercentile(
  value: number,
  idealMin: number,
  idealMax: number,
  inverted: boolean = false
): number {
  const idealMid = (idealMin + idealMax) / 2;
  const range = idealMax - idealMin;

  if (inverted) {
    // For inverted, lower is better - below idealMin is 100%
    if (value <= idealMin) return 100;
    if (value >= idealMax * 2) return 0;
    return Math.max(0, 100 - ((value - idealMin) / (idealMax * 2 - idealMin)) * 100);
  }

  // Normal scale - within range maps to 70-100%
  if (value >= idealMin && value <= idealMax) {
    const normalized = (value - idealMin) / range;
    return 70 + normalized * 30;
  }

  // Below range
  if (value < idealMin) {
    const deficit = idealMin - value;
    const maxDeficit = idealMin;
    return Math.max(0, 70 - (deficit / maxDeficit) * 70);
  }

  // Above range
  const excess = value - idealMax;
  const maxExcess = 100 - idealMax;
  return Math.max(0, 70 - (excess / maxExcess) * 70);
}

/**
 * Hook options
 */
export interface UseTensorVisualizationOptions {
  /** Current tensor coordinates */
  currentTensor?: SkinTensorCoordinates | null;
  /** Target/ideal tensor coordinates */
  targetTensor?: SkinTensorCoordinates | null;
  /** Tensor impacts from ingredient */
  tensorImpacts?: TensorImpact[];
  /** Dimensions to include (default: all) */
  includeDimensions?: (keyof SkinTensorCoordinates)[];
  /** Categories to include (default: all) */
  includeCategories?: string[];
}

/**
 * Hook return type
 */
export interface UseTensorVisualizationReturn {
  // Dimension metadata
  dimensions: TensorDimensionInfo[];
  categories: typeof CATEGORY_INFO;

  // Transformed data
  chartData: TensorChartDataPoint[];
  comparisonData: TensorComparisonData[];
  categorySummaries: TensorCategorySummary[];

  // Computed scores
  overallScore: number;
  categoryScores: Record<string, number>;

  // Utilities
  getDimensionInfo: (key: string) => TensorDimensionInfo | undefined;
  getCategoryColor: (category: string) => string;
  formatValue: (value: number, dimension: string) => string;
  getStatusColor: (status: 'optimal' | 'good' | 'warning' | 'critical') => string;

  // Impact analysis
  applyImpacts: (
    tensor: SkinTensorCoordinates,
    impacts: TensorImpact[]
  ) => SkinTensorCoordinates;
  predictedTensor: SkinTensorCoordinates | null;
}

/**
 * useTensorVisualization - Transform tensor data for charts
 */
export function useTensorVisualization(
  options: UseTensorVisualizationOptions = {}
): UseTensorVisualizationReturn {
  const {
    currentTensor,
    targetTensor,
    tensorImpacts = [],
    includeDimensions,
    includeCategories,
  } = options;

  // Filter dimensions based on options
  const dimensions = useMemo(() => {
    let filtered = TENSOR_DIMENSIONS;

    if (includeDimensions) {
      filtered = filtered.filter((d) => includeDimensions.includes(d.key));
    }

    if (includeCategories) {
      filtered = filtered.filter((d) => includeCategories.includes(d.category));
    }

    return filtered;
  }, [includeDimensions, includeCategories]);

  // Get dimension info helper
  const getDimensionInfo = useCallback((key: string) => {
    return TENSOR_DIMENSIONS.find((d) => d.key === key);
  }, []);

  // Get category color helper
  const getCategoryColor = useCallback((category: string) => {
    return CATEGORY_INFO[category]?.color || '#6B7280';
  }, []);

  // Format value helper
  const formatValue = useCallback((value: number, dimension: string) => {
    const info = getDimensionInfo(dimension);
    if (!info) return `${value.toFixed(0)}`;
    return `${value.toFixed(0)}${info.unit || ''}`;
  }, [getDimensionInfo]);

  // Get status color helper
  const getStatusColor = useCallback(
    (status: 'optimal' | 'good' | 'warning' | 'critical'): string => {
      switch (status) {
        case 'optimal':
          return '#10B981';
        case 'good':
          return '#3B82F6';
        case 'warning':
          return '#F59E0B';
        case 'critical':
          return '#EF4444';
        default:
          return '#6B7280';
      }
    },
    []
  );

  // Apply impacts to tensor
  const applyImpacts = useCallback(
    (tensor: SkinTensorCoordinates, impacts: TensorImpact[]): SkinTensorCoordinates => {
      const result = { ...tensor };

      for (const impact of impacts) {
        const key = impact.dimension as keyof SkinTensorCoordinates;
        if (key in result) {
          // Apply impact as percentage change, scaled by confidence
          const change = impact.impact * impact.confidence * 20; // Scale factor
          result[key] = Math.max(0, Math.min(100, result[key] + change));
        }
      }

      return result;
    },
    []
  );

  // Predicted tensor after applying impacts
  const predictedTensor = useMemo(() => {
    if (!currentTensor || tensorImpacts.length === 0) return null;
    return applyImpacts(currentTensor, tensorImpacts);
  }, [currentTensor, tensorImpacts, applyImpacts]);

  // Transform to chart data
  const chartData = useMemo((): TensorChartDataPoint[] => {
    if (!currentTensor) return [];

    return dimensions.map((dim) => {
      const value = currentTensor[dim.key];
      const status = getValueStatus(value, dim.idealRange.min, dim.idealRange.max, dim.invertedScale);
      const percentile = calculatePercentile(
        value,
        dim.idealRange.min,
        dim.idealRange.max,
        dim.invertedScale
      );

      return {
        dimension: dim.key,
        label: dim.label,
        shortLabel: dim.shortLabel,
        value,
        idealMin: dim.idealRange.min,
        idealMax: dim.idealRange.max,
        category: dim.category,
        categoryColor: getCategoryColor(dim.category),
        status,
        percentile,
      };
    });
  }, [currentTensor, dimensions, getCategoryColor]);

  // Comparison data
  const comparisonData = useMemo((): TensorComparisonData[] => {
    if (!currentTensor || !targetTensor) return [];

    return dimensions.map((dim) => {
      const current = currentTensor[dim.key];
      const target = targetTensor[dim.key];
      const difference = target - current;

      // For inverted scales, improvement is when the value goes down
      const improvement = dim.invertedScale ? difference < 0 : difference > 0;

      return {
        dimension: dim.key,
        label: dim.label,
        current,
        target,
        difference,
        improvement,
        category: dim.category,
      };
    });
  }, [currentTensor, targetTensor, dimensions]);

  // Category summaries
  const categorySummaries = useMemo((): TensorCategorySummary[] => {
    if (!currentTensor) return [];

    const categoryGroups = new Map<string, TensorDimensionInfo[]>();
    for (const dim of dimensions) {
      const group = categoryGroups.get(dim.category) || [];
      group.push(dim);
      categoryGroups.set(dim.category, group);
    }

    return Array.from(categoryGroups.entries()).map(([category, dims]) => {
      // Calculate average percentile for category
      const percentiles = dims.map((dim) => {
        const value = currentTensor[dim.key];
        return calculatePercentile(
          value,
          dim.idealRange.min,
          dim.idealRange.max,
          dim.invertedScale
        );
      });
      const avgPercentile = percentiles.reduce((a, b) => a + b, 0) / percentiles.length;

      // Determine status
      let status: 'optimal' | 'good' | 'warning' | 'critical';
      if (avgPercentile >= 85) status = 'optimal';
      else if (avgPercentile >= 70) status = 'good';
      else if (avgPercentile >= 50) status = 'warning';
      else status = 'critical';

      return {
        category,
        label: CATEGORY_INFO[category]?.label || category,
        color: getCategoryColor(category),
        score: Math.round(avgPercentile),
        dimensions: dims.map((d) => d.key),
        status,
      };
    });
  }, [currentTensor, dimensions, getCategoryColor]);

  // Category scores
  const categoryScores = useMemo(() => {
    const scores: Record<string, number> = {};
    for (const summary of categorySummaries) {
      scores[summary.category] = summary.score;
    }
    return scores;
  }, [categorySummaries]);

  // Overall score
  const overallScore = useMemo(() => {
    if (categorySummaries.length === 0) return 0;
    const totalScore = categorySummaries.reduce((acc, cat) => acc + cat.score, 0);
    return Math.round(totalScore / categorySummaries.length);
  }, [categorySummaries]);

  return {
    // Dimension metadata
    dimensions,
    categories: CATEGORY_INFO,

    // Transformed data
    chartData,
    comparisonData,
    categorySummaries,

    // Computed scores
    overallScore,
    categoryScores,

    // Utilities
    getDimensionInfo,
    getCategoryColor,
    formatValue,
    getStatusColor,

    // Impact analysis
    applyImpacts,
    predictedTensor,
  };
}

/**
 * Helper to create empty tensor with default values
 */
export function createEmptyTensor(): SkinTensorCoordinates {
  return {
    hydrationLevel: 50,
    oilProduction: 50,
    barrierHealth: 50,
    elasticity: 50,
    pigmentation: 50,
    cellTurnover: 50,
    inflammationLevel: 50,
    antioxidantCapacity: 50,
    collagenDensity: 50,
    microbiomeBalance: 50,
    sensitivityIndex: 50,
    poreSize: 50,
    surfaceTexture: 50,
    photoaging: 50,
    pHBalance: 50,
    circulation: 50,
    environmentalProtection: 50,
  };
}

/**
 * Helper to generate ideal tensor based on skin type
 */
export function generateIdealTensor(skinType: string): SkinTensorCoordinates {
  const base = createEmptyTensor();

  // Set ideal values based on dimension info
  for (const dim of TENSOR_DIMENSIONS) {
    const idealMid = (dim.idealRange.min + dim.idealRange.max) / 2;
    base[dim.key] = idealMid;
  }

  // Adjust based on skin type
  switch (skinType) {
    case 'DRY':
      base.hydrationLevel = 75;
      base.oilProduction = 35;
      base.barrierHealth = 80;
      break;
    case 'OILY':
      base.hydrationLevel = 65;
      base.oilProduction = 55;
      base.poreSize = 35;
      break;
    case 'SENSITIVE':
      base.sensitivityIndex = 25;
      base.inflammationLevel = 20;
      base.barrierHealth = 85;
      break;
    case 'MATURE':
      base.elasticity = 80;
      base.collagenDensity = 75;
      base.cellTurnover = 70;
      break;
    case 'COMBINATION':
      base.oilProduction = 45;
      base.hydrationLevel = 70;
      break;
  }

  return base;
}

export default useTensorVisualization;
