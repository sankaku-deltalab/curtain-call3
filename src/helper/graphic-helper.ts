import {
  CanvasGraphic,
  CanvasLineGraphic,
  CanvasSpriteGraphic,
} from '../core/components';
import {Setting} from '../core/setting';

export class GraphicHelper {
  static isCanvasSpriteGraphic<Stg extends Setting>(
    graphic: CanvasGraphic<Stg>
  ): graphic is CanvasSpriteGraphic {
    return graphic.type === 'canvas-sprite';
  }

  static isCanvasLineGraphic<Stg extends Setting>(
    graphic: CanvasGraphic<Stg>
  ): graphic is CanvasLineGraphic {
    return graphic.type === 'canvas-line';
  }
}
