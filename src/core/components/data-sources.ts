import {
  DataSourceKey,
  DataSourceTypes,
  DataSourceValue,
  Setting,
} from '../setting';

export type DataSources<Stg extends Setting> = {
  [Type in DataSourceTypes<Stg>]: Record<
    DataSourceKey<Stg, Type>,
    DataSourceValue<Stg, Type>
  >;
};

export type DataSourcesState<Stg extends Setting> = Readonly<{
  dataSources: DataSources<Stg>;
}>;

export class DataSourcesTrait {
  static initialState<Stg extends Setting>(
    dataSources: DataSources<Stg>
  ): DataSourcesState<Stg> {
    return {
      dataSources,
    };
  }

  static fetch<
    Stg extends Setting,
    Type extends DataSourceTypes<Stg>,
    Key extends DataSourceKey<Stg, Type>
  >(
    ds: DataSourcesState<Stg>,
    type: Type,
    key: Key
  ): DataSourceValue<Stg, Type> {
    const source = ds.dataSources[type];
    if (!(key in source))
      throw new Error(`data source "${type}" do not have key "${key}"`);
    return ds.dataSources[type][key];
  }
}
