import {Vec2d} from '../../utils';
import {CustomInputs, DataDefinition, Level} from '../setting/data-definition';
import {GameState} from './game-states';
import {
  DataSourcesList,
  TBodiesState,
  TCameraState,
  TCollisionState,
  TDataSourcesState,
  THitStopsState,
  TInputPointerState,
  TLevelState,
  TTimeState,
} from './state-components';
import {TInputCustomState} from './state-components/input-custom-state';

/**
 * SerializableState is
 * - Serializable.
 * - Used in user state management (e.g. Redux).
 */
export type SerializableState<Def extends DataDefinition> = Omit<
  GameState<Def>,
  'dynamicSources'
>;

export class TSerializableState {
  static new<Def extends DataDefinition>(args: {
    level: Level<Def>;
    cameraSize: Vec2d;
    dataSources: DataSourcesList<Def>;
    initialCustomInputs: CustomInputs<Def>;
  }): SerializableState<Def> {
    return {
      level: TLevelState.new(args.level),
      bodies: TBodiesState.new(),
      camera: TCameraState.new({size: args.cameraSize}),
      collision: TCollisionState.new(),
      dataSources: TDataSourcesState.new(args.dataSources),
      hitStops: THitStopsState.new(),
      time: TTimeState.new(),
      inputCustom: TInputCustomState.new(args.initialCustomInputs),
      inputPointer: TInputPointerState.new(),
    };
  }
}
