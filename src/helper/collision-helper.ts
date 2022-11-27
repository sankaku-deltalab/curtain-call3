import {
  AaRectCollisionShape,
  Collision,
  CollisionShape,
} from '../core/components';
import {AaRect2d} from '../core/utils/util';

export class CollisionHelper {
  static createAaRectShape(box: AaRect2d): AaRectCollisionShape {
    return {
      type: 'aa_rect',
      box,
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
