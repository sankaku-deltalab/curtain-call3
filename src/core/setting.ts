type Rec = Record<string, unknown>;

export type Setting = {
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

export type Event<Stg extends Setting, Type extends EventTypes<Stg>> = {
  type: Type;
  payload: EventPayload<Stg, Type>;
};

export type AnyEvent<Stg extends Setting> = Event<Stg, EventTypes<Stg>>;

export const bodyTypes = <Stg extends Setting>(
  setting: Stg
): BodyTypes<Stg> => {
  return Object.keys(setting.bodies) as unknown as BodyTypes<Stg>;
};

export const createEvent = <Stg extends Setting, Type extends EventTypes<Stg>>(
  type: Type,
  payload: EventPayload<Stg, Type>
): Event<Stg, Type> => {
  return {
    type,
    payload,
  };
};
