import {
  EventPayload,
  EventTypes,
  LevelState,
  NotificationPayload,
  NotificationTypes,
  Setting,
} from './setting';
import {Im} from './utils/util';

export type SceneState<Stg extends Setting> = {
  level: LevelState<Stg>;
  events: AnyEvent<Stg>[];
  notifications: AnyNotification<Stg>[];
};

export type Event<Stg extends Setting, Type extends EventTypes<Stg>> = {
  type: Type;
  payload: EventPayload<Stg, Type>;
};

export type AnyEvent<Stg extends Setting> = Event<Stg, EventTypes<Stg>>;

export type Notification<
  Stg extends Setting,
  Type extends NotificationTypes<Stg>
> = {type: Type; payload: NotificationPayload<Stg, Type>};

export type AnyNotification<Stg extends Setting> = Notification<
  Stg,
  NotificationTypes<Stg>
>;

export class SceneTrait {
  static initialState<Stg extends Setting>(args: {
    initialLevel: LevelState<Stg>;
  }): SceneState<Stg> {
    return {
      level: args.initialLevel,
      events: [],
      notifications: [],
    };
  }

  static mergeEvents<Stg extends Setting>(
    st: SceneState<Stg>,
    events: AnyEvent<Stg>[]
  ): SceneState<Stg> {
    return Im.replace(st, 'events', oldEv => [...oldEv, ...events]);
  }

  static mergeNotifications<Stg extends Setting>(
    st: SceneState<Stg>,
    notifications: AnyNotification<Stg>[]
  ): SceneState<Stg> {
    return Im.replace(st, 'notifications', n => [...n, ...notifications]);
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
  ): {state: SceneState<Stg>; events: AnyEvent<Stg>[]} {
    const ev = state.events;
    const st = Im.replace(state, 'events', () => []);
    return {state: st, events: ev};
  }

  static consumeAllNotifications<Stg extends Setting>(
    state: SceneState<Stg>
  ): {state: SceneState<Stg>; notifications: AnyNotification<Stg>[]} {
    const notifications = state.notifications;
    const st = Im.replace(state, 'notifications', () => []);
    return {state: st, notifications};
  }
}
