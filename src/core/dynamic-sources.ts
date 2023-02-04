import {GameState} from './game-state';
import {
  DynamicSourceKey,
  DynamicSourceProps,
  DynamicSourceTypes,
  DynamicSourceValue,
  Setting,
} from './setting';

export type DynamicSourceFunction<
  Stg extends Setting,
  Type extends DynamicSourceTypes<Stg>
> = (
  props: DynamicSourceProps<Stg, Type>,
  state: GameState<Stg>
) => DynamicSourceValue<Stg, Type>;

export type DynamicSources<Stg extends Setting> = {
  [Type in DynamicSourceTypes<Stg>]: Record<
    DynamicSourceKey<Stg, Type>,
    DynamicSourceFunction<Stg, Type>
  >;
};

export class DynamicSourcesTrait {
  static new<Stg extends Setting>(
    dynamicSources: DynamicSources<Stg>
  ): DynamicSources<Stg> {
    return dynamicSources;
  }

  static fetch<Stg extends Setting, Type extends DynamicSourceTypes<Stg>>(
    sources: DynamicSources<Stg>,
    type: Type,
    key: DynamicSourceKey<Stg, Type>,
    props: DynamicSourceProps<Stg, Type>,
    state: GameState<Stg>
  ): DynamicSourceValue<Stg, Type> {
    const source = sources[type];
    if (!(key in source))
      throw new Error(`dynamic source "${type}" do not have key "${key}"`);
    return sources[type][key](props, state);
  }
}
