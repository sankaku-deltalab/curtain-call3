import {Setting} from '../setting';

export type TimeInput<_Stg extends Setting> = Readonly<{
  deltaMs: number;
}>;

export type TimeState<_Stg extends Setting> = Readonly<{
  engineTimeMs: number;
  lastEngineDeltaMs: number;
  gameTimeMs: number;
  lastBaseTimeScale: number;
  lastDeltaMs: number;
}>;

export class TimeTrait {
  static initialState<Stg extends Setting>(): TimeState<Stg> {
    return {
      engineTimeMs: 0,
      lastEngineDeltaMs: 0,
      gameTimeMs: 0,
      lastBaseTimeScale: 1,
      lastDeltaMs: 0,
    };
  }

  static applyInput<Stg extends Setting>(
    state: TimeState<Stg>,
    args: {input: TimeInput<Stg>; baseTimeScale: number}
  ): TimeState<Stg> {
    const {input, baseTimeScale} = args;
    const gameDelta = input.deltaMs * baseTimeScale;
    return {
      engineTimeMs: state.engineTimeMs + input.deltaMs,
      lastEngineDeltaMs: input.deltaMs,
      gameTimeMs: state.gameTimeMs + gameDelta,
      lastBaseTimeScale: baseTimeScale,
      lastDeltaMs: gameDelta,
    };
  }

  static lastDeltaMs<Stg extends Setting>(state: TimeState<Stg>): number {
    return state.lastDeltaMs;
  }
}
