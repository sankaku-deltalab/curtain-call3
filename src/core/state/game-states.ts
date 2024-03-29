import {DataDefinition} from '../setting/data-definition';
import {HitStopsState} from './state-components';
import {BodiesState} from './state-components/bodies-state';
import {CameraState} from './state-components/camera-state';
import {CollisionState} from './state-components/collision-state';
import {DataSourcesState} from './state-components/data-sources-state';
import {DynamicSourcesState} from './state-components/dynamic-sources-state';
import {InputCustomState} from './state-components/input-custom-state';
import {InputPointerState} from './state-components/input-pointer-state';
import {LevelState} from './state-components/level-state';
import {TimeState} from './state-components/time-state';

/**
 * GameState is
 * - Not serializable.
 * - Used in user defined functions.
 */
export type GameState<Def extends DataDefinition> = {
  level: LevelState<Def>;
  bodies: BodiesState<Def>;
  camera: CameraState<Def>;
  collision: CollisionState<Def>;
  dataSources: DataSourcesState<Def>;
  dynamicSources: DynamicSourcesState<Def>;
  hitStops: HitStopsState<Def>;
  time: TimeState<Def>;
  inputCustom: InputCustomState<Def>;
  inputPointer: InputPointerState;
  // notification?
};
