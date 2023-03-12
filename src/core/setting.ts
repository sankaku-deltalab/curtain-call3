type Rec = Record<string, unknown>;

export type Setting = {
  level: Rec;
  dataSources: Record<string, {key: string; value: unknown}>;
  dynamicSources: Record<string, {key: string; props: unknown; value: unknown}>;
  bodies: Record<string, Rec>;
  minds: Record<string, {state: Rec; props: Rec}>;
  cues: Record<string, Rec>;
  notifications: Record<string, Rec>;
};

export type DataSourceTypes<Stg extends Setting> = keyof Stg['dataSources'] &
  string;
export type DataSourceKey<
  Stg extends Setting,
  Type extends DataSourceTypes<Stg>
> = Stg['dataSources'][Type]['key'];
export type DataSourceValue<
  Stg extends Setting,
  Type extends DataSourceTypes<Stg>
> = Stg['dataSources'][Type]['value'];

export type DynamicSourceTypes<Stg extends Setting> =
  keyof Stg['dynamicSources'] & string;
export type DynamicSourceKey<
  Stg extends Setting,
  Type extends DynamicSourceTypes<Stg>
> = Stg['dynamicSources'][Type]['key'];
export type DynamicSourceProps<
  Stg extends Setting,
  Type extends DynamicSourceTypes<Stg>
> = Stg['dynamicSources'][Type]['props'];
export type DynamicSourceValue<
  Stg extends Setting,
  Type extends DynamicSourceTypes<Stg>
> = Stg['dynamicSources'][Type]['value'];

export type BodyTypes<Stg extends Setting> = keyof Stg['bodies'] & string;
export type MindTypes<Stg extends Setting> = keyof Stg['minds'] & string;
export type CueTypes<Stg extends Setting> = keyof Stg['cues'] & string;
export type NotificationTypes<Stg extends Setting> =
  keyof Stg['notifications'] & string;

export type CuePayload<
  Stg extends Setting,
  Type extends CueTypes<Stg>
> = Stg['cues'][Type];

export type NotificationPayload<
  Stg extends Setting,
  Type extends NotificationTypes<Stg>
> = Stg['notifications'][Type];

export type LevelState<Stg extends Setting> = Stg['level'];

export type BodyStateRaw<
  Stg extends Setting,
  BT extends BodyTypes<Stg>
> = Stg['bodies'][BT];

export type AnyBodyStateRaw<Stg extends Setting> = BodyStateRaw<
  Stg,
  BodyTypes<Stg>
>;

export type MindStateRaw<
  Stg extends Setting,
  MT extends MindTypes<Stg>
> = Stg['minds'][MT]['state'];

export type AnyMindStateRaw<Stg extends Setting> = MindStateRaw<
  Stg,
  MindTypes<Stg>
>;

export type MindProps<
  Stg extends Setting,
  MT extends MindTypes<Stg>
> = Stg['minds'][MT]['props'];

export type AnyMindProps<Stg extends Setting> = MindProps<Stg, MindTypes<Stg>>;

export const bodyTypes = <Stg extends Setting>(
  setting: Stg
): BodyTypes<Stg> => {
  return Object.keys(setting.bodies) as unknown as BodyTypes<Stg>;
};
