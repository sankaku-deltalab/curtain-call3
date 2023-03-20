import {DataDefinition} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {TInputPointerState} from '../../core/state/state-components/input-pointer-state';
import {Vec2d} from '../../utils/vec2d';

export class InputHelper {
  static deltaWhileDown<Def extends DataDefinition>(
    state: GameState<Def>
  ): Vec2d {
    return TInputPointerState.moveDeltaWhileDown(state.inputPointer);
  }

  static upped<Def extends DataDefinition>(state: GameState<Def>): boolean {
    return TInputPointerState.upped(state.inputPointer);
  }

  static downed<Def extends DataDefinition>(state: GameState<Def>): boolean {
    return TInputPointerState.downed(state.inputPointer);
  }
}
