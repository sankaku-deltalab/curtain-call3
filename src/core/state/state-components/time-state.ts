import {DataDefinition} from '../../setting/data-definition';

export type TimeInput<_Def extends DataDefinition> = Readonly<{
  engineDeltaMs: number;
  baseTimeScale: number;
}>;

export type TimeState<_Def extends DataDefinition> = Readonly<{
  // Engine time (~= Real world time)
  engineTimeMs: number;
  lastEngineDeltaMs: number;
  // Game Time
  gameTimeMs: number;
  lastDeltaMs: number;
  // Time scaling
  lastBaseTimeScale: number;
}>;

export class TTimeState {
  static new<Def extends DataDefinition>(): TimeState<Def> {
    return {
      engineTimeMs: 0,
      lastEngineDeltaMs: 0,
      gameTimeMs: 0,
      lastBaseTimeScale: 1,
      lastDeltaMs: 0,
    };
  }

  static update<Def extends DataDefinition>(
    time: TimeState<Def>,
    input: TimeInput<Def>
  ): TimeState<Def> {
    const gameDelta = input.engineDeltaMs * input.baseTimeScale;
    return {
      engineTimeMs: time.engineTimeMs + input.engineDeltaMs,
      lastEngineDeltaMs: input.engineDeltaMs,
      gameTimeMs: time.gameTimeMs + gameDelta,
      lastBaseTimeScale: input.baseTimeScale,
      lastDeltaMs: gameDelta,
    };
  }

  static getLastDeltaMs<Def extends DataDefinition>(
    time: TimeState<Def>
  ): number {
    return time.lastDeltaMs;
  }
}
