/**
 * Skin Dashboard Components Index
 *
 * DermaLogica Intelligence MVP - Phase 4: Skin Dashboard
 *
 * Exports all skin health dashboard components:
 * - SkinHealthDashboard: Main dashboard component
 * - TensorRadarChart: 17D tensor visualization
 * - InsightCard: Individual insight display
 * - SkinProfileForm: Multi-step profile setup form
 * - useSkinProfile: Data management hook
 */

// Main dashboard component
export { SkinHealthDashboard } from './SkinHealthDashboard';
export type { SkinHealthDashboardProps } from './SkinHealthDashboard';

// Tensor visualization
export { TensorRadarChart, TensorRadarChartCompact } from './TensorRadarChart';
export type { TensorRadarChartProps, SkinTensorCoordinates } from './TensorRadarChart';

// Insight components
export { InsightCard, InsightList } from './InsightCard';
export type { InsightCardProps, InsightListProps, SkinInsight } from './InsightCard';

// Profile form
export { SkinProfileForm } from './SkinProfileForm';
export type { SkinProfileFormProps, SkinProfileFormData } from './SkinProfileForm';

// Data hook
export { useSkinProfile } from './useSkinProfile';
export type {
  UseSkinProfileOptions,
  UseSkinProfileReturn,
  SkinHealthProfile,
  SkinHealthScore,
  TensorDimensionInfo,
  SkinConcernEntry,
  SkinType,
  SkinConcern,
  LifestyleFactor,
} from './useSkinProfile';
