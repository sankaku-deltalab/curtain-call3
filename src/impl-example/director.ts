import {Representation} from '../core/setting';
import {GameState} from '../core/state';
import {Director, TimeScaling} from '../core/user-defined-processors';
import {ExampleDataDefinition} from './def';

type Def = ExampleDataDefinition;

export class ExampleDirector implements Director<Def> {
  applyInput(state: GameState<Def>): GameState<Def> {
    return state;
  }

  update(state: GameState<Def>): GameState<Def> {
    return state;
  }

  getTimeScales(_state: GameState<Def>): TimeScaling<Def> {
    return {base: 1};
  }

  represent(_state: GameState<Def>): Representation<Def> {
    return {
      status: {type: 'playing'},
    };
  }
}
