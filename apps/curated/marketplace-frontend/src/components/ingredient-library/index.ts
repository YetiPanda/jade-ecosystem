/**
 * Ingredient Library Components
 *
 * DermaLogica Intelligence MVP - Phase 5: Ingredient Library
 *
 * Evidence-based ingredient database with:
 * - Scientific study citations
 * - Tensor-based skin impact visualization
 * - Knowledge threshold filtering
 * - Progressive disclosure (Glance/Scan/Study)
 */

// Main component
export { IngredientLibrary, default } from './IngredientLibrary';
export type { IngredientLibraryProps, ViewMode } from './IngredientLibrary';

// Ingredient display components
export {
  IngredientCard,
  IngredientCardSkeleton,
  IngredientGrid,
} from './IngredientCard';
export type {
  Ingredient,
  IngredientCardProps,
  IngredientGridProps,
  TensorImpact,
  ConcernTarget,
  StudyReference,
  EvidenceLevel,
  KnowledgeThreshold,
} from './IngredientCard';

// Evidence/citation components
export {
  EvidenceAccordion,
  EvidenceSummaryCard,
} from './EvidenceAccordion';
export type {
  StudyReference as StudyReferenceExtended,
  StudyType,
  EvidenceAccordionProps,
  EvidenceSummaryCardProps,
} from './EvidenceAccordion';

// Search and filter components
export {
  IngredientSearch,
  getDefaultFilters,
} from './IngredientSearch';
export type {
  IngredientSearchProps,
  IngredientSearchFilters,
  SortOption,
} from './IngredientSearch';

// Tensor filter panel
export { TensorFilterPanel } from './TensorFilterPanel';
export type {
  TensorFilterPanelProps,
  TensorFilters,
  TensorFilterValue,
} from './TensorFilterPanel';

// Hooks
export {
  useIntelligenceQuery,
  useIngredientDetail,
} from './useIntelligenceQuery';
export type {
  UseIntelligenceQueryOptions,
  UseIntelligenceQueryReturn,
  UseIngredientDetailOptions,
  UseIngredientDetailReturn,
} from './useIntelligenceQuery';

export {
  useTensorVisualization,
  createEmptyTensor,
  generateIdealTensor,
} from './useTensorVisualization';
export type {
  UseTensorVisualizationOptions,
  UseTensorVisualizationReturn,
  SkinTensorCoordinates,
  TensorDimensionInfo,
  TensorChartDataPoint,
  TensorComparisonData,
  TensorCategorySummary,
} from './useTensorVisualization';
