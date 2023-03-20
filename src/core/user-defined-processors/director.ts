import {DataDefinition} from '../setting/data-definition';
import {GameState} from '../state/game-states';

export class DirectorTrait {}

export interface Director<Def extends DataDefinition> {
  applyInput(state: GameState<Def>): GameState<Def>;
  update(state: GameState<Def>): GameState<Def>;
  getTimeScales(state: GameState<Def>): TimeScaling<Def>;
}

export type TimeScaling<_Def extends DataDefinition> = {base: number};
