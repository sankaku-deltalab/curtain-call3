import {CameraState, CameraTrait} from './components/camera';
import {Res, Result} from './result';
import {AnyEvent, Setting} from './setting';
import {TimeState, TimeTrait} from './components/time';
import {InputState, InputTrait} from './components/inputs/input';
import {Vec2d} from './util';
import {
  ActressesState,
  ActressTrait,
  AnyBodyState,
  AnyMindState,
  BodyId,
  MindId,
} from './actress';

export type GameState<Stg extends Setting> = {
  time: TimeState<Stg>;
  camera: CameraState<Stg>;
  input: InputState<Stg>;
  actresses: ActressesState<Stg>;
  events: AnyEvent<Stg>[];
};

export type VisibleGameState<Stg extends Setting> = Exclude<
  GameState<Stg>,
  'minds' | 'events'
>;

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
      actresses: ActressTrait.initialState(),
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
    const minds = ActressTrait.getMinds(st.actresses);
    return Res.errIfUndefined(
      minds[mindId],
      `Mind of id '${mindId}' is not exists`
    );
  }

  static extractBody<Stg extends Setting>(
    bodyId: BodyId,
    st: GameState<Stg>
  ): Result<AnyBodyState<Stg>> {
    const bodies = ActressTrait.getBodies(st.actresses);
    return Res.errIfUndefined(
      bodies[bodyId],
      `Body of id '${bodyId}' is not exists`
    );
  }
}
