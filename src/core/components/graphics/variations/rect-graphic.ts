import {Vec2d, TVec2d} from '../../../../utils/vec2d';
import {CanvasGraphicBase, Color, GraphicBase} from '../graphic-base';
import {
  CameraState,
  CanvasRenderingState,
  TCameraState,
} from '../../../state/state-components/camera-state';
import {DataDefinition} from '../../../setting/data-definition';
import {AaRect2d} from '../../../../utils';

export type RectGraphic = GraphicBase &
  Readonly<{
    type: 'rect';
    area: AaRect2d;
    color: Color;
  }>;

export type CanvasRectGraphic = CanvasGraphicBase &
  Readonly<{
    type: 'canvas-rect';
    area: AaRect2d;
    color: Color;
  }>;

export class TRectGraphic {
  static create(args: {
    key: string;
    pos: Vec2d;
    zIndex: number;
    area: AaRect2d;
    color: Color;
  }): RectGraphic {
    return {
      type: 'rect',
      key: args.key,
      pos: args.pos,
      zIndex: args.zIndex,
      area: args.area,
      color: args.color,
    };
  }

  static convertToCanvas<Def extends DataDefinition>(
    graphic: RectGraphic,
    args: {
      cameraState: CameraState<Def>;
      renderingState: CanvasRenderingState;
    }
  ): CanvasRectGraphic {
    const pathsGame = [graphic.area.nw, graphic.area.se];

    const [nw, se] = pathsGame.map(point => {
      const gamePos = TVec2d.add(graphic.pos, point);
      return TCameraState.projectGamePointToCanvas(
        args.cameraState,
        gamePos,
        args
      );
    });
    const area = {nw, se};

    return {
      type: 'canvas-rect',
      key: graphic.key,
      zIndex: graphic.zIndex,
      area,
      color: graphic.color,
    };
  }
}
