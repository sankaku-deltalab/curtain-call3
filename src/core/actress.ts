import {pipe} from 'rambda';
import {Collision} from './components/collision/collision';
import {GameState, GameStateTrait, VisibleGameState} from './game-state';
import {Graphic} from './components/graphics/graphic';
import {Res, Result} from './utils/result';
import {BodyTypes, MindTypes, Setting} from './setting';
import {AnyEvent, AnyNotification, SceneTrait} from './scene';
import {Enum, Im} from './utils/util';

export type ActressesState<Stg extends Setting> = {
  bodyIdCount: number;
  mindIdCount: number;
  bodies: Record<BodyId, AnyBodyState<Stg>>;
  minds: Record<MindId, AnyMindState<Stg>>;
};

export type BodyId = string;
export type MindId = string;

export type BodyState<
  Stg extends Setting,
  BT extends BodyTypes<Stg>
> = BodyStateRaw<Stg, BT> & {
  meta: {bodyType: BT; del: boolean};
};

export type AnyBodyState<Stg extends Setting> = BodyState<Stg, BodyTypes<Stg>>;

export type MindState<
  Stg extends Setting,
  MT extends MindTypes<Stg>
> = MindStateRaw<Stg, MT> & {
  meta: {mindType: MT; bodyId: BodyId};
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

export type ActressState<
  Stg extends Setting,
  BT extends BodyTypes<Stg>,
  MT extends MindTypes<Stg>
> = {
  body: BodyState<Stg, BT>;
  mind: MindState<Stg, MT>;
  ev: AnyEvent<Stg>[];
  notifications: AnyNotification<Stg>[];
};

export type AnyActressState<Stg extends Setting> = ActressState<
  Stg,
  BodyTypes<Stg>,
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

export class ActressTrait {
  static initialState<Stg extends Setting>(): ActressesState<Stg> {
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
    st: ActressesState<Stg>
  ): Record<MindId, AnyMindState<Stg>> {
    return st.minds;
  }

  static getBodies<Stg extends Setting>(
    st: ActressesState<Stg>
  ): Record<BodyId, AnyBodyState<Stg>> {
    return st.bodies;
  }

  static mergeMindsAndBodies<Stg extends Setting>(
    state: ActressesState<Stg>,
    args: {
      minds: Record<MindId, AnyMindState<Stg>>;
      bodies: Record<BodyId, AnyBodyState<Stg>>;
    }
  ): ActressesState<Stg> {
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
    state: ActressesState<Stg>,
    act: ActressInitializer<Stg, BT, MT>
  ): {state: ActressesState<Stg>; bodyId: BodyId; mindId: MindId} {
    const {state: st, bodyId, mindId} = this.generateActressId(state);
    const {body, mind} = this.createActress({bodyId, mindId, ...act});
    const st2 = pipe(
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
    state: ActressesState<Stg>,
    acts: ActressInitializer<Stg, BT, MT>[]
  ): {state: ActressesState<Stg>; ids: {bodyId: BodyId; mindId: MindId}[]} {
    const {state: st, ids} = this.generateActressIds(state, acts.length);
    const createdActs = pipe(
      () => Enum.zip(acts, ids),
      r =>
        Enum.map(r, ([act, {bodyId, mindId}]) =>
          this.createActress({bodyId, mindId, ...act})
        )
    )();

    const minds = pipe(
      () => createdActs,
      a =>
        Enum.map(a, ({mindId, mind}): [MindId, AnyMindState<Stg>] => [
          mindId,
          mind,
        ]),
      m => Object.fromEntries(m)
    )();
    const bodies = pipe(
      () => createdActs,
      a =>
        Enum.map(a, ({bodyId, body}): [MindId, AnyBodyState<Stg>] => [
          bodyId,
          body,
        ]),
      m => Object.fromEntries(m)
    )();
    const st2 = pipe(
      () => st,
      st => Im.replace(st, 'minds', m => Im.merge(m, minds)),
      st => Im.replace(st, 'bodies', b => Im.merge(b, bodies))
    )();

    return {state: st2, ids};
  }

  static generateActressId<Stg extends Setting>(
    state: ActressesState<Stg>
  ): {state: ActressesState<Stg>; bodyId: BodyId; mindId: MindId} {
    const bodyId = `b${state.bodyIdCount}`;
    const mindId = `m${state.mindIdCount}`;
    let st = state;
    st = Im.replace(st, 'bodyIdCount', c => c + 1);
    st = Im.replace(st, 'mindIdCount', c => c + 1);
    return {state: st, bodyId, mindId};
  }

  static generateActressIds<Stg extends Setting>(
    state: ActressesState<Stg>,
    counts: number
  ): {state: ActressesState<Stg>; ids: {bodyId: BodyId; mindId: MindId}[]} {
    const bodyCounts = Im.range(state.bodyIdCount, state.bodyIdCount + counts);
    const mindCounts = Im.range(state.mindIdCount, state.mindIdCount + counts);
    const bodyIds = Enum.map(bodyCounts, c => `b${c}`);
    const mindIds = Enum.map(mindCounts, c => `m${c}`);

    const ids = pipe(
      () => Enum.zip(bodyIds, mindIds),
      v =>
        Enum.map(v, ([bodyId, mindId]) => ({
          bodyId,
          mindId,
        }))
    )();

    return pipe(
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
    state: ActressesState<Stg>,
    bodyId: BodyId,
    bodyType: BT,
    updater: (
      body: BodyState<Stg, BT>,
      args: {bodyId: BodyId}
    ) => BodyState<Stg, BT> | undefined
  ): ActressesState<Stg> {
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
    state: ActressesState<Stg>,
    bodies: Record<BodyId, AnyBodyState<Stg>>
  ): ActressesState<Stg> {
    return Im.replace(state, 'bodies', () => ({
      ...state.bodies,
      ...bodies,
    }));
  }

  static extractActressState<Stg extends Setting>(
    st: GameState<Stg>,
    mindId: MindId
  ): Result<AnyActressState<Stg>> {
    const mind = GameStateTrait.extractMind(mindId, st);
    if (Res.isErr(mind)) {
      return mind;
    }

    const body = GameStateTrait.extractBody(mind.val.meta.bodyId, st);
    if (Res.isErr(body)) {
      return body;
    }

    return Res.ok({mind: mind.val, body: body.val, ev: [], notifications: []});
  }

  static mergeActressStates<Stg extends Setting>(
    state: GameState<Stg>,
    actSts: [MindId, AnyActressState<Stg>][]
  ): GameState<Stg> {
    const minds: Record<MindId, AnyMindState<Stg>> = Object.fromEntries(
      actSts.map(([mid, s]) => [mid, s.mind])
    );
    const bodies = Object.fromEntries(
      actSts.map(([_, s]) => [s.mind.meta.bodyId, s.body])
    );
    const newEvents = actSts.flatMap(([_, s]) => s.ev);
    const newNotifications = actSts.flatMap(([_, s]) => s.notifications);

    return pipe(
      () => state,
      st => Im.replace(st, 'scene', s => SceneTrait.mergeEvents(s, newEvents)),
      st =>
        Im.replace(st, 'scene', s =>
          SceneTrait.mergeNotifications(s, newNotifications)
        ),
      st =>
        Im.replace(st, 'actresses', s =>
          this.mergeMindsAndBodies(s, {minds, bodies})
        )
    )();
  }
}

export interface ActressBehavior<
  Stg extends Setting,
  BT extends BodyTypes<Stg>,
  MT extends MindTypes<Stg>
> {
  readonly bodyType: BT;
  readonly mindType: MT;

  applyInput(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): ActressState<Stg, BT, MT>;

  update(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): ActressState<Stg, BT, MT>;

  generateGraphics(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): Graphic<Stg>[];

  generateCollision(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): Collision;
}

export type AnyActressBehavior<Stg extends Setting> = ActressBehavior<
  Stg,
  BodyTypes<Stg>,
  MindTypes<Stg>
>;
