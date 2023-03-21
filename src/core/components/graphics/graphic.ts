import {
  CanvasLineGraphic,
  LineGraphic,
  TLineGraphic,
} from './variations/line-graphic';
import {
  CanvasSpriteGraphic,
  SpriteGraphic,
  TSpriteGraphic,
} from './variations/sprite-graphic';
import {DataDefinition} from '../../setting/data-definition';
import {
  CameraState,
  CanvasRenderingState,
} from '../../state/state-components/camera-state';

export type Graphic<_Def extends DataDefinition> = SpriteGraphic | LineGraphic;
export type CanvasGraphic<_Def extends DataDefinition> =
  | CanvasSpriteGraphic
  | CanvasLineGraphic;

export class TGraphic {
  static appendKey<Def extends DataDefinition>(
    preKey: string,
    graphic: Graphic<Def>
  ): Graphic<Def> {
    return {
      ...graphic,
      key: `${preKey}-${graphic.key}`,
    };
  }

  static appendKeys<Def extends DataDefinition>(
    preKey: string,
    graphics: Graphic<Def>[]
  ): Graphic<Def>[] {
    return graphics.map(g => ({
      ...g,
      key: `${preKey}-${g.key}`,
    }));
  }

  static convertGraphicsToCanvas<Def extends DataDefinition>(
    graphics: Graphic<Def>[],
    args: {
      cameraState: CameraState<Def>;
      renderingState: CanvasRenderingState;
    }
  ): CanvasGraphic<Def>[] {
    return graphics.map(g => this.convertGraphicToCanvas(g, args));
  }

  private static convertGraphicToCanvas<Def extends DataDefinition>(
    graphic: Graphic<Def>,
    args: {
      cameraState: CameraState<Def>;
      renderingState: CanvasRenderingState;
    }
  ): CanvasGraphic<Def> {
    const traits = {
      line: TLineGraphic,
      sprite: TSpriteGraphic,
    };

    switch (graphic.type) {
      case 'line':
        return traits['line'].convertToCanvas(graphic, args);
      case 'sprite':
        return traits['sprite'].convertToCanvas(graphic, args);
    }
    // throw new Error('no trait for graphic');
  }
}
