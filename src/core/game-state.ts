import {CameraState, CameraTrait} from './components/camera';
import {Res, Result} from '../utils/result';
import {LevelState, Setting} from './setting';
import {TimeState, TimeTrait} from './components/time';
import {InputState, InputTrait} from './components/inputs/input';
import {Vec2d} from '../utils/vec2d';
import {
  ActressPartsState,
  ActressPartsTrait,
  AnyBodyState,
  AnyMindState,
  BodyId,
  MindId,
} from './components/actress-parts';
import {SceneState, SceneTrait} from './scene';
import {CueState, CueTrait} from './components/cue';
import {NotificationState, NotificationTrait} from './notification';
import {
  CollisionState,
  CollisionTrait,
} from './components/collision/collision-state';

export type GameState<Stg extends Setting> = Readonly<{
  time: TimeState<Stg>;
  camera: CameraState<Stg>;
  input: InputState<Stg>;
  actressParts: ActressPartsState<Stg>;
  collision: CollisionState;
  scene: SceneState<Stg>;
  cue: CueState<Stg>;
  notification: NotificationState<Stg>;
}>;

export type StateInitializer<Stg extends Setting> = Readonly<{
  camera: Readonly<{
    size: Vec2d;
  }>;
  level: LevelState<Stg>;
}>;

export class GameStateTrait {
  static initialState<Stg extends Setting>(
    args: StateInitializer<Stg>
  ): GameState<Stg> {
    return {
      time: TimeTrait.initialState(),
      camera: CameraTrait.initialState(args.camera),
      input: InputTrait.initialState(),
      collision: CollisionTrait.initialState(),
      actressParts: ActressPartsTrait.initialState(),
      scene: SceneTrait.initialState({initialLevel: args.level}),
      cue: CueTrait.initialState(),
      notification: NotificationTrait.initialState(),
    };
  }

  static extractMind<Stg extends Setting>(
    mindId: MindId,
    state: GameState<Stg>
  ): Result<AnyMindState<Stg>> {
    const minds = ActressPartsTrait.getMinds(state.actressParts);
    return Res.errIfUndefined(
      minds[mindId],
      `Mind of id '${mindId}' is not exists`
    );
  }

  static extractBody<Stg extends Setting>(
    bodyId: BodyId,
    state: GameState<Stg>
  ): Result<AnyBodyState<Stg>> {
    const bodies = ActressPartsTrait.getBodies(state.actressParts);
    return Res.errIfUndefined(
      bodies[bodyId],
      `Body of id '${bodyId}' is not exists`
    );
  }
}
