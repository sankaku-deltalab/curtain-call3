import {Overlaps} from './components/collision/collision';
import {AnyEvent} from './event';
import {GameState} from './game-state';
import {Representation, Setting} from './setting';

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

  static getRepresentation<Stg extends Setting>(
    state: GameState<Stg>,
    args: {instances: {director: DirectorBehavior<Stg>}}
  ): Representation<Stg> {
    return args.instances.director.represent(state);
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

  generateEvents(
    st: GameState<Stg>,
    other: {
      overlaps: Overlaps;
    }
  ): AnyEvent<Stg>[];

  represent(state: GameState<Stg>): Representation<Stg>;
}
