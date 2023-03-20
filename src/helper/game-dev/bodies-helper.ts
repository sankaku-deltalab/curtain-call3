import {
  AnyTypeBody,
  AnyTypeBodyWithoutId,
  Body,
  BodyId,
  BodyType,
  BodyWithoutId,
  DataDefinition,
} from '../../core/setting/data-definition';
import {GameState} from '../../core/state/game-states';
import {TBodiesState} from '../../core/state/state-components/bodies-state';
import {Result} from '../../utils';

export class BodiesHelper {
  static bodyId<Def extends DataDefinition, BT extends BodyType<Def>>(
    bodyType: BT,
    uniqueKey: string
  ): BodyId<Def, BT> {
    return TBodiesState.bodyId(bodyType, uniqueKey);
  }

  static bodyIsInType<Def extends DataDefinition, BT extends BodyType<Def>>(
    body: AnyTypeBody<Def>,
    bodyType: BT
  ): body is Body<Def, BT> {
    return TBodiesState.bodyIsInType(body, bodyType);
  }

  static getBodiesInType<Def extends DataDefinition, BT extends BodyType<Def>>(
    state: GameState<Def>,
    bodyType: BT
  ): Body<Def, BT>[] {
    return TBodiesState.getBodiesInType(state.bodies, bodyType);
  }

  static getAllBodies<Def extends DataDefinition>(
    state: GameState<Def>
  ): AnyTypeBody<Def>[] {
    return TBodiesState.getAllBodies(state.bodies);
  }

  static fetchBody<Def extends DataDefinition, BT extends BodyType<Def>>(
    state: GameState<Def>,
    bodyId: BodyId<Def, BT>
  ): Result<Body<Def, BT>> {
    return TBodiesState.fetch(state.bodies, bodyId);
  }

  static fetchBodyB<Def extends DataDefinition, BT extends BodyType<Def>>(
    state: GameState<Def>,
    bodyId: BodyId<Def, BT>
  ): Body<Def, BT> {
    const maybeBody = TBodiesState.fetch(state.bodies, bodyId);
    if (maybeBody.err)
      throw new Error(`body ${JSON.stringify(bodyId)} is not in state`);
    return maybeBody.val;
  }

  static addBodyB<Def extends DataDefinition, BT extends BodyType<Def>>(
    state: GameState<Def>,
    bodyWithoutId: BodyWithoutId<Def, BT>
  ): {state: GameState<Def>; body: Body<Def, BT>} {
    const {state: newBodiesState, body} = TBodiesState.addBodyB(
      state.bodies,
      bodyWithoutId
    );

    return {
      state: {...state, bodies: newBodiesState},
      body,
    };
  }

  static addBodiesB<Def extends DataDefinition>(
    state: GameState<Def>,
    bodiesWithoutId: AnyTypeBodyWithoutId<Def>[]
  ): {state: GameState<Def>; bodies: AnyTypeBody<Def>[]} {
    const {state: newBodiesState, bodies} = TBodiesState.addBodiesB(
      state.bodies,
      bodiesWithoutId
    );

    return {
      state: {...state, bodies: newBodiesState},
      bodies,
    };
  }
}
