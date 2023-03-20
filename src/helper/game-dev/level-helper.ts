import {DataDefinition, Level} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {TLevelState} from '../../core/state/state-components/level-state';

export class BodiesHelper {
  static getLevel<Def extends DataDefinition>(
    state: GameState<Def>
  ): Level<Def> {
    return TLevelState.getLevel(state.level);
  }

  static putLevel<Def extends DataDefinition>(
    state: GameState<Def>,
    level: Level<Def>
  ): GameState<Def> {
    return {
      ...state,
      level: TLevelState.putLevel(state.level, level),
    };
  }
}
