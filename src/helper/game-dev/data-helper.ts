import {
  DataDefinition,
  DataSourceId,
  DataSourceItem,
  DataSourceType,
  DynamicSourceId,
  DynamicSourceItem,
  DynamicSourceProps,
  DynamicSourceType,
} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {TDataSourcesState} from '../../core/state/state-components/data-sources-state';
import {TDynamicSourcesState} from '../../core/state/state-components/dynamic-sources-state';

export class DataHelper {
  static fetchDataSourceB<
    Def extends DataDefinition,
    Type extends DataSourceType<Def>
  >(
    state: GameState<Def>,
    type: Type,
    id: DataSourceId<Def, Type>
  ): DataSourceItem<Def, Type> {
    return TDataSourcesState.fetchB(state.dataSources, type, id);
  }

  static fetchDynamicSourceB<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(
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
}
