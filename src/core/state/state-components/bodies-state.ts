import {ImMap, TImMap, Result, Res, Enum} from '../../../utils';
import {
  AnyTypeBody,
  AnyTypeBodyAttrs,
  Body,
  BodyId,
  BodyType,
  BodyAttrs,
  DataDefinition,
} from '../../setting/data-definition';

export type BodiesState<Def extends DataDefinition> = {
  bodyIdCount: number;
  bodyMaps: {[BT in BodyType<Def>]?: ImMap<string, Body<Def, BT>>};
};

export class TBodiesState {
  static new<Def extends DataDefinition>(): BodiesState<Def> {
    return {bodyIdCount: 0, bodyMaps: {}};
  }

  static bodyId<Def extends DataDefinition, BT extends BodyType<Def>>(
    bodyType: BT,
    uniqueKey: string
  ): BodyId<Def, BT> {
    return [bodyType, uniqueKey];
  }

  static bodyIsInType<Def extends DataDefinition, BT extends BodyType<Def>>(
    body: AnyTypeBody<Def>,
    bodyType: BT
  ): body is Body<Def, BT> {
    return body.bodyType === bodyType;
  }

  static fetch<Def extends DataDefinition, BT extends BodyType<Def>>(
    bodies: BodiesState<Def>,
    [type, key]: BodyId<Def, BT>
  ): Result<Body<Def, BT>> {
    const bodyMap = this.fetchBodyMapOfType(bodies, type);
    return TImMap.fetch(bodyMap, key);
  }

  static addBodyFromAttrsB<
    Def extends DataDefinition,
    BT extends BodyType<Def>
  >(
    bodies: BodiesState<Def>,
    bodyAttrs: BodyAttrs<Def, BT>
  ): {state: BodiesState<Def>; body: Body<Def, BT>} {
    const bodyIdKey = 'body-' + bodies.bodyIdCount.toString();
    const bodyType = bodyAttrs.bodyType;
    const bodyId = [bodyType, bodyIdKey] as BodyId<Def, BT>;

    const body = {...bodyAttrs, id: bodyId} as unknown as Body<Def, BT>;
    const bodyMap = TImMap.put(
      this.fetchBodyMapOfType(bodies, bodyType),
      bodyIdKey,
      body
    );

    const bodiesMapRecord = {
      ...bodies.bodyMaps,
      [bodyType]: bodyMap,
    };

    return {
      state: {
        ...bodies,
        bodyMaps: bodiesMapRecord,
        bodyIdCount: bodies.bodyIdCount + 1,
      },
      body,
    };
  }

  static addBodiesFromAttrsB<Def extends DataDefinition>(
    state: BodiesState<Def>,
    bodyAttrsArray: AnyTypeBodyAttrs<Def>[]
  ): {state: BodiesState<Def>; bodies: AnyTypeBody<Def>[]} {
    const mutBodiesArray: AnyTypeBody<Def>[] = [];

    const newState = Enum.reduce(
      bodyAttrsArray,
      state,
      (attrs, bodies: BodiesState<Def>) => {
        const {state, body} = this.addBodyFromAttrsB(bodies, attrs);
        mutBodiesArray.push(body);
        return state;
      }
    );
    return {state: newState, bodies: mutBodiesArray};
  }

  static putBody<Def extends DataDefinition, BT extends BodyType<Def>>(
    bodies: BodiesState<Def>,
    body: Body<Def, BT>
  ): BodiesState<Def> {
    const bodyMap = TImMap.put(
      this.fetchBodyMapOfType(bodies, body.bodyType),
      body.id[1],
      body
    );

    const bodiesMapRecord = {
      ...bodies.bodyMaps,
      [body.bodyType]: bodyMap,
    };

    return {
      ...bodies,
      bodyMaps: bodiesMapRecord,
    };
  }

  static putBodies<Def extends DataDefinition, BT extends BodyType<Def>>(
    state: BodiesState<Def>,
    bodies: Body<Def, BT>[]
  ): BodiesState<Def> {
    return Enum.reduce(bodies, state, (b, state: BodiesState<Def>) => {
      return this.putBody(state, b);
    });
  }

  static getBodiesInType<Def extends DataDefinition, BT extends BodyType<Def>>(
    bodies: BodiesState<Def>,
    bodyType: BT
  ): Body<Def, BT>[] {
    const bodyMap = this.fetchBodyMapOfType(bodies, bodyType);
    return TImMap.values(bodyMap);
  }

  static getAllBodies<Def extends DataDefinition>(
    bodiesState: BodiesState<Def>
  ): AnyTypeBody<Def>[] {
    const availableBodyTypes: BodyType<Def>[] = Object.keys(
      bodiesState.bodyMaps
    );
    // NOTE: I avoid flat because it's too slow
    let mutBodies: AnyTypeBody<Def>[] = [];
    for (const t of availableBodyTypes) {
      const bodyMap = this.fetchBodyMapOfType(bodiesState, t);
      mutBodies = mutBodies.concat(TImMap.values(bodyMap));
    }
    return mutBodies;
  }

  static getFirstBodyInType<
    Def extends DataDefinition,
    BT extends BodyType<Def>
  >(bodies: BodiesState<Def>, bodyType: BT): Result<Body<Def, BT>, string> {
    const bodyMap = this.fetchBodyMapOfType(bodies, bodyType);
    const allBodies = TImMap.values(bodyMap);
    if (allBodies.length === 0)
      return Res.err(`body has type "${bodyType}" is not exist`);

    return Res.ok(allBodies[0]);
  }

  static getFirstBodyInTypeB<
    Def extends DataDefinition,
    BT extends BodyType<Def>
  >(bodies: BodiesState<Def>, bodyType: BT): Body<Def, BT> {
    const maybeBody = this.getFirstBodyInType(bodies, bodyType);
    if (maybeBody.err) throw new Error(maybeBody.val);
    return maybeBody.val;
  }

  static resetAllBodies<Def extends DataDefinition>(
    bodiesState: BodiesState<Def>,
    newBodies: AnyTypeBody<Def>[]
  ): BodiesState<Def> {
    const mutBodyArrays: {[BT in BodyType<Def>]?: [string, Body<Def, BT>][]} =
      {};

    const getMutAry = <BT extends BodyType<Def>>(
      bodyType: BT
    ): [string, Body<Def, BT>][] => {
      const maybeAry = mutBodyArrays[bodyType];
      if (maybeAry !== undefined) return maybeAry;
      const mutAry: [string, Body<Def, BT>][] = [];
      mutBodyArrays[bodyType] = mutAry;
      return mutAry;
    };

    for (const b of newBodies) {
      const bodyType: BodyType<Def> = b.bodyType;
      const bodyIdKey = b.id[1];
      const bodyAry = getMutAry(bodyType);
      bodyAry.push([bodyIdKey, b]);
    }

    const mutBodyMaps: {[BT in BodyType<Def>]?: ImMap<string, Body<Def, BT>>} =
      {};

    for (const bt in mutBodyArrays) {
      const bodyType: BodyType<Def> = bt;
      const bodyAry = mutBodyArrays[bodyType];
      if (bodyAry === undefined) throw new Error('engine bug');
      mutBodyMaps[bodyType] = TImMap.new(bodyAry);
    }

    return {
      ...bodiesState,
      bodyMaps: mutBodyMaps,
    };
  }

  private static fetchBodyMapOfType<
    Def extends DataDefinition,
    BT extends BodyType<Def>
  >(bodies: BodiesState<Def>, type: BT): ImMap<string, Body<Def, BT>> {
    const source = bodies.bodyMaps[type];
    return source ?? TImMap.new();
  }
}
