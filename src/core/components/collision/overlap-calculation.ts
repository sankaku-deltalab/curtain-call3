import boxIntersect = require('box-intersect');
import {Im} from '../../../utils/immutable-manipulation';
import {Enum} from '../../../utils/enum';
import {RecM2M, TRecM2M} from '../../../utils/rec-m2m';
import {FlattenCollision} from './collision';
import {AnyTypeBodyId, DataDefinition} from '../../setting/data-definition';

export type Overlaps<Def extends DataDefinition> = {
  overlaps: RecM2M<string>;
  keyToId: Record<string, AnyTypeBodyId<Def>>;
};

export class OverlapCalculation {
  static calcOverlaps<Def extends DataDefinition>(
    collisions: FlattenCollision<Def>[]
  ): Overlaps<Def> {
    const overlaps = Im.pipe(
      () => collisions,
      splitCollisionsToExcessAndNonExcess,
      calcAabbOverlaps
    )();

    return {
      overlaps,
      keyToId: calcKeyToId(collisions),
    };
  }
}

const splitCollisionsToExcessAndNonExcess = <Def extends DataDefinition>(
  collisions: FlattenCollision<Def>[]
): {
  excess: FlattenCollision<Def>[];
  nonExcess: FlattenCollision<Def>[];
} => {
  const excess = collisions.filter(c => c.excess);
  const nonExcess = collisions.filter(c => !c.excess);
  return {excess, nonExcess};
};

const calcAabbOverlaps = <Def extends DataDefinition>(collisions: {
  excess: FlattenCollision<Def>[];
  nonExcess: FlattenCollision<Def>[];
}): RecM2M<string> => {
  const eCol = collisions.excess;
  const neCol = collisions.nonExcess;

  const eAabb = Enum.map(eCol, c => c.aabb);
  const neAabb = Enum.map(neCol, c => c.aabb);

  const eVsNe = boxIntersect(eAabb, neAabb);
  const neVsNe = boxIntersect(neAabb);

  const eVsNeKeys: [string, string][] = Enum.map(eVsNe, ([i, j]) => [
    eCol[i].key,
    neCol[j].key,
  ]);
  const neVsNeKeys: [string, string][] = Enum.map(neVsNe, ([i, j]) => [
    neCol[i].key,
    neCol[j].key,
  ]);

  const overlapKeys = [...eVsNeKeys, ...neVsNeKeys];
  const overlapKeysRev: [string, string][] = Enum.map(
    overlapKeys,
    ([k1, k2]) => [k2, k1]
  );
  const overlapKeysAll = [...overlapKeys, ...overlapKeysRev];

  return TRecM2M.fromPairs(overlapKeysAll);
};

const calcKeyToId = <Def extends DataDefinition>(
  collisions: FlattenCollision<Def>[]
): Record<string, AnyTypeBodyId<Def>> => {
  return Object.fromEntries(collisions.map(c => [c.key, c.bodyId]));
};
