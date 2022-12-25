import {Res, Result} from '../../utils/result';
import {
  BodyStateRaw,
  BodyTypes,
  MindStateRaw,
  MindTypes,
  Setting,
} from '../setting';
import {Im} from '../../utils/immutable-manipulation';
import {Enum} from '../../utils/enum';
import {ImMap, ImMapTrait} from '../../utils/im-map';

export type ActressPartsState<Stg extends Setting> = Readonly<{
  bodyIdCount: number;
  mindIdCount: number;
  bodies: ImMap<BodyId, AnyBodyState<Stg>>;
  minds: ImMap<MindId, AnyMindState<Stg>>;
}>;

export type BodyId = string;
export type MindId = string;

export type BodyState<
  Stg extends Setting,
  BT extends BodyTypes<Stg>
> = BodyStateRaw<Stg, BT> & {
  readonly meta: {bodyType: BT; del: boolean};
};

export type AnyBodyState<Stg extends Setting> = BodyState<Stg, BodyTypes<Stg>>;

export type MindState<
  Stg extends Setting,
  MT extends MindTypes<Stg>
> = MindStateRaw<Stg, MT> & {
  readonly meta: {mindType: MT; bodyId: BodyId};
};

export type AnyMindState<Stg extends Setting> = MindState<Stg, MindTypes<Stg>>;

export type ActressInitializer<
  Stg extends Setting,
  BT extends BodyTypes<Stg>,
  MT extends MindTypes<Stg>
> = {
  bodyType: BT;
  mindType: MT;
  body: BodyStateRaw<Stg, BT>;
  mind: MindStateRaw<Stg, MT>;
};

export class ActressPartsTrait {
  static initialState<Stg extends Setting>(): ActressPartsState<Stg> {
    return {
      bodyIdCount: 0,
      mindIdCount: 0,
      bodies: ImMapTrait.new(),
      minds: ImMapTrait.new(),
    };
  }

  static bodyIsInType<Stg extends Setting, BT extends BodyTypes<Stg>>(
    body: AnyBodyState<Stg>,
    bodyType: BT
  ): body is BodyState<Stg, BT> {
    return body.meta.bodyType === bodyType;
  }

  static getMinds<Stg extends Setting>(
    actSt: ActressPartsState<Stg>
  ): Record<MindId, AnyMindState<Stg>> {
    const minds = ImMapTrait.items(actSt.minds);
    return Object.fromEntries(minds);
  }

  static getBodies<Stg extends Setting>(
    actSt: ActressPartsState<Stg>
  ): Record<BodyId, AnyBodyState<Stg>> {
    const bodies = ImMapTrait.items(actSt.bodies);
    return Object.fromEntries(bodies);
  }

  static getFirstBody<Stg extends Setting, BT extends BodyTypes<Stg>>(
    actSt: ActressPartsState<Stg>,
    bodyType: BT
  ): Result<BodyState<Stg, BT>> {
    const bodies = ImMapTrait.items(actSt.bodies);
    for (const [_bodyId, body] of bodies) {
      if (body.meta.bodyType === bodyType)
        return Res.ok(body as BodyState<Stg, BT>);
    }
    return Res.err(`body of "${bodyType}" is not found`);
  }

  static mergeMindsAndBodies<Stg extends Setting>(
    state: ActressPartsState<Stg>,
    args: {
      minds: Record<MindId, AnyMindState<Stg>>;
      bodies: Record<BodyId, AnyBodyState<Stg>>;
    }
  ): ActressPartsState<Stg> {
    const mindsAry = Object.entries(args.minds);
    const bodiesAry = Object.entries(args.bodies);
    const newMinds = ImMapTrait.new(mindsAry);
    const newBodies = ImMapTrait.new(bodiesAry);
    return Im.pipe(
      () => state,
      st => Im.update(st, 'minds', () => newMinds),
      st => Im.update(st, 'bodies', () => newBodies)
    )();
  }

  static addActress<
    Stg extends Setting,
    BT extends BodyTypes<Stg>,
    MT extends MindTypes<Stg>
  >(
    state: ActressPartsState<Stg>,
    act: ActressInitializer<Stg, BT, MT>
  ): {state: ActressPartsState<Stg>; bodyId: BodyId; mindId: MindId} {
    const {state: st, bodyId, mindId} = this.generateActressId(state);
    const {body, mind} = this.createActress({bodyId, mindId, ...act});
    const st2 = Im.pipe(
      () => st,
      st =>
        Im.update(st, 'minds', minds => ImMapTrait.put(minds, mindId, mind)),
      st =>
        Im.update(st, 'bodies', bodies => ImMapTrait.put(bodies, bodyId, body))
    )();

    return {state: st2, bodyId, mindId};
  }

