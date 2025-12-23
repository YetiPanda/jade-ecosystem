/**
 * SKA (Skincare Knowledge Atoms) Entity Exports
 */

export { SkincarePillar } from './skincare-pillar.entity';
export {
  SkincareAtom,
  SkincareAtomType,
  MarketSegment,
  PricePoint,
} from './skincare-atom.entity';
export { SkincareAtomTensor } from './skincare-tensor.entity';
export {
  SkincareRelationship,
  SkincareRelationshipType,
  SourceType,
} from './skincare-relationship.entity';
export { GoldilocksParameter } from './goldilocks-parameter.entity';

// Entity collection for TypeORM registration
import { SkincarePillar } from './skincare-pillar.entity';
import { SkincareAtom } from './skincare-atom.entity';
import { SkincareAtomTensor } from './skincare-tensor.entity';
import { SkincareRelationship } from './skincare-relationship.entity';
import { GoldilocksParameter } from './goldilocks-parameter.entity';

export const SKAEntities = [
  SkincarePillar,
  SkincareAtom,
  SkincareAtomTensor,
  SkincareRelationship,
  GoldilocksParameter,
];
