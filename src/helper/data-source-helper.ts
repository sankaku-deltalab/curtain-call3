import {GameState} from '../core/game-state';
import {
  DataSourceKey,
  DataSourceTypes,
  DataSourceValue,
  Setting,
} from '../core/setting';
import {DataSourcesTrait} from '../core/components/data-sources';

export class DataSourceHelper {
  static fetch<
    Stg extends Setting,
    Type extends DataSourceTypes<Stg>,
    Key extends DataSourceKey<Stg, Type>
  >(state: GameState<Stg>, type: Type, key: Key): DataSourceValue<Stg, Type> {
    return DataSourcesTrait.fetch(state.dataSources, type, key);
  }
}