  static addActresses<
    Stg extends Setting,
    BT extends BodyTypes<Stg>,
    MT extends MindTypes<Stg>
  >(
    state: ActressPartsState<Stg>,
    acts: ActressInitializer<Stg, BT, MT>[]
  ): {state: ActressPartsState<Stg>; ids: {bodyId: BodyId; mindId: MindId}[]} {
    const {state: st, ids} = this.generateActressIds(state, acts.length);
    const createdActs = Im.pipe(
      () => Enum.zip(acts, ids),
      r =>
        Enum.map(r, ([act, {bodyId, mindId}]) =>
          this.createActress({bodyId, mindId, ...act})
        )
    )();

    const addingMinds = Im.pipe(
      () => createdActs,
      a =>
        Enum.map(a, ({mindId, mind}): [MindId, AnyMindState<Stg>] => [
          mindId,
          mind,
        ])
    )();
    const addingBodies = Im.pipe(
      () => createdActs,
      a =>
        Enum.map(a, ({bodyId, body}): [MindId, AnyBodyState<Stg>] => [
          bodyId,
          body,
        ])
    )();
    const st2 = Im.pipe(
      () => st,
      st => Im.update(st, 'minds', m => ImMapTrait.putMulti(m, addingMinds)),
      st => Im.update(st, 'bodies', b => ImMapTrait.putMulti(b, addingBodies))
    )();

    return {state: st2, ids};
  }

  static generateActressId<Stg extends Setting>(
    state: ActressPartsState<Stg>
  ): {state: ActressPartsState<Stg>; bodyId: BodyId; mindId: MindId} {
    const bodyId = `b${state.bodyIdCount}`;
    const mindId = `m${state.mindIdCount}`;
    let st = state;
    st = Im.update(st, 'bodyIdCount', c => c + 1);
    st = Im.update(st, 'mindIdCount', c => c + 1);
    return {state: st, bodyId, mindId};
  }

  static generateActressIds<Stg extends Setting>(
    state: ActressPartsState<Stg>,
    counts: number
  ): {state: ActressPartsState<Stg>; ids: {bodyId: BodyId; mindId: MindId}[]} {
    const bodyCounts = Im.range(state.bodyIdCount, state.bodyIdCount + counts);
    const mindCounts = Im.range(state.mindIdCount, state.mindIdCount + counts);
    const bodyIds = Enum.map(bodyCounts, c => `b${c}`);
    const mindIds = Enum.map(mindCounts, c => `m${c}`);

    const ids = Im.pipe(
      () => Enum.zip(bodyIds, mindIds),
      v =>
        Enum.map(v, ([bodyId, mindId]) => ({
          bodyId,
          mindId,
        }))
    )();

    return Im.pipe(
      () => state,
      st => Im.update(st, 'bodyIdCount', c => c + counts),
      st => Im.update(st, 'mindIdCount', c => c + counts),
      st => ({state: st, ids})
    )();
  }

  static createActress<
    Stg extends Setting,
    BT extends BodyTypes<Stg>,
    MT extends MindTypes<Stg>
  >(args: {
    bodyId: BodyId;
    mindId: MindId;
    bodyType: BT;
    mindType: MT;
    body: BodyStateRaw<Stg, BT>;
    mind: MindStateRaw<Stg, MT>;
  }): {
    bodyId: BodyId;
    mindId: MindId;
    body: BodyState<Stg, BT>;
    mind: MindState<Stg, MT>;
  } {
    const body: BodyState<Stg, BT> = {
      ...args.body,
      meta: {bodyType: args.bodyType, del: false},
    };
    const mind: MindState<Stg, MT> = {
      ...args.mind,
      meta: {bodyId: args.bodyId, mindType: args.mindType},
    };

    return {
      bodyId: args.bodyId,
      body,
      mindId: args.mindId,
      mind,
    };
  }

  static updateBody<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: ActressPartsState<Stg>,
    bodyId: BodyId,
    bodyType: BT,
    updater: (
      body: BodyState<Stg, BT>,
      args: {bodyId: BodyId}
    ) => BodyState<Stg, BT> | undefined
  ): ActressPartsState<Stg> {
    const oldBody = ImMapTrait.fetch(state.bodies, bodyId, undefined);
    if (oldBody === undefined) throw new Error('body not found');
    if (oldBody.meta.bodyType !== bodyType)
      throw new Error('body has wrong type');

    const body = updater(oldBody as BodyState<Stg, BT>, {bodyId});
    if (body === undefined) return state;
    return Im.update(state, 'bodies', bodies =>
      ImMapTrait.put(bodies, bodyId, body)
    );
  }

  static replaceBodies<Stg extends Setting>(
    state: ActressPartsState<Stg>,
    bodies: Record<BodyId, AnyBodyState<Stg>>
  ): ActressPartsState<Stg> {
    const bs = Object.entries(bodies);
    return Im.update(state, 'bodies', oldBodies =>
      ImMapTrait.putMulti(oldBodies, bs)
    );
  }
}
