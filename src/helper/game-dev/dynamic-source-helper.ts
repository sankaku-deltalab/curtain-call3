import {
  DataDefinition,
  DynamicSourceId,
  DynamicSourceItem,
  DynamicSourceProps,
  DynamicSourceType,
} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {
  DynamicSourceFunction,
  TDynamicSourcesState,
} from '../../core/state/state-components/dynamic-sources-state';

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

  static keys<Def extends DataDefinition, Type extends DynamicSourceType<Def>>(
    state: GameState<Def>,
    type: Type
  ): DynamicSourceId<Def, Type>[] {
    return TDynamicSourcesState.keys(state.dynamicSources, type);
  }

  static values<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(state: GameState<Def>, type: Type): DynamicSourceFunction<Def, Type>[] {
    return TDynamicSourcesState.values(state.dynamicSources, type);
  }

  static entires<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(
    state: GameState<Def>,
    type: Type
  ): [DynamicSourceId<Def, Type>, DynamicSourceFunction<Def, Type>][] {
    return TDynamicSourcesState.entires(state.dynamicSources, type);
  }
}
