import {TRecM2M} from '../../../utils';
import {FlattenCollision} from '../../components/collision/collision';
import {
  OverlapCalculation,
  Overlaps,
} from '../../components/collision/overlap-calculation';
import {
  AnyTypeBodyId,
  BodyId,
  BodyType,
  DataDefinition,
} from '../../setting/data-definition';

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

  static getOverlapsInType<
    Def extends DataDefinition,
    LeftBT extends BodyType<Def>,
    RightBT extends BodyType<Def>
  >(
    col: CollisionState<Def>,
    leftBodyType: LeftBT,
    rightBodyType: RightBT
  ): [BodyId<Def, LeftBT>, BodyId<Def, RightBT>][] {
    return TRecM2M.toPairs(col.overlaps.overlaps)
      .map<[AnyTypeBodyId<Def>, AnyTypeBodyId<Def>]>(([key1, key2]) => [
        col.overlaps.keyToId[key1],
        col.overlaps.keyToId[key2],
      ])
      .filter(
        ([b1, b2]) => b1[0] === leftBodyType && b2[0] === rightBodyType
      ) as [BodyId<Def, LeftBT>, BodyId<Def, RightBT>][];
  }
}
