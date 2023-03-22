import {TRecM2M} from '../../../utils';
import {FlattenCollision} from '../../components/collision/collision';
import {
  OverlapCalculation,
  Overlaps,
} from '../../components/collision/overlap-calculation';
import {DataDefinition} from '../../setting/data-definition';

export type CollisionState<Def extends DataDefinition> = Readonly<{
  flattenCollisions: FlattenCollision<Def>[];
  // flatCollisionsRecord: Record<string, FlattenCollision<Def>>;  // add if we need
  overlaps: Overlaps<Def>;
}>;

export class TCollisionState {
  static new<Def extends DataDefinition>(): CollisionState<Def> {
    return {
      flattenCollisions: [],
      // flatCollisionsRecord: {},
      overlaps: {
        overlaps: TRecM2M.new(),
        keyToId: {},
      },
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
