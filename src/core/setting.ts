type Rec = Record<string, unknown>;

export type Setting = {
  level: Rec;
  bodies: Record<string, Rec>;
  minds: Record<string, Rec>;
  cues: Record<string, Rec>;
  representation: Rec;
  notifications: Record<string, Rec>;
};

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

export const bodyTypes = <Stg extends Setting>(
  setting: Stg
): BodyTypes<Stg> => {
  return Object.keys(setting.bodies) as unknown as BodyTypes<Stg>;
};
