import {GameState} from '../state/game-states';
import {Body, BodyType, DataDefinition} from '../setting/data-definition';
import {TBodiesState} from '../state/state-components/bodies-state';

export interface Procedure<Def extends DataDefinition> {
  apply(state: GameState<Def>): GameState<Def>;
}

export abstract class BodiesReducerProcedure<
  Def extends DataDefinition,
  BT extends BodyType<Def>
> implements Procedure<Def>
{
  abstract readonly type: BT;
  abstract filterBody(body: Body<Def, BT>, state: GameState<Def>): boolean;
  abstract applyBody(
    state: GameState<Def>,
    body: Body<Def, BT>
  ): GameState<Def>;

  apply(state: GameState<Def>): GameState<Def> {
    let bodies = TBodiesState.getBodiesInType(state.bodies, this.type);
    bodies = bodies.filter(b => this.filterBody(b, state));
    return bodies.reduce((state, b) => this.applyBody(state, b), state);
  }
}
