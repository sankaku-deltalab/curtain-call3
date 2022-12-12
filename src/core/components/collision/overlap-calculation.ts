import boxIntersect = require('box-intersect');
import {Im} from '../../../utils/immutable-manipulation';
import {Enum} from '../../../utils/enum';
import {RecM2M, RecM2MTrait} from '../../../utils/rec-m2m';
import {FlatCollision, Overlaps} from './collision';
import {BodyId} from '../actress-parts';

export class OverlapCalculation {
  static calcOverlaps(collisions: FlatCollision[]): Overlaps {
    return Im.pipe(
      () => collisions,
      splitCollisionsToExcessAndNonExcess,
      calcAabbOverlaps
    )();
  }
}

const splitCollisionsToExcessAndNonExcess = (
  collisions: FlatCollision[]
): {excess: FlatCollision[]; nonExcess: FlatCollision[]} => {
  const excess = collisions.filter(c => c.excess);
  const nonExcess = collisions.filter(c => !c.excess);
  return {excess, nonExcess};
};

const calcAabbOverlaps = (collisions: {
  excess: FlatCollision[];
  nonExcess: FlatCollision[];
}): RecM2M<BodyId> => {
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
