import {AaRect2d, TAaRect2d, Vec2d, TVec2d} from '../../../utils';
import {DataDefinition} from '../../setting/data-definition';

export type CameraState<_Def extends DataDefinition> = Readonly<{
  pos: Vec2d;
  size: Vec2d;
}>;

export type CanvasRenderingState = Readonly<{
  center: Vec2d;
  scale: number;
  canvasSize: Vec2d;
}>;

export class TCameraState {
  static new<Def extends DataDefinition>(args: {
    size: Vec2d;
  }): CameraState<Def> {
    return {pos: TVec2d.zero(), size: args.size};
  }

  static cameraArea<Def extends DataDefinition>(
    cameraState: CameraState<Def>
  ): AaRect2d {
    return TAaRect2d.fromCenterAndSize(cameraState.pos, cameraState.size);
  }

  static calcRenderingAreaOfCanvas<Def extends DataDefinition>(
    cameraState: CameraState<Def>,
    args: {
      renderingState: CanvasRenderingState;
    }
  ): AaRect2d {
    const {nw: gameNw, se: gameSe} = TAaRect2d.fromCenterAndSize(
      TVec2d.zero(),
      cameraState.size
    );

    const canvasNw = this.projectGamePointToCanvas(cameraState, gameNw, args);
    const canvasSe = this.projectGamePointToCanvas(cameraState, gameSe, args);

    return {
      nw: canvasNw,
      se: canvasSe,
    };
  }

  static projectCanvasPointToGame<Def extends DataDefinition>(
    cameraState: CameraState<Def>,
    canvasPos: Vec2d,
    args: {renderingState: CanvasRenderingState}
  ): Vec2d {
    const camSt = cameraState;
    const renSt = args.renderingState;

    const renderingArea = TAaRect2d.fromCenterAndSize(
      renSt.center,
      TVec2d.mlt(camSt.size, renSt.scale)
    );
    const cameraArea = TCameraState.cameraArea(camSt);

    const gameAreaPos = TAaRect2d.projectPoint(canvasPos, {
      prevArea: renderingArea,
      nextArea: cameraArea,
    });
    return gameAreaPos;
  }

  static projectGamePointToCanvas<Def extends DataDefinition>(
    cameraState: CameraState<Def>,
    gamePos: Vec2d,
    args: {renderingState: CanvasRenderingState}
  ): Vec2d {
    const camSt = cameraState;
    const renSt = args.renderingState;

    const renderingArea = TAaRect2d.fromCenterAndSize(
      renSt.center,
      TVec2d.mlt(camSt.size, renSt.scale)
    );
    const cameraArea = TCameraState.cameraArea(camSt);

    const renderingAreaPos = TAaRect2d.projectPoint(gamePos, {
      prevArea: cameraArea,
      nextArea: renderingArea,
    });
    return renderingAreaPos;
  }

  static gameScaleToRenderingScale<Def extends DataDefinition>(
    _cameraState: CameraState<Def>,
    gameScale: number,
    args: {renderingState: CanvasRenderingState}
  ): number {
    return gameScale * args.renderingState.scale;
  }
}
