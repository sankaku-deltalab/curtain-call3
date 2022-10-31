import {BodyId} from '../actress';
import {RecSet, AaRect2d} from '../util';

export type Collision = {
  shapes: CollisionShape[];
  mode: CollisionMode;
  excess: boolean;
};

export type CollisionMode = {
  mode: number;
  mask: number;
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
  return (col_a.mode.mode & col_b.mode.mask) > 0;
};

export type Overlaps = Record<BodyId, RecSet>;
