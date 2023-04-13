import {Vec2d, TVec2d} from '../../../../utils';
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

const initialRawCanvasPointer: RawCanvasPointerState = {
  down: false,
  canvasPos: TVec2d.zero(),
};

export class TInputCanvasPointerState {
  static new(
    rawCanvasPointer: RawCanvasPointerState = initialRawCanvasPointer
  ): InputCanvasPointerState {
    return {
      pointer: rawCanvasPointer,
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
