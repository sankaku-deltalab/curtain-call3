import {GameState} from './game-state';
import {EventPayload, EventTypes, Setting} from './setting';
import {Im} from './utils/util';

export type EventState<Stg extends Setting> = {
  events: AnyEvent<Stg>[];
};

export type Event<Stg extends Setting, Type extends EventTypes<Stg>> = {
  type: Type;
  payload: EventPayload<Stg, Type>;
};

export type AnyEvent<Stg extends Setting> = Event<Stg, EventTypes<Stg>>;

export class EventTrait {
  static initialState<Stg extends Setting>(): EventState<Stg> {
    return {
      events: [],
    };
  }

  static mergeEvents<Stg extends Setting>(
    st: EventState<Stg>,
    events: AnyEvent<Stg>[]
  ): EventState<Stg> {
    return Im.replace(st, 'events', oldEv => [...oldEv, ...events]);
  }

  static createEvent<Stg extends Setting, Type extends EventTypes<Stg>>(
    type: Type,
    payload: EventPayload<Stg, Type>
  ): Event<Stg, Type> {
    return {
      type,
      payload,
    };
  }

  static popEvent<Stg extends Setting>(
    state: EventState<Stg>
  ): {state: EventState<Stg>; event?: AnyEvent<Stg>} {
    const evClone = state.events;
    const event = evClone.pop();
    const st = Im.replace(state, 'events', () => evClone);
    return {
      state: st,
      event,
    };
  }
}

export interface EventApplier<
  Stg extends Setting,
  Type extends EventTypes<Stg>
> {
  applyEvent(
    state: GameState<Stg>,
    payload: EventPayload<Stg, Type>
  ): GameState<Stg>;
}
