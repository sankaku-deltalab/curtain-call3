import {CameraState, CameraTrait} from './components/camera';
import {LevelState, Setting} from './setting';
import {TimeState, TimeTrait} from './components/time';
import {InputState, InputTrait} from './components/inputs/input';
import {Vec2d} from '../utils/vec2d';
import {ActressPartsState, ActressPartsTrait} from './components/actress-parts';
import {SceneState, SceneTrait} from './scene';
import {CueState, CueTrait} from './components/cue';
import {NotificationState, NotificationTrait} from './notification';
import {
  CollisionState,
  CollisionTrait,
} from './components/collision/collision-state';
import {
  DataSources,
  DataSourcesState,
  DataSourcesTrait,
} from './components/data-sources';

export type GameState<Stg extends Setting> = Readonly<{
  time: TimeState<Stg>;
  camera: CameraState<Stg>;
  input: InputState<Stg>;
  dataSources: DataSourcesState<Stg>;
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
  dataSources: DataSources<Stg>;
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
      dataSources: DataSourcesTrait.initialState(args.dataSources),
      actressParts: ActressPartsTrait.initialState(),
      scene: SceneTrait.initialState({initialLevel: args.level}),
      cue: CueTrait.initialState(),
      notification: NotificationTrait.initialState(),
    };
  }
}
