import {Setting} from '../setting';
import {AaRect2d, AaRect2dTrait, Vec2d, Vec2dTrait} from '../util';

export type CameraState<_Stg extends Setting> = {
  pos: Vec2d;
  size: Vec2d;
};

export type RenderingState = {
  center: Vec2d;
  scale: number;
  canvasSize: Vec2d;
};

export class CameraTrait {
  static initialState<Stg extends Setting>(args: {
    size: Vec2d;
  }): CameraState<Stg> {
    return {pos: Vec2dTrait.zero(), size: args.size};
  }

  static cameraArea<Stg extends Setting>(state: CameraState<Stg>): AaRect2d {
    const center = state.pos;
    const sizeHalf = Vec2dTrait.div(state.size, 2);
    return {
      nw: Vec2dTrait.add(center, sizeHalf),
      se: Vec2dTrait.sub(center, sizeHalf),
    };
  }

  static projectCanvasPointToGame<Stg extends Setting>(
    canvasPos: Vec2d,
    args: {camSt: CameraState<Stg>; renSt: RenderingState}
  ): Vec2d {
    const camSt = args.camSt;
    const renSt = args.renSt;

    const canvasArea = {
      nw: Vec2dTrait.zero(),
      se: renSt.canvasSize,
    };
    const renderingArea = AaRect2dTrait.fromCenterAndSize(
      renSt.center,
      Vec2dTrait.mlt(camSt.size, renSt.scale)
    );
    const cameraArea = CameraTrait.cameraArea(args.camSt);

    const renderingAreaPos = AaRect2dTrait.projectPoint(canvasPos, {
      prevArea: canvasArea,
      nextArea: renderingArea,
    });
    const gameAreaPos = AaRect2dTrait.projectPoint(renderingAreaPos, {
      prevArea: renderingArea,
      nextArea: cameraArea,
    });
    return gameAreaPos;
  }

  static projectGamePointToCanvas<Stg extends Setting>(
    gamePos: Vec2d,
    args: {camSt: CameraState<Stg>; renSt: RenderingState}
  ): Vec2d {
    const camSt = args.camSt;
    const renSt = args.renSt;

    const canvasArea = {
      nw: Vec2dTrait.zero(),
      se: renSt.canvasSize,
    };
    const renderingArea = AaRect2dTrait.fromCenterAndSize(
      renSt.center,
      Vec2dTrait.mlt(camSt.size, renSt.scale)
    );
    const cameraArea = CameraTrait.cameraArea(args.camSt);

    const renderingAreaPos = AaRect2dTrait.projectPoint(gamePos, {
      prevArea: cameraArea,
      nextArea: renderingArea,
    });
    const canvasAreaPos = AaRect2dTrait.projectPoint(renderingAreaPos, {
      prevArea: renderingArea,
      nextArea: canvasArea,
    });
    return canvasAreaPos;
  }

  static gameScaleToRenderingScale(
    gameScale: number,
    args: {renSt: RenderingState}
  ): number {
    return gameScale * args.renSt.scale;
  }
}
