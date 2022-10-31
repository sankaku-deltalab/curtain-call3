type Rec = Record<string, unknown>;

export type Setting = {
  level: Rec;
  bodies: Record<string, Rec>;
  minds: Record<string, Rec>;
  events: Record<string, Rec>;
};

export type BodyTypes<Stg extends Setting> = keyof Stg['bodies'] & string;
export type MindTypes<Stg extends Setting> = keyof Stg['minds'] & string;
export type EventTypes<Stg extends Setting> = keyof Stg['events'] & string;

export type EventPayload<
  Stg extends Setting,
  Type extends EventTypes<Stg>
> = Setting['events'][Type];

export type LevelState<Stg extends Setting> = Stg['level'];

export const bodyTypes = <Stg extends Setting>(
  setting: Stg
): BodyTypes<Stg> => {
  return Object.keys(setting.bodies) as unknown as BodyTypes<Stg>;
};
