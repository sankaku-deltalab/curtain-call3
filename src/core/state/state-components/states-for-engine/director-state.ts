import {DataDefinition} from '../../../setting/data-definition';
import {Director} from '../../../user-defined-processors/director';
import {GameState} from '../../game-states';

export type DirectorState<Def extends DataDefinition> = {
  director: Director<Def>;
};

export class TDirectorState {
  static new<Def extends DataDefinition>(
    director: Director<Def>
  ): DirectorState<Def> {
    return {director};
  }

  static updateGameState<Def extends DataDefinition>(
    {director}: DirectorState<Def>,
    state: GameState<Def>
  ): GameState<Def> {
    return director.update(state);
  }
}
