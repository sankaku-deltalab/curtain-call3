import {
  DataDefinition,
  DataSourceId,
  DataSourceItem,
  DataSourceType,
} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {TDataSourcesState} from '../../core/state/state-components/data-sources-state';

export class DataSourceHelper {
  static fetch<Def extends DataDefinition, Type extends DataSourceType<Def>>(
    state: GameState<Def>,
    type: Type,
    id: DataSourceId<Def, Type>
  ): DataSourceItem<Def, Type> {
    return TDataSourcesState.fetchB(state.dataSources, type, id);
  }

  static keys<Def extends DataDefinition, Type extends DataSourceType<Def>>(
    state: GameState<Def>,
    type: Type
  ): DataSourceId<Def, Type>[] {
    return TDataSourcesState.keys(state.dataSources, type);
  }

  static values<Def extends DataDefinition, Type extends DataSourceType<Def>>(
    state: GameState<Def>,
    type: Type
  ): DataSourceItem<Def, Type>[] {
    return TDataSourcesState.values(state.dataSources, type);
  }

  static entires<Def extends DataDefinition, Type extends DataSourceType<Def>>(
    state: GameState<Def>,
    type: Type
  ): [DataSourceId<Def, Type>, DataSourceItem<Def, Type>][] {
    return TDataSourcesState.entires(state.dataSources, type);
  }
}
