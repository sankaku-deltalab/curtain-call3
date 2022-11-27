import {Setting} from '../../../setting';
import {Vec2d, Vec2dTrait} from '../../../../utils/vec2d';
import {CameraState, CameraTrait, RenderingState} from '../../camera';
import {CanvasGraphicBase, GraphicBase} from '../graphic-base';

export type SpriteGraphic = GraphicBase &
  Readonly<{
    type: 'sprite';
    imgKey: string;
    scale: Vec2d;
  }>;

export type CanvasSpriteGraphic = CanvasGraphicBase &
  Readonly<{
    type: 'canvas-sprite';
    pos: Vec2d;
    imgKey: string;
    scale: Vec2d;
  }>;

export class SpriteGraphicTrait {
  static create(args: {
    key: string;
    pos: Vec2d;
    zIndex: number;
    imgKey: string;
    scale?: Vec2d;
  }): SpriteGraphic {
    return {
      ...args,
      type: 'sprite',
      scale: args.scale ?? Vec2dTrait.one(),
    };
  }

  static convertToCanvas<Stg extends Setting>(
    graphic: SpriteGraphic,
    args: {
      camSt: CameraState<Stg>;
      renSt: RenderingState;
    }
  ): CanvasSpriteGraphic {
    const pos = CameraTrait.projectGamePointToCanvas(graphic.pos, args);

    return {
      ...graphic,
      type: 'canvas-sprite',
      pos,
    };
  }
}
