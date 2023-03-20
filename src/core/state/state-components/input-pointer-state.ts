import {Vec2d, Vec2dTrait} from '../../../utils/vec2d';
import {DataDefinition} from '../../setting/data-definition';

export type InputPointerState = {
  current: RawPointerState;
  prev: RawPointerState;
};

export type RawPointerState = Readonly<{
  down: boolean;
  pos: Vec2d;
}>;

export class TInputPointerState {
  static new(): InputPointerState {
    return {
      current: {down: false, pos: Vec2dTrait.zero()},
      prev: {down: false, pos: Vec2dTrait.zero()},
    };
  }

  static update<_Def extends DataDefinition>(
    state: InputPointerState,
    args: {
      newRawPointer: RawPointerState;
    }
  ): InputPointerState {
    return {
      current: args.newRawPointer,
      prev: state.current,
    };
  }

  static moveDeltaWhileDown(input: InputPointerState): Vec2d {
    const {current, prev} = input;
    const downing = current.down && prev.down;

    if (!downing) {
      return Vec2dTrait.zero();
    }

    return Vec2dTrait.sub(current.pos, prev.pos);
  }

  static upped(input: InputPointerState): boolean {
    const {current, prev} = input;
    return !current.down && prev.down;
  }

  static downed(input: InputPointerState): boolean {
    const {current, prev} = input;
    return current.down && !prev.down;
  }
}
