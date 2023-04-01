import {
  DataDefinition,
  DynamicSourceId,
  DynamicSourceItem,
  DynamicSourceProps,
  DynamicSourceType,
} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {TDynamicSourcesState} from '../../core/state/state-components/dynamic-sources-state';

export class DynamicSourceHelper {
  static fetch<Def extends DataDefinition, Type extends DynamicSourceType<Def>>(
    state: GameState<Def>,
    type: Type,
    id: DynamicSourceId<Def, Type>,
    props: DynamicSourceProps<Def, Type>
  ): DynamicSourceItem<Def, Type> {
    return TDynamicSourcesState.fetchB(
      state.dynamicSources,
      type,
      id,
      props,
      state
    );
  }

  static getIds<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(state: GameState<Def>, type: Type): DynamicSourceId<Def, Type>[] {
    return TDynamicSourcesState.keys(state.dynamicSources, type);
  }
}
