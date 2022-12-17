import {Res, Result} from '../../utils/result';
import {BodyTypes, MindTypes, Setting} from '../setting';
import {Im} from '../../utils/immutable-manipulation';
import {Enum} from '../../utils/enum';

export type ActressPartsState<Stg extends Setting> = Readonly<{
  bodyIdCount: number;
  mindIdCount: number;
  bodies: Record<BodyId, AnyBodyState<Stg>>;
  minds: Record<MindId, AnyMindState<Stg>>;
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

export type BodyStateRaw<
  Stg extends Setting,
  BT extends BodyTypes<Stg>
> = Stg['bodies'][BT];

export type AnyBodyStateRaw<Stg extends Setting> = BodyStateRaw<
  Stg,
  BodyTypes<Stg>
>;

export type MindStateRaw<
  Stg extends Setting,
  MT extends MindTypes<Stg>
> = Stg['minds'][MT];

export type AnyMindStateRaw<Stg extends Setting> = MindStateRaw<
  Stg,
  MindTypes<Stg>
>;

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
      bodies: {},
      minds: {},
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
    return actSt.minds;
  }

  static getBodies<Stg extends Setting>(
    actSt: ActressPartsState<Stg>
  ): Record<BodyId, AnyBodyState<Stg>> {
    return actSt.bodies;
  }

  static getFirstBody<Stg extends Setting, BT extends BodyTypes<Stg>>(
    actSt: ActressPartsState<Stg>,
    bodyType: BT
  ): Result<BodyState<Stg, BT>> {
    for (const bodyId in actSt.bodies) {
      if (actSt.bodies[bodyId].meta.bodyType === bodyType)
        return Res.ok(actSt.bodies[bodyId] as BodyState<Stg, BT>);
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
    let st = state;
    st = Im.replace(st, 'minds', m => ({...m, ...args.minds}));
    st = Im.replace(st, 'bodies', b => ({...b, ...args.bodies}));
    return st;
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
      st => Im.replace(st, 'minds', m => Im.add(m, mindId, mind)),
      st => Im.replace(st, 'bodies', b => Im.add(b, bodyId, body))
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

    const minds = Im.pipe(
      () => createdActs,
      a =>
        Enum.map(a, ({mindId, mind}): [MindId, AnyMindState<Stg>] => [
          mindId,
          mind,
        ]),
      m => Object.fromEntries(m)
    )();
    const bodies = Im.pipe(
      () => createdActs,
      a =>
        Enum.map(a, ({bodyId, body}): [MindId, AnyBodyState<Stg>] => [
          bodyId,
          body,
        ]),
      m => Object.fromEntries(m)
    )();
    const st2 = Im.pipe(
      () => st,
      st => Im.replace(st, 'minds', m => Im.merge(m, minds)),
      st => Im.replace(st, 'bodies', b => Im.merge(b, bodies))
    )();

    return {state: st2, ids};
  }

  static generateActressId<Stg extends Setting>(
    state: ActressPartsState<Stg>
  ): {state: ActressPartsState<Stg>; bodyId: BodyId; mindId: MindId} {
    const bodyId = `b${state.bodyIdCount}`;
    const mindId = `m${state.mindIdCount}`;
    let st = state;
    st = Im.replace(st, 'bodyIdCount', c => c + 1);
    st = Im.replace(st, 'mindIdCount', c => c + 1);
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
      st => Im.replace(st, 'bodyIdCount', c => c + counts),
      st => Im.replace(st, 'mindIdCount', c => c + counts),
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
    const oldBody = state.bodies[bodyId];
    if (oldBody.meta.bodyType !== bodyType) throw new Error('');

    const body = updater(oldBody as BodyState<Stg, BT>, {bodyId});
    if (body === undefined) return state;

    const bodies = {
      ...state.bodies,
      [bodyId]: body,
    };
    return Im.replace(state, 'bodies', () => bodies);
  }

  static replaceBodies<Stg extends Setting>(
    state: ActressPartsState<Stg>,
    bodies: Record<BodyId, AnyBodyState<Stg>>
  ): ActressPartsState<Stg> {
    return Im.replace(state, 'bodies', () => ({
      ...state.bodies,
      ...bodies,
    }));
  }
}
