import {
  DataDefinition,
  DataSourceType,
  DataSourceId,
  DataSourceItem,
} from '../../setting/data-definition';

export type DataSourcesList<Def extends DataDefinition> = {
  [Type in DataSourceType<Def>]: DataSourceItem<Def, Type>[];
};

export type DataSources<Def extends DataDefinition> = {
  [Type in DataSourceType<Def>]: Record<
    DataSourceId<Def, Type>,
    DataSourceItem<Def, Type>
  >;
};

export type DataSourcesState<Def extends DataDefinition> = Readonly<{
  dataSources: DataSources<Def>;
}>;

export class TDataSourcesState {
  static new<Def extends DataDefinition>(
    dataSources: DataSourcesList<Def>
  ): DataSourcesState<Def> {
    return {
      dataSources: this.dataSourcesListToDataSources(dataSources),
    };
  }

  static fetchB<Def extends DataDefinition, Type extends DataSourceType<Def>>(
    ds: DataSourcesState<Def>,
    type: Type,
    id: DataSourceId<Def, Type>
  ): DataSourceItem<Def, Type> {
    const source = ds.dataSources[type];
    if (!(id in source))
      throw new Error(`data source "${type}" do not have id "${id}"`);
    return source[id];
  }

  static keys<Def extends DataDefinition, Type extends DataSourceType<Def>>(
    ds: DataSourcesState<Def>,
    type: Type
  ): DataSourceId<Def, Type>[] {
    const source = ds.dataSources[type];
    return Object.keys(source);
  }

  static values<Def extends DataDefinition, Type extends DataSourceType<Def>>(
    ds: DataSourcesState<Def>,
    type: Type
  ): DataSourceItem<Def, Type>[] {
    const source = ds.dataSources[type];
    return Object.values(source);
  }

  static entires<Def extends DataDefinition, Type extends DataSourceType<Def>>(
    ds: DataSourcesState<Def>,
    type: Type
  ): [DataSourceId<Def, Type>, DataSourceItem<Def, Type>][] {
    const source = ds.dataSources[type];
    return Object.entries(source);
  }

  private static dataSourcesListToDataSources<Def extends DataDefinition>(
    dataSources: DataSourcesList<Def>
  ): DataSources<Def> {
    const r = Object.entries(dataSources).map<
      [string, Record<string, DataSourceItem<Def, string>>]
    >(([type, items]) => {
      const itemsObj = Object.fromEntries(items.map(item => [item.id, item]));
      return [type, itemsObj];
    });
    return Object.fromEntries(r) as DataSources<Def>;
  }
}
