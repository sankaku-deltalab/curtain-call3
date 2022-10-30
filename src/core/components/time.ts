import {Setting} from '../setting';

export type TimeInput<_Stg extends Setting> = {
  deltaMs: number;
};

export type TimeState<_Stg extends Setting> = {
  engineTimeMs: number;
  lastDeltaMs: number;
};

export class TimeTrait {
  static applyInput<Stg extends Setting>(
    state: TimeState<Stg>,
    input: TimeInput<Stg>
  ): TimeState<Stg> {
    return {
      engineTimeMs: state.engineTimeMs + input.deltaMs,
      lastDeltaMs: input.deltaMs,
    };
  }
}
