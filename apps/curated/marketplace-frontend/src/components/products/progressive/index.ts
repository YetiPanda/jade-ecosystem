/**
 * Progressive Disclosure Pattern - Public API
 *
 * Exports all components, types, hooks, and utilities
 * for implementing progressive disclosure in product displays
 */

// Main Components
export { ProgressiveContent } from './ProgressiveContent';
export { ProductGlance } from './ProductGlance';
export { ProductScan } from './ProductScan';
export { ProductStudy } from './ProductStudy';

// Hooks
export { useProgressiveState } from './hooks/useProgressiveState';

// Types
export type {
  ProgressiveLevel,
  ProgressiveContentProps,
  ProductGlanceData,
  ProductScanData,
  ProductStudyData,
  TransitionState,
  UseProgressiveStateReturn,
  AnimationConfig,
} from './types';

// Animation Utilities
export {
  ANIMATION_DURATION,
  EASING,
  TRANSITION_CLASSES,
  getAnimationConfig,
  generateTransition,
  glanceToScanAnimation,
  scanToStudyAnimation,
  collapseAnimation,
} from './animations';

// Default exports for convenience
export { default as ProgressiveContentDefault } from './ProgressiveContent';
export { default as ProductGlanceDefault } from './ProductGlance';
export { default as ProductScanDefault } from './ProductScan';
export { default as ProductStudyDefault } from './ProductStudy';

// Examples and Demo Components
export {
  ProgressiveProductCard,
  ProductGrid,
  ProgressiveDisclosureDemo,
} from './examples/ProgressiveProductCard';
export { mockProductData, mockProductGrid } from './examples/mockData';
