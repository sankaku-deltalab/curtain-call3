import {CameraState, CameraTrait} from './components/camera';
import {Res, Result} from './result';
import {AnyEvent, BodyTypes, MindTypes, Setting} from './setting';
import {TimeState, TimeTrait} from './components/time';
import {InputState, InputTrait} from './components/inputs/input';
import {Vec2d} from './util';

export type GameState<Stg extends Setting> = {
  time: TimeState<Stg>;
  camera: CameraState<Stg>;
  input: InputState<Stg>;
  bodies: Record<BodyId, AnyBodyState<Stg>>;
  minds: Record<MindId, AnyMindState<Stg>>;
  events: AnyEvent<Stg>[];
};

export type VisibleGameState<Stg extends Setting> = Exclude<
  GameState<Stg>,
  'minds' | 'events'
>;

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

export type StateInitializer<_Stg extends Setting> = {
  camera: {
    size: Vec2d;
  };
};

export class GameStateTrait {
  static initialState<Stg extends Setting>(
    args: StateInitializer<Stg>
  ): GameState<Stg> {
    return {
      time: TimeTrait.initialState(),
      camera: CameraTrait.initialState(args.camera),
      input: InputTrait.initialState(),
      bodies: {},
      minds: {},
      events: [],
    };
  }

  static extractVisibleState<Stg extends Setting>(
    st: GameState<Stg>
  ): VisibleGameState<Stg> {
    return st; // TODO: impl this
  }

  static mergeVisibleState<Stg extends Setting>(
    st: GameState<Stg>,
    vst: VisibleGameState<Stg>
  ): GameState<Stg> {
    return {...st, ...vst};
  }

  static extractMind<Stg extends Setting>(
    mindId: MindId,
    st: GameState<Stg>
  ): Result<AnyMindState<Stg>> {
    return Res.errIfUndefined(
      st.minds[mindId],
      `Mind of id '${mindId}' is not exists`
    );
  }

  static extractBody<Stg extends Setting>(
    bodyId: BodyId,
    st: GameState<Stg>
  ): Result<AnyBodyState<Stg>> {
    return Res.errIfUndefined(
      st.bodies[bodyId],
      `Body of id '${bodyId}' is not exists`
    );
  }
}
