import {AaRect2d} from '../../../utils/aa-rect2d';
import {RecM2M} from '../../../utils/rec-m2m';

export type Collision = Readonly<{
  shapes: CollisionShape[];
  excess: boolean;
}>;

export type CollisionShape = AaRectCollisionShape;

export type CollisionShapeBase = Readonly<{
  type: string;
  box: AaRect2d;
}>;

export type AaRectCollisionShape = Readonly<{
  type: 'aa_rect';
  box: AaRect2d;
}>;

export type CollisionKey = string;
export type Box2d = [number, number, number, number]; // [minX, minY, maxX, maxY]
export type FlatCollision = Readonly<{
  key: CollisionKey;
  aabb: Box2d;
  shape: CollisionShape;
  excess: boolean;
}>;

export const isOverlapped = (_col_a: Collision, _col_b: Collision): boolean => {
  // given: two aabb is overlapped
  // Currently, shape is only aabb. So this function is always true.
  return true;
};

export type Overlaps = RecM2M; // many to many BodyId
