import {
  AnyTypeBody,
  AnyTypeBodyAttrs,
  Body,
  BodyId,
  BodyType,
  BodyAttrs,
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

  static getFirstBodyInType<
    Def extends DataDefinition,
    BT extends BodyType<Def>
  >(state: GameState<Def>, bodyType: BT): Result<Body<Def, BT>, string> {
    return TBodiesState.getFirstBodyInType(state.bodies, bodyType);
  }

  static getFirstBodyInTypeB<
    Def extends DataDefinition,
    BT extends BodyType<Def>
  >(state: GameState<Def>, bodyType: BT): Body<Def, BT> {
    return TBodiesState.getFirstBodyInTypeB(state.bodies, bodyType);
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
    bodyAttrs: BodyAttrs<Def, BT>
  ): {state: GameState<Def>; body: Body<Def, BT>} {
    const {state: newBodiesState, body} = TBodiesState.addBodyB(
      state.bodies,
      bodyAttrs
    );

    return {
      state: {...state, bodies: newBodiesState},
      body,
    };
  }

  static addBodiesB<Def extends DataDefinition>(
    state: GameState<Def>,
    bodiesWithoutId: AnyTypeBodyAttrs<Def>[]
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
