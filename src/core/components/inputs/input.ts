import {Setting} from '../../setting';
import {Im} from '../../../utils/immutable-manipulation';
import {CameraState, RenderingState} from '../camera';
import {
  CanvasInputPointer,
  PointerInputState,
  PointerInputTrait,
} from './pointer-input';

export type InputState<_Stg extends Setting> = {pointer: PointerInputState};
export type CanvasInput<_Stg extends Setting> = {pointer: CanvasInputPointer};

export class InputTrait {
  static initialState<Stg extends Setting>(): InputState<Stg> {
    return {
      pointer: PointerInputTrait.initialState(),
    };
  }

  static updateState<Stg extends Setting>(
    state: InputState<Stg>,
    args: {
      canvasInput: CanvasInput<Stg>;
      camSt: CameraState<Stg>;
      renSt: RenderingState;
    }
  ): InputState<Stg> {
    const pointerArgs = {
      canvasPointer: args.canvasInput.pointer,
      ...args,
    };

    return Im.pipe(
      () => state,
      st =>
        Im.replace(st, 'pointer', s =>
          PointerInputTrait.updateState(s, pointerArgs)
        )
    )();
  }
}
