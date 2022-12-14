import {Setting} from '../../setting';
import {Im} from '../../../utils/immutable-manipulation';
import {Vec2dTrait} from '../../../utils/vec2d';
import {AaRect2d, AaRect2dTrait} from '../../../utils/aa-rect2d';
import {CameraState, CameraTrait, RenderingState} from '../camera';
import {
  CanvasLineGraphic,
  LineGraphic,
  LineGraphicTrait,
} from './variations/line-graphic';
import {
  CanvasSpriteGraphic,
  SpriteGraphic,
  SpriteGraphicTrait,
} from './variations/sprite-graphic';

export type Graphic<_Stg extends Setting> = SpriteGraphic | LineGraphic;
export type CanvasGraphic<_Stg extends Setting> =
  | CanvasSpriteGraphic
  | CanvasLineGraphic;

export class GraphicTrait {
  static appendKey<Stg extends Setting>(
    preKey: string,
    graphic: Graphic<Stg>
  ): Graphic<Stg> {
    return {
      ...graphic,
      key: `${preKey}-${graphic.key}`,
    };
  }

  static appendKeys<Stg extends Setting>(
    preKey: string,
    graphics: Graphic<Stg>[]
  ): Graphic<Stg>[] {
    return graphics.map(g => ({
      ...g,
      key: `${preKey}-${g.key}`,
    }));
  }
}

export class CanvasGraphicTrait {
  static getRenderingArea<Stg extends Setting>(args: {
    camSt: CameraState<Stg>;
    renSt: RenderingState;
  }): AaRect2d {
    const {nw: gameNw, se: gameSe} = AaRect2dTrait.fromCenterAndSize(
      Vec2dTrait.zero(),
      args.camSt.size
    );

    const canvasNw = Im.pipe(
      () => gameNw,
      p => CameraTrait.projectGamePointToCanvas(p, args)
    )();
    const canvasSe = Im.pipe(
      () => gameSe,
      p => CameraTrait.projectGamePointToCanvas(p, args)
    )();

    return {
      nw: canvasNw,
      se: canvasSe,
    };
  }

  static convertGraphicsToCanvas<Stg extends Setting>(
    graphics: Graphic<Stg>[],
    args: {
      camSt: CameraState<Stg>;
      renSt: RenderingState;
    }
  ): CanvasGraphic<Stg>[] {
    return graphics.map(g =>
      CanvasGraphicTrait.convertGraphicToCanvas(g, args)
    );
  }

  private static convertGraphicToCanvas<Stg extends Setting>(
    graphic: Graphic<Stg>,
    args: {
      camSt: CameraState<Stg>;
      renSt: RenderingState;
    }
  ): CanvasGraphic<Stg> {
    const traits = {
      line: LineGraphicTrait,
      sprite: SpriteGraphicTrait,
    };
    if (graphic.type === 'line') {
      return traits['line'].convertToCanvas(graphic, args);
    }
    if (graphic.type === 'sprite') {
      return traits['sprite'].convertToCanvas(graphic, args);
    }
    throw new Error('no trait for graphic');
  }
}
