import {Setting} from '../../setting';
import {CameraState, RenderingState} from '../camera';
import {
  CanvasPointerInput,
  CanvasPointerInputTrait,
  PointerInput,
  PointerInputState,
  PointerInputTrait,
} from './pointer-input';

export type Input<_Stg extends Setting> = {pointer: PointerInput};
export type InputState<_Stg extends Setting> = {pointer: PointerInputState};

export type CanvasInput<_Stg extends Setting> = {pointer: CanvasPointerInput};

export class InputTrait {
  static initialState<Stg extends Setting>(): InputState<Stg> {
    return {
      pointer: PointerInputTrait.initialState(),
    };
  }
}

export class CanvasInputTrait {
  static convertInputToGame<Stg extends Setting>(
    [canvasInput, inputState]: [CanvasInput<Stg>, InputState<Stg>],
    args: {camSt: CameraState<Stg>; renSt: RenderingState}
  ): [Input<Stg>, InputState<Stg>] {
    const [pointerInput, pointerState] =
      CanvasPointerInputTrait.convertInputToGame(
        [canvasInput.pointer, inputState.pointer],
        args
      );

    return [{pointer: pointerInput}, {pointer: pointerState}];
  }
}
