import {Setting} from '../setting';

export type TimeInput<_Stg extends Setting> = Readonly<{
  deltaMs: number;
}>;

export type TimeState<_Stg extends Setting> = Readonly<{
  engineTimeMs: number;
  lastDeltaMs: number;
}>;

export class TimeTrait {
  static initialState<Stg extends Setting>(): TimeState<Stg> {
    return {
      engineTimeMs: 0,
      lastDeltaMs: 0,
    };
  }

  static applyInput<Stg extends Setting>(
    state: TimeState<Stg>,
    input: TimeInput<Stg>
  ): TimeState<Stg> {
    return {
      engineTimeMs: state.engineTimeMs + input.deltaMs,
      lastDeltaMs: input.deltaMs,
    };
  }

  static lastDeltaMs<Stg extends Setting>(state: TimeState<Stg>): number {
    return state.lastDeltaMs;
  }
}
