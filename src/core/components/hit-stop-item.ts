import {Im} from '../../utils';
import {
  AnyTypeBodyId,
  BodyType,
  DataDefinition,
} from '../setting/data-definition';

type BodyIdKey = string;
type NonNegInteger = number;
type TimeScale = number;
type EngineTimeMs = number;
type GameTimeMs = number;

export type HitStopItem<Def extends DataDefinition> = {
  target: HitStopItemTarget<Def>;
  props: HitStopItemProps<Def>;
  state: HitStopItemState<Def>;
};

export type HitStopItemAttrs<Def extends DataDefinition> = {
  target: HitStopItemTarget<Def>;
  props: HitStopItemProps<Def>;
};

export type HitStopItemTarget<Def extends DataDefinition> =
  | {
      type: 'specified-bodies';
      ids: AnyTypeBodyId<Def>[];
    }
  | {
      type: 'specified-body-types';
      ids: BodyType<Def>[];
    }
  | {
      type: 'all-bodies';
    }
  | {
      type: 'whole-world';
    };

export type HitStopItemProps<_Def extends DataDefinition> =
  | {
      type: 'constant';
      engineTimeDurationMs: EngineTimeMs;
      gameTimeDurationMs: GameTimeMs;
    }
  | {
      type: 'linear-curve';
      engineGameTimePoints: [EngineTimeMs, GameTimeMs][];
    }
  | {
      type: 'frame-drop';
      dropInterval: NonNegInteger;
    };

export type HitStopItemState<_Def extends DataDefinition> =
  | {
      type: 'constant';
      consumedEngineTimeMs: EngineTimeMs;
    }
  | {
      type: 'linear-curve';
      consumedEngineTimeMs: EngineTimeMs;
    }
  | {
      type: 'frame-drop';
      droppedCount: NonNegInteger;
    };

const initialStates = {
  constant: {type: 'constant', consumedEngineTimeMs: 0},
  'linear-curve': {type: 'linear-curve', consumedEngineTimeMs: 0},
  'frame-drop': {type: 'frame-drop', droppedCount: 0},
} as const;

export type HitStopTimeScalesCache<Def extends DataDefinition> = {
  eachBodiesTimeScaleCache: Record<BodyIdKey, TimeScale>;
  eachBodyTypesTimeScaleCache: Partial<Record<BodyType<Def>, TimeScale>>;
  allBodiesTimeScaleCache: number;
  worldTimeScaleCache: number;
};

export class THitStopsItem {
  static new<Def extends DataDefinition>(
    attrs: HitStopItemAttrs<Def>
  ): HitStopItem<Def> {
    const itemState: HitStopItemState<Def> = initialStates[attrs.props.type];
    return {
      target: attrs.target,
      props: attrs.props,
      state: itemState,
    };
  }

  static createNullCache<
    Def extends DataDefinition
  >(): HitStopTimeScalesCache<Def> {
    return {
      eachBodiesTimeScaleCache: {},
      eachBodyTypesTimeScaleCache: {},
      allBodiesTimeScaleCache: 1,
      worldTimeScaleCache: 1,
    };
  }

  static update<Def extends DataDefinition>(
    item: HitStopItem<Def>,
    engineDeltaTimeMs: EngineTimeMs
  ): HitStopItem<Def> {
    const {props, state} = item;
    if (props.type !== state.type) throw Error('Invalid item');

    switch (props.type) {
      case 'constant': {
        if (props.type !== state.type) throw Error('Invalid item');
        const newState = Im.update(
          state,
          'consumedEngineTimeMs',
          t => t + engineDeltaTimeMs
        );
        return {
          ...item,
          state: newState,
        };
      }
      case 'linear-curve':
        throw new Error('linear-curve hit stop item is not implemented.');
      case 'frame-drop':
        throw new Error('frame-drop hit stop item is not implemented.');
    }
  }

  static isAlive<Def extends DataDefinition>(item: HitStopItem<Def>): boolean {
    const {props, state} = item;
    if (props.type !== state.type) throw Error('Invalid item');

    switch (props.type) {
      case 'constant':
        if (props.type !== state.type) throw Error('Invalid item'); // for type-inference
        return state.consumedEngineTimeMs <= props.engineTimeDurationMs;
      case 'linear-curve':
        throw new Error('linear-curve hit stop item is not implemented.');
      case 'frame-drop':
        throw new Error('frame-drop hit stop item is not implemented.');
    }
  }

  static isValid<Def extends DataDefinition>(item: HitStopItem<Def>): boolean {
    switch (item.props.type) {
      case 'constant':
        return (
          item.props.engineTimeDurationMs > 0 &&
          item.props.gameTimeDurationMs >= 0
        );
      case 'linear-curve':
        throw new Error('linear-curve hit stop item is not implemented.');
      case 'frame-drop':
        throw new Error('frame-drop hit stop item is not implemented.');
    }
  }

  static updateMutCache<Def extends DataDefinition>(
    item: HitStopItem<Def>,
    mutCache: HitStopTimeScalesCache<Def>
  ): void {
    const {target} = item;
    const timeScale = this.calcCacheTimeScale(item);

    switch (target.type) {
      case 'specified-bodies':
        for (const bodyId of target.ids) {
          const bodyIdKey = bodyId[1];
          const oldScale = mutCache.eachBodiesTimeScaleCache[bodyIdKey] ?? 1;
          mutCache.eachBodiesTimeScaleCache[bodyIdKey] = oldScale * timeScale;
        }
        return;
      case 'specified-body-types':
        for (const bodyType of target.ids) {
          const oldScale = mutCache.eachBodyTypesTimeScaleCache[bodyType] ?? 1;
          mutCache.eachBodyTypesTimeScaleCache[bodyType] = oldScale * timeScale;
        }
        return;
      case 'all-bodies':
        mutCache.allBodiesTimeScaleCache *= timeScale;
        return;
      case 'whole-world':
        mutCache.worldTimeScaleCache *= timeScale;
        return;
    }
  }

  private static calcCacheTimeScale<Def extends DataDefinition>(
    item: HitStopItem<Def>
  ): TimeScale {
    switch (item.props.type) {
      case 'constant':
        return item.props.gameTimeDurationMs / item.props.engineTimeDurationMs;
      case 'linear-curve':
        throw new Error('linear-curve hit stop item is not implemented.');
      case 'frame-drop':
        throw new Error('frame-drop hit stop item is not implemented.');
    }
  }
}
