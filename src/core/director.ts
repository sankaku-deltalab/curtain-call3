import {AnyCue, CuePriority} from './components/cue';
import {GameState} from './game-state';
import {Setting} from './setting';

export class DirectorTrait {
  static extractDirectorGameState<Stg extends Setting>(
    state: GameState<Stg>
  ): GameState<Stg> {
    return state;
  }

  static mergeDirectorGameState<Stg extends Setting>(
    state: GameState<Stg>,
    _state: GameState<Stg>
  ): GameState<Stg> {
    return state;
  }
}

export interface DirectorBehavior<Stg extends Setting> {
  // apply_input(
  //   state: DirectorGameState<Stg>,
  //   args: {
  //     input: Input<Stg>;
  //   }
  // ): DirectorGameState<Stg>;

  update(state: GameState<Stg>): GameState<Stg>;

  generateCuesAtUpdate(state: GameState<Stg>): AnyCue<Stg>[];

  getCuePriority(): CuePriority<Stg>;

  getTimeScales(state: GameState<Stg>): TimeScaling<Stg>;
}

export type TimeScaling<_Stg extends Setting> = {base: number};
