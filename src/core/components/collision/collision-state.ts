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
    collisions: Record<BodyId, Collision>
  ): FlatCollision[] {
    return Object.entries(collisions).flatMap(([key, col]) => {
      return col.shapes.map(s => {
        const aabb: Box2d = [s.box.nw.x, s.box.nw.y, s.box.se.x, s.box.se.y];
        return {...col, key, shape: s, aabb};
      });
    });
  }
}
