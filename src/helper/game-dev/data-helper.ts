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
import {
  DynamicSourceFunction,
  TDynamicSourcesState,
} from '../../core/state/state-components/dynamic-sources-state';

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

  static keysFromDataSource<
    Def extends DataDefinition,
    Type extends DataSourceType<Def>
  >(state: GameState<Def>, type: Type): DataSourceId<Def, Type>[] {
    return TDataSourcesState.keys(state.dataSources, type);
  }

  static valuesFromDataSource<
    Def extends DataDefinition,
    Type extends DataSourceType<Def>
  >(state: GameState<Def>, type: Type): DataSourceItem<Def, Type>[] {
    return TDataSourcesState.values(state.dataSources, type);
  }

  static entiresFromDataSource<
    Def extends DataDefinition,
    Type extends DataSourceType<Def>
  >(
    state: GameState<Def>,
    type: Type
  ): [DataSourceId<Def, Type>, DataSourceItem<Def, Type>][] {
    return TDataSourcesState.entires(state.dataSources, type);
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

  static keysFromDynamicSource<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(state: GameState<Def>, type: Type): DynamicSourceId<Def, Type>[] {
    return TDynamicSourcesState.keys(state.dynamicSources, type);
  }

  static valuesFromDynamicSource<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(state: GameState<Def>, type: Type): DynamicSourceFunction<Def, Type>[] {
    return TDynamicSourcesState.values(state.dynamicSources, type);
  }

  static entiresFromDynamicSource<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(
    state: GameState<Def>,
    type: Type
  ): [DynamicSourceId<Def, Type>, DynamicSourceFunction<Def, Type>][] {
    return TDynamicSourcesState.entires(state.dynamicSources, type);
  }
}
