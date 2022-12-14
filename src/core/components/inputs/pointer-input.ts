import {Setting} from '../../setting';
import {Vec2d, Vec2dTrait} from '../../../utils/vec2d';
import {CameraState, CameraTrait, RenderingState} from '../camera';

export type PointerInputState = {current: Pointer; prev: Pointer};

export type Pointer = Readonly<{
  down: boolean;
  pos: Vec2d;
}>;

export type CanvasInputPointer = Readonly<{
  down: boolean;
  canvasPos: Vec2d;
}>;

export class PointerInputTrait {
  static initialState(): PointerInputState {
    return {
      current: {down: false, pos: Vec2dTrait.zero()},
      prev: {down: false, pos: Vec2dTrait.zero()},
    };
  }

  static deltaWhileDown(input: PointerInputState): Vec2d {
    const {current, prev} = input;
    const downing = current.down && prev.down;

    if (!downing) {
      return Vec2dTrait.zero();
    }

    return Vec2dTrait.sub(current.pos, prev.pos);
  }

  static upped(input: PointerInputState): boolean {
    const {current, prev} = input;
    return !current.down && prev.down;
  }

  static downed(input: PointerInputState): boolean {
    const {current, prev} = input;
    return current.down && !prev.down;
  }

  static updateState<Stg extends Setting>(
    state: PointerInputState,
    args: {
      canvasPointer: CanvasInputPointer;
      camSt: CameraState<Stg>;
      renSt: RenderingState;
    }
  ): PointerInputState {
    const newPointer = this.convertCanvasPointerToGame(
      args.canvasPointer,
      args
    );
    return {
      current: newPointer,
      prev: state.current,
    };
  }

  private static convertCanvasPointerToGame<Stg extends Setting>(
    canvasPointer: CanvasInputPointer,
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
