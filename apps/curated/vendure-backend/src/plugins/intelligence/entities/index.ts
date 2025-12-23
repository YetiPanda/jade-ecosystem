/**
 * Intelligence Plugin Entities
 *
 * Exports all entities and types for the intelligence plugin
 */

export * from './product.entity';
export * from './order.entity';
export * from './taxonomy.entity';

// SKA (Skincare Knowledge Atoms) entities
export * from './ska';

// Intelligence MVP entities
export { ClaimEvidence } from './claim-evidence.entity';
export { EfficacyIndicator } from './efficacy-indicator.entity';

// Skin Dashboard entities (Phase 4)
export {
  SkinHealthProfile,
  SkinType,
  SkinConcern,
  LifestyleFactor,
} from './skin-health-profile.entity';
export type {
  SkinTensorCoordinates,
  SkinConcernEntry,
} from './skin-health-profile.entity';
