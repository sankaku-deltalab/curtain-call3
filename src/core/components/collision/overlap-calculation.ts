import boxIntersect = require('box-intersect');
import {Enum, Im, RecM2M, RecM2MTrait} from '../../utils';
import {Collision, CollisionShape} from './collision';

export type CollisionKey = string;

type Box2d = [number, number, number, number]; // [minX, minY, maxX, maxY]

type CollisionForCalc = {
  key: CollisionKey;
  aabb: Box2d;
  shape: CollisionShape;
  excess: boolean;
};

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
): CollisionForCalc[] => {
  return Object.entries(collisions).flatMap(([key, col]) => {
    return col.shapes.map(s => {
      const aabb: Box2d = [s.box.nw.x, s.box.nw.y, s.box.se.x, s.box.se.y];
      return {...col, key, shape: s, aabb};
    });
  });
};

const splitCollisionsToExcessAndNonExcess = (
  collisions: CollisionForCalc[]
): {excess: CollisionForCalc[]; nonExcess: CollisionForCalc[]} => {
  const excess = collisions.filter(c => c.excess);
  const nonExcess = collisions.filter(c => !c.excess);
  return {excess, nonExcess};
};

const calcAabbOverlaps = (collisions: {
  excess: CollisionForCalc[];
  nonExcess: CollisionForCalc[];
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
