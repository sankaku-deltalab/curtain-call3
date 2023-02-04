import {GameState} from '../core/game-state';
import {
  DynamicSourceKey,
  DynamicSourceProps,
  DynamicSourceTypes,
  DynamicSourceValue,
  Setting,
} from '../core/setting';
import {DynamicSources, DynamicSourcesTrait} from '../core/dynamic-sources';

export class DynamicSourceHelper {
  static fetch<Stg extends Setting, Type extends DynamicSourceTypes<Stg>>(
    sources: DynamicSources<Stg>,
    type: Type,
    key: DynamicSourceKey<Stg, Type>,
    props: DynamicSourceProps<Stg, Type>,
    state: GameState<Stg>
  ): DynamicSourceValue<Stg, Type> {
    return DynamicSourcesTrait.fetch(sources, type, key, props, state);
  }
}
