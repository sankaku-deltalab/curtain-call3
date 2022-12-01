import {Vec2d} from '../utils/vec2d';
import {PointerInputTrait} from '../core/components';
import {GameState} from '../core/game-state';
import {Setting} from '../core/setting';

export class InputHelper {
  static deltaWhileDown<Stg extends Setting>(state: GameState<Stg>): Vec2d {
    return PointerInputTrait.deltaWhileDown(state.input.pointer);
  }

  static upped<Stg extends Setting>(state: GameState<Stg>): boolean {
    return PointerInputTrait.upped(state.input.pointer);
  }

  static downed<Stg extends Setting>(state: GameState<Stg>): boolean {
    return PointerInputTrait.downed(state.input.pointer);
  }
}
