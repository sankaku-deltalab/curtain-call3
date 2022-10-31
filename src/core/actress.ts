import product, {castDraft} from 'immer';
import {Collision} from './components/collision';
import {GameState, GameStateTrait, VisibleGameState} from './game-state';
import {Graphic} from './components/graphics/graphic';
import {Input} from './components/inputs/input';
import {Res, Result} from './result';
import {AnyEvent, BodyTypes, MindTypes, Setting} from './setting';

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

  static mergeActressState<Stg extends Setting>(
    st: GameState<Stg>,
    mindId: MindId,
    act: AnyActressState<Stg>
  ): GameState<Stg> {
    const bodyId = act.mind.meta.bodyId;
    return product(st, st => {
      st.actresses.minds[mindId] = castDraft(act.mind);
      st.actresses.bodies[bodyId] = castDraft(act.body);
      st.events.concat(castDraft(act.ev));
    });
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
