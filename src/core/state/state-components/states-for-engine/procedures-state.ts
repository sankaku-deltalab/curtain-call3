import {DataDefinition} from '../../../setting/data-definition';
import {Procedure} from '../../../user-defined-processors/procedure';
import {GameState} from '../../game-states';

export type ProceduresState<Def extends DataDefinition> = {
  earlyProcedure: Procedure<Def>[];
  laterProcedure: Procedure<Def>[];
};

export class TProceduresState {
  static new<Def extends DataDefinition>(
    procedures: ProceduresState<Def>
  ): ProceduresState<Def> {
    return procedures;
  }

  static updateGameStateByEarlyProcedures<Def extends DataDefinition>(
    {earlyProcedure}: ProceduresState<Def>,
    state: GameState<Def>
  ): GameState<Def> {
    return earlyProcedure.reduce((state, p) => p.apply(state), state);
  }

  static updateGameStateByLaterProcedures<Def extends DataDefinition>(
    {laterProcedure}: ProceduresState<Def>,
    state: GameState<Def>
  ): GameState<Def> {
    return laterProcedure.reduce((state, p) => p.apply(state), state);
  }
}
