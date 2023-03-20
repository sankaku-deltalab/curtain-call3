import {RecM2MTrait} from '../../../utils';
import {OverlapCalculation} from '../../components';
import {FlattenCollision, Overlaps} from '../../components/collision/collision';
import {DataDefinition} from '../../setting/data-definition';

export type CollisionState<Def extends DataDefinition> = Readonly<{
  flattenCollisions: FlattenCollision<Def>[];
  // flatCollisionsRecord: Record<string, FlattenCollision<Def>>;  // add if we need
  overlaps: Overlaps;
}>;

export class TCollisionState {
  static new<Def extends DataDefinition>(): CollisionState<Def> {
    return {
      flattenCollisions: [],
      // flatCollisionsRecord: {},
      overlaps: RecM2MTrait.new(),
    };
  }

  static update<Def extends DataDefinition>(
    col: CollisionState<Def>,
    flattenCollisions: FlattenCollision<Def>[]
  ): CollisionState<Def> {
    const overlaps = OverlapCalculation.calcOverlaps(flattenCollisions);
    return {
      ...col,
      flattenCollisions,
      overlaps,
    };
  }
}
