import {
  Color,
  LineGraphic,
  SpriteGraphic,
  TLineGraphic,
  TSpriteGraphic,
} from '../../core/components/graphics';
import {TRectGraphic} from '../../core/components/graphics/variations/rect-graphic';
import {RectGraphic} from '../../core/components/graphics/variations/rect-graphic';
import {Vec2d} from '../../utils';
import {AaRect2d} from '../../utils/aa-rect2d';

export class GraphicHelper {
  static createLineGraphic(args: {
    key: string;
    pos: Vec2d;
    zIndex: number;
    thickness: number;
    color: Color;
    paths: Vec2d[];
    closed?: boolean;
  }): LineGraphic {
    return TLineGraphic.create(args);
  }

  static createRectGraphic(args: {
    key: string;
    pos: Vec2d;
    zIndex: number;
    area: AaRect2d;
    color: Color;
  }): RectGraphic {
    return TRectGraphic.create(args);
  }

  static createSpriteGraphic(args: {
    key: string;
    pos: Vec2d;
    zIndex: number;
    imgKey: string;
    scale?: Vec2d;
  }): SpriteGraphic {
    return TSpriteGraphic.create(args);
  }
}
