import {Vec2d, Vec2dTrait} from '../../../../utils/vec2d';
import {CanvasGraphicBase, GraphicBase} from '../graphic-base';
import {DataDefinition} from '../../../setting/data-definition';
import {
  CameraState,
  CanvasRenderingState,
  TCameraState,
} from '../../../state/state-components/camera-state';

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
      key: args.key,
      pos: args.pos,
      zIndex: args.zIndex,
      imgKey: args.imgKey,
      type: 'sprite',
      scale: args.scale ?? Vec2dTrait.one(),
    };
  }

  static convertToCanvas<Def extends DataDefinition>(
    graphic: SpriteGraphic,
    args: {
      cameraState: CameraState<Def>;
      renderingState: CanvasRenderingState;
    }
  ): CanvasSpriteGraphic {
    const pos = TCameraState.projectGamePointToCanvas(
      args.cameraState,
      graphic.pos,
      args
    );

    return {
      ...graphic,
      type: 'canvas-sprite',
      pos,
    };
  }
}
