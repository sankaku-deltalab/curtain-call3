import {FlatCollision, Overlaps} from './collision';

export type CollisionState = Readonly<{
  flatCollisions: FlatCollision[];
  overlaps: Overlaps;
}>;

export class CollisionTrait {}
