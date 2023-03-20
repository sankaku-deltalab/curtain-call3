import {
  AaRectCollisionShape,
  Collision,
  CollisionShape,
} from '../../core/components/collision/collision';
import {AaRect2d} from '../../utils/aa-rect2d';

export class CollisionHelper {
  static createAaRectShape(box: AaRect2d): AaRectCollisionShape {
    return {
      type: 'aa_rect',
      aabb: box,
    };
  }

  static createCollision(args: {
    shapes: CollisionShape[];
    excess?: boolean;
  }): Collision {
    return {
      shapes: args.shapes,
      excess: args.excess ?? false,
    };
  }
}
