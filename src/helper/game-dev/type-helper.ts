import {
  BodyBase,
  DataDefinition,
  DataSourceItemBase,
  DynamicSourceItemBase,
  DynamicSourcePropsBase,
  LevelBase,
  NotificationPayloadBase,
} from '../../core/setting';

export type BodyBaseAttrs<
  Type extends string,
  Body extends BodyBase<Type>
> = Omit<Body, 'id'>;

export type DefineLevel<T extends LevelBase> = T;
export type DefineBody<
  BodyType extends string,
  T extends BodyBase<BodyType>
> = T;
export type DefineDataSourceItem<T extends DataSourceItemBase> = T;
export type DefineDynamicSourceProps<T extends DynamicSourcePropsBase> = T;
export type DefineDynamicSourceItem<T extends DynamicSourceItemBase> = T;
export type DefineNotificationPayload<T extends NotificationPayloadBase> = T;
export type DefineDataDefinition<T extends DataDefinition> = T;
