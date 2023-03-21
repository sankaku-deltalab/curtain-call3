import {Vec2d, TVec2d} from '../../../../utils/vec2d';
import {CanvasGraphicBase, Color, GraphicBase} from '../graphic-base';
import {
  CameraState,
  CanvasRenderingState,
  TCameraState,
} from '../../../state/state-components/camera-state';
import {DataDefinition} from '../../../setting/data-definition';

export type LineGraphic = GraphicBase &
  Readonly<{
    type: 'line';
    thickness: number;
    color: Color;
    paths: Vec2d[];
    closed: boolean;
  }>;

export type CanvasLineGraphic = CanvasGraphicBase &
  Readonly<{
    type: 'canvas-line';
    thickness: number;
    color: Color;
    paths: Vec2d[];
    closed: boolean;
  }>;

export class TLineGraphic {
  static create(args: {
    key: string;
    pos: Vec2d;
    zIndex: number;
    thickness: number;
    color: Color;
    paths: Vec2d[];
    closed?: boolean;
  }): LineGraphic {
    return {
      key: args.key,
      pos: args.pos,
      zIndex: args.zIndex,
      thickness: args.thickness,
      color: args.color,
      paths: args.paths,
      type: 'line',
      closed: args.closed ?? false,
    };
  }

  static convertToCanvas<Def extends DataDefinition>(
    graphic: LineGraphic,
    args: {
      cameraState: CameraState<Def>;
      renderingState: CanvasRenderingState;
    }
  ): CanvasLineGraphic {
    const paths = graphic.paths.map(point => {
      const gamePos = TVec2d.add(graphic.pos, point);
      return TCameraState.projectGamePointToCanvas(
        args.cameraState,
        gamePos,
        args
      );
    });

    const thickness = TCameraState.gameScaleToRenderingScale(
      args.cameraState,
      graphic.thickness,
      args
    );

    return {
      type: 'canvas-line',
      key: graphic.key,
      zIndex: graphic.zIndex,
      thickness,
      color: graphic.color,
      paths,
      closed: graphic.closed,
    };
  }
}
