import {CameraState} from './components/camera';
import {Res, Result} from './result';
import {AnyEvent, BodyTypes, MindTypes, Setting} from './setting';
import {TimeState} from './components/time';
import {InputState} from './components/inputs/input';

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

export class GameStateTrait {
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
