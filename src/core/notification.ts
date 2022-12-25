import {NotificationPayload, NotificationTypes, Setting} from './setting';
import {Im} from '../utils/immutable-manipulation';
import {ImList, ImListTrait} from 'src/utils/im-list';

export type NotificationState<Stg extends Setting> = {
  notifications: ImList<AnyNotification<Stg>>;
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
      notifications: ImListTrait.new(),
    };
  }

  static mergeNotifications<Stg extends Setting>(
    noSt: NotificationState<Stg>,
    notifications: ImList<AnyNotification<Stg>>
  ): NotificationState<Stg> {
    return Im.update(noSt, 'notifications', n =>
      ImListTrait.concat(notifications, n)
    );
  }

  static consumeAllNotifications<Stg extends Setting>(
    noSt: NotificationState<Stg>
  ): {noSt: NotificationState<Stg>; notifications: AnyNotification<Stg>[]} {
    const notifications = ImListTrait.toArray(noSt.notifications);
    const st = Im.update(noSt, 'notifications', () => ImListTrait.new());
    return {noSt: st, notifications};
  }
}
