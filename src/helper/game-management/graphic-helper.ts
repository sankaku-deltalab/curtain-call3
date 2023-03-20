import {CanvasGraphic} from '../../core/components/graphics/graphic';
import {
  CanvasLineGraphic,
  CanvasSpriteGraphic,
} from '../../core/components/graphics/variations';
import {DataDefinition} from '../../core/setting/data-definition';

export class CanvasGraphicHelper {
  static isCanvasSpriteGraphic<Def extends DataDefinition>(
    graphic: CanvasGraphic<Def>
  ): graphic is CanvasSpriteGraphic {
    return graphic.type === 'canvas-sprite';
  }

  static isCanvasLineGraphic<Def extends DataDefinition>(
    graphic: CanvasGraphic<Def>
  ): graphic is CanvasLineGraphic {
    return graphic.type === 'canvas-line';
  }
}
