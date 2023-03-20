import boxIntersect = require('box-intersect');
import {Im} from '../../../utils/immutable-manipulation';
import {Enum} from '../../../utils/enum';
import {RecM2M, RecM2MTrait} from '../../../utils/rec-m2m';
import {FlattenCollision, Overlaps} from './collision';
import {DataDefinition} from '../../setting/data-definition';

export class OverlapCalculation {
  static calcOverlaps<Stg extends DataDefinition>(
    collisions: FlattenCollision<Stg>[]
  ): Overlaps {
    return Im.pipe(
      () => collisions,
      splitCollisionsToExcessAndNonExcess,
      calcAabbOverlaps
    )();
  }
}

const splitCollisionsToExcessAndNonExcess = <Stg extends DataDefinition>(
  collisions: FlattenCollision<Stg>[]
): {excess: FlattenCollision<Stg>[]; nonExcess: FlattenCollision<Stg>[]} => {
  const excess = collisions.filter(c => c.excess);
  const nonExcess = collisions.filter(c => !c.excess);
  return {excess, nonExcess};
};

const calcAabbOverlaps = <Stg extends DataDefinition>(collisions: {
  excess: FlattenCollision<Stg>[];
  nonExcess: FlattenCollision<Stg>[];
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

  return RecM2MTrait.fromPairs(overlapKeysAll);
};
