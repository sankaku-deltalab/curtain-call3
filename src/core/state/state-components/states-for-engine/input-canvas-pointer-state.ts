import {Vec2d, Vec2dTrait} from '../../../../utils';
import {DataDefinition} from '../../../setting/data-definition';
import {CameraState, CanvasRenderingState, TCameraState} from '../camera-state';
import {RawPointerState} from '../input-pointer-state';

export type InputCanvasPointerState = {
  pointer: RawCanvasPointerState;
};

export type RawCanvasPointerState = {
  down: boolean;
  canvasPos: Vec2d;
};

export class TInputCanvasPointerState {
  static new(): InputCanvasPointerState {
    return {
      pointer: {down: false, canvasPos: Vec2dTrait.zero()},
    };
  }

  static convertToRawPointer<Def extends DataDefinition>(
    canvasPointer: InputCanvasPointerState,
    args: {
      cameraState: CameraState<Def>;
      renderingState: CanvasRenderingState;
    }
  ): RawPointerState {
    const pos = TCameraState.projectCanvasPointToGame(
      args.cameraState,
      canvasPointer.pointer.canvasPos,
      {renderingState: args.renderingState}
    );
    return {
      pos,
      down: canvasPointer.pointer.down,
    };
  }
}
