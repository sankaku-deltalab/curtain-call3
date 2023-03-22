import {Vec2d} from '../../utils';
import {DataDefinition, Level} from '../setting/data-definition';
import {AllState} from './all-state';
import {GameState} from './game-states';
import {
  DataSources,
  TBodiesState,
  TCameraState,
  TCollisionState,
  TDataSourcesState,
  TInputPointerState,
  TLevelState,
  TTimeState,
} from './state-components';

/**
 * SerializableState is
 * - Serializable.
 * - Used in user state management (e.g. Redux).
 */
export type SerializableState<Def extends DataDefinition> = Omit<
  GameState<Def>,
  'dynamicSources'
>;

export type StatesNotInSerializable<Def extends DataDefinition> = Omit<
  AllState<Def>,
  keyof SerializableState<Def>
>;

export class TSerializableState {
  static new<Def extends DataDefinition>(args: {
    level: Level<Def>;
    cameraSize: Vec2d;
    dataSources: DataSources<Def>;
  }): SerializableState<Def> {
    return {
      level: TLevelState.new(args.level),
      bodies: TBodiesState.new(),
      camera: TCameraState.new({size: args.cameraSize}),
      collision: TCollisionState.new(),
      dataSources: TDataSourcesState.new(args.dataSources),
      time: TTimeState.new(),
      inputPointer: TInputPointerState.new(),
    };
  }
}
