import {Vec2d, TVec2d} from '../../../utils/vec2d';
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
      current: {down: false, pos: TVec2d.zero()},
      prev: {down: false, pos: TVec2d.zero()},
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
      return TVec2d.zero();
    }

    return TVec2d.sub(current.pos, prev.pos);
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
