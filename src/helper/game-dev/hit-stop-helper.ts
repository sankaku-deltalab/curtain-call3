import {
  HitStopItemAttrs,
  THitStopsItem,
} from '../../core/components/hit-stop-item';
import {DataDefinition} from '../../core/setting/data-definition';
import {THitStopsState} from '../../core/state';
import {GameState} from '../../core/state/game-states';

export class HitStopHelper {
  static addHitStop<Def extends DataDefinition>(
    state: GameState<Def>,
    attrs: HitStopItemAttrs<Def>
  ): GameState<Def> {
    const item = THitStopsItem.new(attrs);
    return {
      ...state,
      hitStops: THitStopsState.addHitStop(state.hitStops, item),
    };
  }

  static cancelAllHitStops<Def extends DataDefinition>(
    state: GameState<Def>
  ): GameState<Def> {
    return {
      ...state,
      hitStops: THitStopsState.cancelAllHitStops(state.hitStops),
    };
  }
}
