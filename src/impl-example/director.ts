import {AnyTypeNotification} from '../core/setting';
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

  generateNotification(_state: GameState<Def>): AnyTypeNotification<Def>[] {
    return [];
  }
}
