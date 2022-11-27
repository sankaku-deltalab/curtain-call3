import {Setting} from '../setting';
import {AaRect2d, AaRect2dTrait, Vec2d, Vec2dTrait} from '../../utils/util';

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
    return AaRect2dTrait.fromCenterAndSize(state.pos, state.size);
  }

  static projectCanvasPointToGame<Stg extends Setting>(
    canvasPos: Vec2d,
    args: {camSt: CameraState<Stg>; renSt: RenderingState}
  ): Vec2d {
    const camSt = args.camSt;
    const renSt = args.renSt;

    const renderingArea = AaRect2dTrait.fromCenterAndSize(
      renSt.center,
      Vec2dTrait.mlt(camSt.size, renSt.scale)
    );
    const cameraArea = CameraTrait.cameraArea(args.camSt);

    const gameAreaPos = AaRect2dTrait.projectPoint(canvasPos, {
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

    const renderingArea = AaRect2dTrait.fromCenterAndSize(
      renSt.center,
      Vec2dTrait.mlt(camSt.size, renSt.scale)
    );
    const cameraArea = CameraTrait.cameraArea(args.camSt);

    const renderingAreaPos = AaRect2dTrait.projectPoint(gamePos, {
      prevArea: cameraArea,
      nextArea: renderingArea,
    });
    return renderingAreaPos;
  }

  static gameScaleToRenderingScale(
    gameScale: number,
    args: {renSt: RenderingState}
  ): number {
    return gameScale * args.renSt.scale;
  }
}
