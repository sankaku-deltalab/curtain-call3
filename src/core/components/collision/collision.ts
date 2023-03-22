import {AaRect2d} from '../../../utils/aa-rect2d';
import {
  AnyTypeBodyId,
  DataDefinition,
  serializeBodyId,
} from '../../setting/data-definition';

export type Collision = Readonly<{
  shapes: CollisionShape[];
  excess: boolean;
}>;

export type CollisionShape = AaRectCollisionShape;

export type CollisionShapeBase = Readonly<{
  type: string;
  aabb: AaRect2d;
}>;

export type AaRectCollisionShape = Readonly<{
  type: 'aa_rect';
  aabb: AaRect2d;
}>;

export type Box2d = [number, number, number, number]; // [minX, minY, maxX, maxY]
export type FlattenCollision<Def extends DataDefinition> = Readonly<{
  key: string;
  bodyId: AnyTypeBodyId<Def>;
  aabb: Box2d;
  shape: CollisionShape;
  excess: boolean;
}>;

export class TCollision {
  static calcFlattenCollisions<Stg extends DataDefinition>(
    collisions: [AnyTypeBodyId<Stg>, Collision][]
  ): FlattenCollision<Stg>[] {
    const flatCollisions: FlattenCollision<Stg>[] = [];
    for (const [bodyId, col] of collisions) {
      for (const s of col.shapes) {
        const aabb: Box2d = [
          s.aabb.nw.x,
          s.aabb.nw.y,
          s.aabb.se.x,
          s.aabb.se.y,
        ];
        const flatCol: FlattenCollision<Stg> = {
          key: serializeBodyId(bodyId),
          bodyId: bodyId,
          shape: s,
          aabb,
          excess: col.excess,
        };
        flatCollisions.push(flatCol);
      }
    }
    return flatCollisions;
  }

  static isOverlapped(_col_a: Collision, _col_b: Collision): boolean {
    // given: two aabb is overlapped
    // Currently, shape is only aabb. So this function is always true.
    return true;
  }
}
