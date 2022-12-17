import {CuePayload, CueTypes, Setting} from '../setting';
import {Im} from '../../utils/immutable-manipulation';

export type EventState<Stg extends Setting> = Readonly<{
  events?: OrganizedEvents<Stg>;
}>;

export type Event<Stg extends Setting, Type extends CueTypes<Stg>> = Readonly<{
  type: Type;
  payload: CuePayload<Stg, Type>;
}>;

export type AnyEvent<Stg extends Setting> = Event<Stg, CueTypes<Stg>>;

type OrganizedEvents<Stg extends Setting> = Readonly<{
  [EvType in CueTypes<Stg>]: Event<Stg, EvType>[];
}>;

export type EventPriority<Stg extends Setting> = {
  earlier: CueTypes<Stg>[];
  later: CueTypes<Stg>[];
};

export class EventTrait {
  static initialState<Stg extends Setting>(): EventState<Stg> {
    return {
      events: undefined,
    };
  }

  static mergeEvents<Stg extends Setting>(
    st: EventState<Stg>,
    events: AnyEvent<Stg>[]
  ): EventState<Stg> {
    if (events.length === 0) return st;

    const types1: CueTypes<Stg>[] = st.events ? Object.keys(st.events) : [];
    const types2: CueTypes<Stg>[] = events.map(e => e.type);
    const types: CueTypes<Stg>[] = [...new Set([...types1, ...types2])];

    const newEv = Im.pipe(
      () => events,
      ev => EventTrait.organizeEvents(ev, types)
    )();
    return Im.replace(st, 'events', oldEv => {
      if (oldEv === undefined) return newEv;
      return EventTrait.mergeOrganizedEvents(oldEv, newEv, types);
    });
  }

  static createEvent<Stg extends Setting, Type extends CueTypes<Stg>>(
    type: Type,
    payload: CuePayload<Stg, Type>
  ): Event<Stg, Type> {
    return {
      type,
      payload,
    };
  }

  static popEvent<Stg extends Setting>(
    state: EventState<Stg>,
    args: {priority: EventPriority<Stg>}
  ): {state: EventState<Stg>; event?: AnyEvent<Stg>} {
    if (state.events === undefined) return {state};

    const eventTypesInPriorityOrder = this.sortEventTypesByPriority(
      Object.keys(state.events),
      args
    );
    for (const evType of eventTypesInPriorityOrder) {
      const events = state.events[evType];

      if (events === undefined) continue;
      if (events.length === 0) continue;

      const event = events[events.length - 1];
      const st = Im.replace(state, 'events', eventsObj => {
        if (eventsObj === undefined) throw new Error('code bug');
        return Im.replace(eventsObj, evType, eventsArray => {
          const evArrayClone = [...eventsArray];
          evArrayClone.pop();
          return evArrayClone;
        });
      });
      return {
        state: st,
        event,
      };
    }

    return {state};
  }

  static sortEventTypesByPriority<Stg extends Setting>(
    types: CueTypes<Stg>[],
    args: {priority: EventPriority<Stg>}
  ): CueTypes<Stg>[] {
    const availableTypes = new Set(types);
    const notDontcareTypes = new Set([
      ...args.priority.earlier,
      ...args.priority.later,
    ]);
    const earlys = args.priority.earlier.filter(evType =>
      availableTypes.has(evType)
    );
    const laters = args.priority.later.filter(evType =>
      availableTypes.has(evType)
    );
    const dontcares = types
      .sort((a, b) => a.localeCompare(b))
      .filter(evType => !notDontcareTypes.has(evType));
    return [...earlys, ...dontcares, ...laters];
  }

  private static organizeEvents<Stg extends Setting>(
    events: AnyEvent<Stg>[],
    types: CueTypes<Stg>[]
  ): OrganizedEvents<Stg> {
    const mutEvents: OrganizedEvents<Stg> = Im.pipe(
      () => types,
      types => types.map<[CueTypes<Stg>, []]>(t => [t, []]),
      ev => Object.fromEntries<[]>(ev) as unknown as OrganizedEvents<Stg>
    )();

    for (const ev of events) {
      mutEvents[ev.type].push(ev);
    }
    return mutEvents;
  }

  private static mergeOrganizedEvents<Stg extends Setting>(
    original: OrganizedEvents<Stg>,
    other: OrganizedEvents<Stg>,
    types: CueTypes<Stg>[]
  ): OrganizedEvents<Stg> {
    return Im.pipe(
      () => types,
      types =>
        types.map<[CueTypes<Stg>, AnyEvent<Stg>[]]>(t => [
          t,
          [...(original[t] ?? []), ...(other[t] ?? [])],
        ]),
      ev => Object.fromEntries(ev) as OrganizedEvents<Stg>
    )();
  }
}
