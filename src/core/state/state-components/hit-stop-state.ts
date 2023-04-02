import {Enum, Im, ImList, TImList} from '../../../utils';
import {
  HitStopItem,
  HitStopTimeScalesCache,
  THitStopsItem,
} from '../../components/hit-stop-item';
import {AnyTypeBodyId, DataDefinition} from '../../setting/data-definition';

type TimeScale = number;
type EngineTimeMs = number;

export type HitStopsState<Def extends DataDefinition> = Readonly<{
  aliveItems: ImList<HitStopItem<Def>>;
  cache: HitStopTimeScalesCache<Def>;
}>;

export class THitStopsState {
  static new<Def extends DataDefinition>(): HitStopsState<Def> {
    return {
      aliveItems: TImList.new(),
      cache: THitStopsItem.createNullCache(),
    };
  }

  static cancelAllHitStops<Def extends DataDefinition>(
    state: HitStopsState<Def>
  ): HitStopsState<Def> {
    return {
      ...state,
      aliveItems: TImList.new(),
    };
  }

  static update<Def extends DataDefinition>(
    state: HitStopsState<Def>,
    engineDeltaTimeMs: EngineTimeMs
  ): HitStopsState<Def> {
    const aliveItemsArray = Im.pipe(
      () => state.aliveItems,
      items => TImList.toArray(items),
      items =>
        Enum.map(items, item => THitStopsItem.update(item, engineDeltaTimeMs)),
      items => Enum.filter(items, item => THitStopsItem.isAlive(item))
    )();

    const aliveItems = Im.pipe(
      () => aliveItemsArray,
      items => TImList.new(items)
    )();

    const mutCache = THitStopsItem.createNullCache();
    for (const item of aliveItemsArray) {
      THitStopsItem.updateMutCache(item, mutCache);
    }

    return {
      aliveItems,
      cache: mutCache,
    };
  }

  static addHitStop<Def extends DataDefinition>(
    state: HitStopsState<Def>,
    item: HitStopItem<Def>
  ): HitStopsState<Def> {
    if (!THitStopsItem.isValid(item)) return state;

    return Im.update(state, 'aliveItems', list => TImList.push(list, item));
  }

  static getBodyTimeScale<Def extends DataDefinition>(
    state: HitStopsState<Def>,
    bodyId: AnyTypeBodyId<Def>
  ): TimeScale {
    const cache = state.cache;
    const bodyType = bodyId[0];
    const bodyIdKey = bodyId[1];
    const bodyKeyScale = cache.eachBodiesTimeScaleCache[bodyIdKey] ?? 1;
    const bodyTypeScale = cache.eachBodyTypesTimeScaleCache[bodyType] ?? 1;
    const allBodiesScale = cache.allBodiesTimeScaleCache;
    const worldTimeScale = cache.worldTimeScaleCache;
    // NOTE: It should be multiplied not Math.min?
    // return bodyKeyScale * bodyTypeScale * allBodiesScale * worldTimeScale;
    return Math.min(
      bodyKeyScale,
      bodyTypeScale,
      allBodiesScale,
      worldTimeScale
    );
  }

  static getWorldTimeScale<Def extends DataDefinition>(
    state: HitStopsState<Def>
  ): TimeScale {
    return state.cache.worldTimeScaleCache;
  }
}
