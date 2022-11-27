import {NotificationPayload, NotificationTypes, Setting} from './setting';
import {Im} from '../utils/immutable-manipulation';

export type NotificationState<Stg extends Setting> = {
  notifications: AnyNotification<Stg>[];
};

export type Notification<
  Stg extends Setting,
  Type extends NotificationTypes<Stg>
> = {type: Type; payload: NotificationPayload<Stg, Type>};

export type AnyNotification<Stg extends Setting> = Notification<
  Stg,
  NotificationTypes<Stg>
>;

export class NotificationTrait {
  static initialState<Stg extends Setting>(): NotificationState<Stg> {
    return {
      notifications: [],
    };
  }

  static mergeNotifications<Stg extends Setting>(
    st: NotificationState<Stg>,
    notifications: AnyNotification<Stg>[]
  ): NotificationState<Stg> {
    return Im.replace(st, 'notifications', n => [...n, ...notifications]);
  }

  static consumeAllNotifications<Stg extends Setting>(
    state: NotificationState<Stg>
  ): {state: NotificationState<Stg>; notifications: AnyNotification<Stg>[]} {
    const notifications = state.notifications;
    const st = Im.replace(state, 'notifications', () => []);
    return {state: st, notifications};
  }
}
