export type DataDefinition = {
  level: LevelBase;
  bodies: {[Type in string]: BodyBase<Type>};
  dataSources: Record<string, DataSourceItemBase>;
  dynamicSources: Record<
    string,
    {props: DynamicSourcePropsBase; item: DynamicSourceItemBase}
  >;
  notifications: Record<string, NotificationBase>;
};

// Level
export type LevelBase = {};
export type Level<Def extends DataDefinition> = Def['level'];

// Body
export type BodyBase<Type extends string> = {
  id: [Type, string];
  bodyType: Type;
};
export type BodyType<Def extends DataDefinition> = keyof Def['bodies'] & string;
export type Body<
  Def extends DataDefinition,
  BT extends BodyType<Def>
> = Def['bodies'][BT];
export type BodyWithoutId<
  Def extends DataDefinition,
  BT extends BodyType<Def>
> = Omit<Body<Def, BT>, 'id'>;
export type BodyId<Def extends DataDefinition, BT extends BodyType<Def>> = [
  BT,
  string
];
export type AnyTypeBody<Def extends DataDefinition> = Body<Def, BodyType<Def>>;
export type AnyTypeBodyId<Def extends DataDefinition> = BodyId<
  Def,
  BodyType<Def>
>;
export type AnyTypeBodyWithoutId<Def extends DataDefinition> = BodyWithoutId<
  Def,
  BodyType<Def>
>;

// DataSource
export type DataSourceItemBase = {id: string};
export type DataSourceType<Def extends DataDefinition> =
  keyof Def['dataSources'] & string;
export type DataSourceItem<
  Def extends DataDefinition,
  Type extends DataSourceType<Def>
> = Def['dataSources'][Type];
export type DataSourceId<
  Def extends DataDefinition,
  Type extends DataSourceType<Def>
> = DataSourceItem<Def, Type>['id'];

// DynamicSource
export type DynamicSourcePropsBase = {};
export type DynamicSourceItemBase = {id: string};
export type DynamicSourceType<Def extends DataDefinition> =
  keyof Def['dynamicSources'] & string;
export type DynamicSourceItem<
  Def extends DataDefinition,
  Type extends DynamicSourceType<Def>
> = Def['dynamicSources'][Type]['item'];
export type DynamicSourceId<
  Def extends DataDefinition,
  Type extends DynamicSourceType<Def>
> = DynamicSourceItem<Def, Type>['id'];
export type DynamicSourceProps<
  Def extends DataDefinition,
  Type extends DynamicSourceType<Def>
> = Def['dynamicSources'][Type]['props'];

// Notification
export type NotificationBase = {};
export type NotificationType<Def extends DataDefinition> =
  keyof Def['notifications'] & string;
export type Notification<
  Def extends DataDefinition,
  Type extends NotificationType<Def>
> = {type: Type; payload: Def['notifications'][Type]};
export type AnyTypeNotification<Def extends DataDefinition> = Notification<
  Def,
  NotificationType<Def>
>;

// functions
export const serializeBodyId = <Def extends DataDefinition>(
  bodyId: AnyTypeBodyId<Def>
): string => {
  return JSON.stringify(bodyId);
};
