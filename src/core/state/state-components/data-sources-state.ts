import {
  DataDefinition,
  DataSourceType,
  DataSourceId,
  DataSourceItem,
} from '../../setting/data-definition';

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
    dataSources: DataSources<Def>
  ): DataSourcesState<Def> {
    return {
      dataSources,
    };
  }

  static fetchB<
    Def extends DataDefinition,
    Type extends DataSourceType<Def>,
    Id extends DataSourceId<Def, Type>
  >(ds: DataSourcesState<Def>, type: Type, id: Id): DataSourceItem<Def, Type> {
    const source = ds.dataSources[type];
    if (!(id in source))
      throw new Error(`data source "${type}" do not have id "${id}"`);
    return source[id];
  }
}
