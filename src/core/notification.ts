import {NotificationPayload, NotificationTypes, Setting} from './setting';
import {Im} from '../utils/immutable-manipulation';

export type NotificationState<Stg extends Setting> = {
  notifications: AnyNotification<Stg>[];
};

export type Notification<
  Stg extends Setting,
  Type extends NotificationTypes<Stg>
> = Readonly<{type: Type; payload: NotificationPayload<Stg, Type>}>;

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
    noSt: NotificationState<Stg>,
    notifications: AnyNotification<Stg>[]
  ): NotificationState<Stg> {
    return Im.update(noSt, 'notifications', n => [...n, ...notifications]);
  }

  static consumeAllNotifications<Stg extends Setting>(
    noSt: NotificationState<Stg>
  ): {noSt: NotificationState<Stg>; notifications: AnyNotification<Stg>[]} {
    const notifications = noSt.notifications;
    const st = Im.update(noSt, 'notifications', () => []);
    return {noSt: st, notifications};
  }
}
