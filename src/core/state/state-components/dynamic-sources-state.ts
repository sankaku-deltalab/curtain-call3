import {
  DataDefinition,
  DynamicSourceId,
  DynamicSourceItem,
  DynamicSourceProps,
  DynamicSourceType,
} from '../../setting/data-definition';
import {GameState} from '../game-states';

export type DynamicSources<Def extends DataDefinition> = {
  [Type in DynamicSourceType<Def>]: Record<
    DynamicSourceId<Def, Type>,
    DynamicSourceFunction<Def, Type>
  >;
};

export type DynamicSourceFunction<
  Def extends DataDefinition,
  Type extends DynamicSourceType<Def>
> = (
  props: DynamicSourceProps<Def, Type>,
  state: GameState<Def>
) => DynamicSourceItem<Def, Type>;

export type DynamicSourcesState<Def extends DataDefinition> = {
  dynamicSources: DynamicSources<Def>;
};

export class TDynamicSourcesState {
  static new<Def extends DataDefinition>(
    dynamicSources: DynamicSources<Def>
  ): DynamicSourcesState<Def> {
    return {dynamicSources};
  }

  static fetchB<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(
    sources: DynamicSourcesState<Def>,
    type: Type,
    id: DynamicSourceId<Def, Type>,
    props: DynamicSourceProps<Def, Type>,
    state: GameState<Def>
  ): DynamicSourceItem<Def, Type> {
    const source = sources.dynamicSources[type];
    if (!(id in source))
      throw new Error(`dynamic source "${type}" do not have id "${id}"`);
    return source[id](props, state);
  }

  static keys<Def extends DataDefinition, Type extends DynamicSourceType<Def>>(
    ds: DynamicSourcesState<Def>,
    type: Type
  ): DynamicSourceId<Def, Type>[] {
    const source = ds.dynamicSources[type];
    return Object.keys(source);
  }

  static values<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(
    ds: DynamicSourcesState<Def>,
    type: Type
  ): DynamicSourceFunction<Def, Type>[] {
    const source = ds.dynamicSources[type];
    return Object.values(source);
  }

  static entires<
    Def extends DataDefinition,
    Type extends DynamicSourceType<Def>
  >(
    ds: DynamicSourcesState<Def>,
    type: Type
  ): [DynamicSourceId<Def, Type>, DynamicSourceFunction<Def, Type>][] {
    const source = ds.dynamicSources[type];
    return Object.entries(source);
  }
}
