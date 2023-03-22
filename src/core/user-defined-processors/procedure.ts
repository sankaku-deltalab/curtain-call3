import {GameState} from '../state/game-states';
import {
  Body,
  BodyId,
  BodyType,
  DataDefinition,
} from '../setting/data-definition';
import {TBodiesState} from '../state/state-components/bodies-state';
import {TCollisionState} from '../state/state-components/collision-state';

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

export abstract class OverlapsReducerProcedure<
  Def extends DataDefinition,
  LeftBT extends BodyType<Def>,
  RightBT extends BodyType<Def>
> implements Procedure<Def>
{
  abstract readonly leftBodyType: LeftBT;
  abstract readonly rightBodyType: RightBT;

  abstract applyOverlaps(
    state: GameState<Def>,
    leftBodyId: BodyId<Def, LeftBT>,
    rightBodyId: BodyId<Def, RightBT>
  ): GameState<Def>;

  apply(state: GameState<Def>): GameState<Def> {
    const overlapPairs = TCollisionState.getOverlapsInType(
      state.collision,
      this.leftBodyType,
      this.rightBodyType
    );

    return overlapPairs.reduce(
      (state, [b1, b2]) => this.applyOverlaps(state, b1, b2),
      state
    );
  }
}
