import {DataDefinition} from '../setting/data-definition';
import {Director} from '../user-defined-processors/director';
import {BodiesState} from './state-components/bodies-state';
import {
  CameraState,
  CanvasRenderingState,
} from './state-components/camera-state';
import {CollisionState} from './state-components/collision-state';
import {DataSourcesState} from './state-components/data-sources-state';
import {DynamicSourcesState} from './state-components/dynamic-sources-state';
import {InputPointerState} from './state-components/input-pointer-state';
import {LevelState} from './state-components/level-state';
import {InputCanvasPointerState} from './state-components/states-for-engine/input-canvas-pointer-state';
import {MindsState} from './state-components/states-for-engine/minds-state';
import {ProceduresState} from './state-components/states-for-engine/procedures-state';
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
  time: TimeState<Def>;
  inputPointer: InputPointerState;
  // notification?
};

/**
 * SerializableState is
 * - Serializable.
 * - Used in user state management (e.g. Redux).
 */
export type SerializableState<Def extends DataDefinition> = Omit<
  GameState<Def>,
  'dynamicSources'
>;

/**
 * AllState is
 * - Not serializable.
 * - Used in engine-side processing.
 */
export type AllState<Def extends DataDefinition> = GameState<Def> & {
  minds: MindsState<Def>;
  procedures: ProceduresState<Def>;
  director: Director<Def>;
  inputCanvasPointer: InputCanvasPointerState;
  rendering: CanvasRenderingState;
};
