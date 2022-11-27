import {AaRect2d, RecM2M} from '../../../utils/util';

export type Collision = {
  shapes: CollisionShape[];
  excess: boolean;
};

export type CollisionShape = AaRectCollisionShape;

export type CollisionShapeBase = {
  type: string;
  box: AaRect2d;
};

export type AaRectCollisionShape = {
  type: 'aa_rect';
  box: AaRect2d;
};

export const isOverlapped = (col_a: Collision, col_b: Collision): boolean => {
  // given: two aabb is overlapped
  // Currently, shape is only aabb. So this function is always true.
  return true;
};

export type Overlaps = RecM2M; // many to many BodyId
