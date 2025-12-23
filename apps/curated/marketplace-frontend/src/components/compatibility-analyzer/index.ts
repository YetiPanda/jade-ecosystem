/**
 * Compatibility Analyzer Components
 *
 * DermaLogica Intelligence MVP - Phase 6: Compatibility Analyzer
 *
 * Product/ingredient compatibility analysis with:
 * - Pairwise interaction matrix
 * - Synergy and conflict detection
 * - Sequencing timeline with drag-drop
 * - Detailed interaction modals
 */

// Main component
export { CompatibilityAnalyzer, default } from './CompatibilityAnalyzer';
export type {
  CompatibilityAnalyzerProps,
  CompatibilityAnalysisResult,
  AnalyzerViewMode,
} from './CompatibilityAnalyzer';

// Product selector
export { ProductSelector } from './ProductSelector';
export type {
  ProductSelectorProps,
  SelectableProduct,
} from './ProductSelector';

// Compatibility matrix
export { CompatibilityMatrix } from './CompatibilityMatrix';
export type {
  CompatibilityMatrixProps,
  Interaction,
  InteractionType,
  MatrixItem,
} from './CompatibilityMatrix';

// Synergy card
export { SynergyCard, SynergyList } from './SynergyCard';
export type {
  SynergyCardProps,
  SynergyListProps,
  Synergy,
  SynergyType,
  SynergyStrength,
} from './SynergyCard';

// Conflict warning
export { ConflictWarning, ConflictList } from './ConflictWarning';
export type {
  ConflictWarningProps,
  ConflictListProps,
  Conflict,
  ConflictType,
  ConflictSeverity,
  MitigationOption,
} from './ConflictWarning';

// Interaction detail modal
export { InteractionDetailModal } from './InteractionDetailModal';
export type {
  InteractionDetailModalProps,
  InteractionDetail,
  InteractionClassification,
  DisclosureLevel,
  Citation,
  UsageRecommendation,
} from './InteractionDetailModal';

// Sequencing timeline
export { SequencingTimeline, autoSortSteps } from './SequencingTimeline';
export type {
  SequencingTimelineProps,
  SequenceStep,
  Routine,
  TimeOfDay,
} from './SequencingTimeline';

// Hook
export {
  useCompatibilityAnalysis,
  mockSearchProducts,
  mockAnalyzeCompatibility,
} from './useCompatibilityAnalysis';
export type {
  UseCompatibilityAnalysisOptions,
  UseCompatibilityAnalysisReturn,
} from './useCompatibilityAnalysis';
