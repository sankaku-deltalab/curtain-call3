import boxIntersect = require('box-intersect');
import {pipe} from 'rambda';
import {Enum, RecM2M, RecM2MTrait, RecSet, RecSetTrait} from '../../utils';
import {Collision, CollisionMode, CollisionShape} from './collision';

export type CollisionKey = string;

type Box2d = [number, number, number, number]; // [minX, minY, maxX, maxY]

type CollisionForCalc = {
  key: CollisionKey;
  aabb: Box2d;
  shape: CollisionShape;
  mode: CollisionMode;
  excess: boolean;
};

export class OverlapCalculation {
  static calcOverlaps(collisions: Record<CollisionKey, Collision>): RecM2M {
    const r = pipe(
      () => collisions,
      getCollisionsForCalc,
      splitCollisionsToExcessAndNonExcess,
      calcAabbOverlaps,
      overlaps => filterOverlapsByMode(overlaps, collisions)
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

const filterOverlapsByMode = (
  aabbOverlaps: RecM2M,
  collisions: Record<CollisionKey, Collision>
): RecM2M => {
  // I do not fix this function because I will remove collision-mode.
  return aabbOverlaps;
  // this function has bug
  // const filterOpponents = (
  //   self: CollisionKey,
  //   opponents: RecSet
  // ): [CollisionKey, RecSet] => {
  //   const selfCol = collisions[self];
  //   const filteredOpponents = RecSetTrait.filter(opponents, c => {
  //     const opponentCol = collisions[c];
  //     return canOverlap(selfCol, opponentCol);
  //   });
  //   return [self, filteredOpponents];
  // };

  // return pipe(
  //   () => aabbOverlaps,
  //   overlapsSet => Object.entries(overlapsSet),
  //   overlapsPairs =>
  //     Enum.map(overlapsPairs, ([self, opponents]) => [
  //       self,
  //       filterOpponents(self, opponents),
  //     ]),
  //   overlapsPairs => Object.fromEntries(overlapsPairs)
  // )();
};

const canOverlap = (col_a: Collision, col_b: Collision): boolean => {
  return (col_a.mode.mode & col_b.mode.mask) > 0;
};
