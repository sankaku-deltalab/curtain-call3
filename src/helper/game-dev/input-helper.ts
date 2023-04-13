import {CustomInputs, DataDefinition} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {TInputCustomState} from '../../core/state/state-components/input-custom-state';
import {TInputPointerState} from '../../core/state/state-components/input-pointer-state';
import {Vec2d} from '../../utils/vec2d';

export class InputHelper {
  // pointer
  static pointerDeltaWhileDown<Def extends DataDefinition>(
    state: GameState<Def>
  ): Vec2d {
    return TInputPointerState.moveDeltaWhileDown(state.inputPointer);
  }

  static pointerUpped<Def extends DataDefinition>(
    state: GameState<Def>
  ): boolean {
    return TInputPointerState.upped(state.inputPointer);
  }

  static pointerDowned<Def extends DataDefinition>(
    state: GameState<Def>
  ): boolean {
    return TInputPointerState.downed(state.inputPointer);
  }

  // custom
  static getCurrentCustomInputs<Def extends DataDefinition>(
    state: GameState<Def>
  ): CustomInputs<Def> {
    return TInputCustomState.getCurrent(state.inputCustom);
  }

  static getPreviousCustomInputs<Def extends DataDefinition>(
    state: GameState<Def>
  ): CustomInputs<Def> {
    return TInputCustomState.getCurrent(state.inputCustom);
  }
}
