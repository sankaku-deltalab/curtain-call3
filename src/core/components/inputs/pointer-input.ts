import {Setting} from '../../setting';
import {Vec2d, Vec2dTrait} from '../../util';
import {CameraState, CameraTrait, RenderingState} from '../camera';

export type PointerInput = {current: Pointer; prev: Pointer};
export type PointerInputState = {prev: Pointer};

export type Pointer = {
  down: boolean;
  pos: Vec2d;
};

export type CanvasPointerInput = {
  down: boolean;
  canvasPos: Vec2d;
};

export class PointerInputTrait {
  static deltaWhileDown(input: PointerInput): Vec2d {
    const {current, prev} = input;
    const downing = current.down && prev.down;

    if (!downing) {
      return Vec2dTrait.zero();
    }

    return Vec2dTrait.sub(current.pos, prev.pos);
  }
}

export class CanvasPointerInputTrait {
  static convertInputToGame<Stg extends Setting>(
    [canvasPointer, inputState]: [CanvasPointerInput, PointerInputState],
    args: {camSt: CameraState<Stg>; renSt: RenderingState}
  ): [PointerInput, PointerInputState] {
    const pointer = CanvasPointerInputTrait.convertPointerToGame(
      canvasPointer,
      args
    );
    const st: PointerInputState = {prev: pointer};
    const input: PointerInput = {current: pointer, prev: inputState.prev};
    return [input, st];
  }

  private static convertPointerToGame<Stg extends Setting>(
    canvasPointer: CanvasPointerInput,
    args: {camSt: CameraState<Stg>; renSt: RenderingState}
  ): Pointer {
    const pos = CameraTrait.projectCanvasPointToGame(
      canvasPointer.canvasPos,
      args
    );
    return {
      pos,
      down: canvasPointer.down,
    };
  }
}
