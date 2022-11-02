import {Overlaps} from './components/collision';
import {GameState} from './game-state';
import {Setting} from './setting';

export type DirectorGameState<Stg extends Setting> = GameState<Stg>;

export class DirectorTrait {
  static extractDirectorGameState<Stg extends Setting>(
    state: GameState<Stg>
  ): DirectorGameState<Stg> {
    return state;
  }

  static mergeDirectorGameState<Stg extends Setting>(
    st: DirectorGameState<Stg>,
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
    st: DirectorGameState<Stg>,
    other: {
      overlaps: Overlaps;
    }
  ): DirectorGameState<Stg>;
}
