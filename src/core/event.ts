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
}
