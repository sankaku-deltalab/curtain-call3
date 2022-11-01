import {EventPayload, EventTypes, LevelState, Setting} from './setting';
import {Mut} from './util';

export type SceneState<Stg extends Setting> = {
  level: LevelState<Stg>;
  events: AnyEvent<Stg>[];
};

export type Event<Stg extends Setting, Type extends EventTypes<Stg>> = {
  type: Type;
  payload: EventPayload<Stg, Type>;
};

export type AnyEvent<Stg extends Setting> = Event<Stg, EventTypes<Stg>>;

export class SceneTrait {
  static initialState<Stg extends Setting>(args: {
    initialLevel: LevelState<Stg>;
  }): SceneState<Stg> {
    return {
      level: args.initialLevel,
      events: [],
    };
  }

  static mergeEvents<Stg extends Setting>(
    st: SceneState<Stg>,
    events: AnyEvent<Stg>[]
  ): SceneState<Stg> {
    return Mut.replace(st, 'events', oldEv => [...oldEv, ...events]);
  }

  static event<Stg extends Setting, Type extends EventTypes<Stg>>(
    type: Type,
    payload: EventPayload<Stg, Type>
  ): Event<Stg, Type> {
    return {
      type,
      payload,
    };
  }

  static consumeAllEvents<Stg extends Setting>(
    state: SceneState<Stg>
  ): [SceneState<Stg>, AnyEvent<Stg>[]] {
    const ev = state.events;
    const st = Mut.replace(state, 'events', () => []);
    return [st, ev];
  }
}
