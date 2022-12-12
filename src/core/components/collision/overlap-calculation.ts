import boxIntersect = require('box-intersect');
import {Im} from '../../../utils/immutable-manipulation';
import {Enum} from '../../../utils/enum';
import {RecM2M, RecM2MTrait} from '../../../utils/rec-m2m';
import {Box2d, Collision, CollisionKey, FlatCollision} from './collision';

export class OverlapCalculation {
  static calcOverlaps(collisions: Record<CollisionKey, Collision>): RecM2M {
    const r = Im.pipe(
      () => collisions,
      getCollisionsForCalc,
      splitCollisionsToExcessAndNonExcess,
      calcAabbOverlaps
    )();

    return r;
  }
}

const getCollisionsForCalc = (
  collisions: Record<CollisionKey, Collision>
): FlatCollision[] => {
  return Object.entries(collisions).flatMap(([key, col]) => {
    return col.shapes.map(s => {
      const aabb: Box2d = [s.box.nw.x, s.box.nw.y, s.box.se.x, s.box.se.y];
      return {...col, key, shape: s, aabb};
    });
  });
};

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
}): RecM2M => {
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
