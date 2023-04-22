import {DataDefinition, Level} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {TLevelState} from '../../core/state/state-components/level-state';
import {Im} from '../../utils';

export class LevelHelper {
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

  static updateLevel<Def extends DataDefinition>(
    state: GameState<Def>,
    updater: (level: Level<Def>) => Level<Def>
  ): GameState<Def> {
    const newLevel = Im.pipe(
      () => state,
      state => this.getLevel(state),
      lv => updater(lv)
    )();
    return this.putLevel(state, newLevel);
  }
}
