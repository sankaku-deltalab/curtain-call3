import {Vec2d} from '../utils/util';
import {PointerInputTrait} from '../core/components';
import {GameState} from '../core/game-state';
import {Setting} from '../core/setting';

export class InputHelper {
  static deltaWhileDown<Stg extends Setting>(state: GameState<Stg>): Vec2d {
    return PointerInputTrait.deltaWhileDown(state.input.pointer);
  }
}
