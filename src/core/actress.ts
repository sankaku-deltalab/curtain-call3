import product, {castDraft} from 'immer';
import {Collision} from './components/collision';
import {GameState, GameStateTrait, VisibleGameState} from './game-state';
import {Graphic} from './components/graphics/graphic';
import {Input} from './components/inputs/input';
import {Res, Result} from './result';
import {BodyTypes, MindTypes, Setting} from './setting';
import {AnyEvent, SceneTrait} from './scene';
import {Mut} from './util';

export type ActressesState<Stg extends Setting> = {
  bodies: Record<BodyId, AnyBodyState<Stg>>;
  minds: Record<MindId, AnyMindState<Stg>>;
};

export type BodyId = string;
export type MindId = string;

export type BodyState<
  Stg extends Setting,
  BT extends BodyTypes<Stg>
> = BodyStateRaw<Stg, BT> & {
  meta: {bodyType: BT};
};

export type AnyBodyState<Stg extends Setting> = BodyState<Stg, BodyTypes<Stg>>;

export type MindState<
  Stg extends Setting,
  MT extends MindTypes<Stg>
> = MindStateRaw<Stg, MT> & {
  meta: {mindType: MT; bodyId: BodyId};
};

export type AnyMindState<Stg extends Setting> = MindState<Stg, MindTypes<Stg>>;

type BodyStateRaw<
  Stg extends Setting,
  BT extends BodyTypes<Stg>
> = Stg['bodies'][BT];

type MindStateRaw<
  Stg extends Setting,
  MT extends MindTypes<Stg>
> = Stg['minds'][MT];

export type ActressState<
  Stg extends Setting,
  BT extends BodyTypes<Stg>,
  MT extends MindTypes<Stg>
> = {body: BodyState<Stg, BT>; mind: MindState<Stg, MT>; ev: AnyEvent<Stg>[]};

export type AnyActressState<Stg extends Setting> = ActressState<
  Stg,
  BodyTypes<Stg>,
  MindTypes<Stg>
>;

export class ActressTrait {
  static initialState<Stg extends Setting>(): ActressesState<Stg> {
    return {
      bodies: {},
      minds: {},
    };
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
    st = Mut.replace(st, 'minds', m => ({...m, ...args.minds}));
    st = Mut.replace(st, 'bodies', b => ({...b, ...args.bodies}));
    return st;
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

    return Res.ok({mind: mind.val, body: body.val, ev: []});
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

    let st = state;
    st = Mut.replace(st, 'scene', s => SceneTrait.mergeEvents(s, newEvents));
    st = Mut.replace(st, 'actresses', s =>
      ActressTrait.mergeMindsAndBodies(s, {minds, bodies})
    );

    return st;
  }
}

export interface ActressBehavior<
  Stg extends Setting,
  BT extends BodyTypes<Stg>,
  MT extends MindTypes<Stg>
> {
  readonly bodyType: BT;
  readonly mindType: MT;

  apply_input(
    st: ActressState<Stg, BT, MT>,
    args: {
      input: Input<Stg>;
      gameState: VisibleGameState<Stg>;
    }
  ): ActressState<Stg, BT, MT>;

  update(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): ActressState<Stg, BT, MT>;

  generate_graphics(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): Graphic<Stg>[];

  generate_collision(
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
