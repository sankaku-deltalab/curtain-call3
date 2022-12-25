import {Setting} from '../../../setting';
import {Vec2d, Vec2dTrait} from '../../../../utils/vec2d';
import {CameraState, CameraTrait, RenderingState} from '../../camera';
import {CanvasGraphicBase, Color, GraphicBase} from '../graphic-base';

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

export class LineGraphicTrait {
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

  static convertToCanvas<Stg extends Setting>(
    graphic: LineGraphic,
    args: {
      camSt: CameraState<Stg>;
      renSt: RenderingState;
    }
  ): CanvasLineGraphic {
    const paths = graphic.paths.map(point => {
      const gamePos = Vec2dTrait.add(graphic.pos, point);
      return CameraTrait.projectGamePointToCanvas(gamePos, args);
    });

    const thickness = CameraTrait.gameScaleToRenderingScale(
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
