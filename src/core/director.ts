import {Overlaps} from './components/collision/collision';
import {AnyCue, CuePriority} from './components/event';
import {GameState} from './game-state';
import {Setting} from './setting';

export class DirectorTrait {
  static extractDirectorGameState<Stg extends Setting>(
    state: GameState<Stg>
  ): GameState<Stg> {
    return state;
  }

  static mergeDirectorGameState<Stg extends Setting>(
    st: GameState<Stg>,
    _state: GameState<Stg>
  ): GameState<Stg> {
    return st;
  }
}

export interface DirectorBehavior<Stg extends Setting> {
  // apply_input(
  //   st: DirectorGameState<Stg>,
  //   args: {
  //     input: Input<Stg>;
  //   }
  // ): DirectorGameState<Stg>;

  update(
    st: GameState<Stg>,
    other: {
      overlaps: Overlaps;
    }
  ): GameState<Stg>;

  generateEventsAtUpdate(
    st: GameState<Stg>,
    other: {
      overlaps: Overlaps;
    }
  ): AnyCue<Stg>[];

  getEventPriority(): CuePriority<Stg>;

  getTimeScales(state: GameState<Stg>): TimeScaling<Stg>;
}

export type TimeScaling<_Stg extends Setting> = {base: number};
