import {RecM2MTrait} from '../../../utils';
import {BodyId} from '../actress-parts';
import {Box2d, Collision, FlatCollision, Overlaps} from './collision';

export type CollisionState = Readonly<{
  flatCollisions: FlatCollision[];
  overlaps: Overlaps;
}>;

export class CollisionTrait {
  static initialState(): CollisionState {
    return {flatCollisions: [], overlaps: RecM2MTrait.new()};
  }

  static calcFlatCollisions(
    collisions: [BodyId, Collision][]
  ): FlatCollision[] {
    const flatCollisions: FlatCollision[] = [];
    for (const [bodyId, col] of collisions) {
      for (const s of col.shapes) {
        const aabb: Box2d = [s.box.nw.x, s.box.nw.y, s.box.se.x, s.box.se.y];
        const flatCol = {key: bodyId, shape: s, aabb, excess: col.excess};
        flatCollisions.push(flatCol);
      }
    }
    return flatCollisions;
  }
}
