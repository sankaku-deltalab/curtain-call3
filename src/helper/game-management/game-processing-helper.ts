import {CanvasGraphic} from '../../core/components/graphics/graphic';
import {
  AnyTypeNotification,
  DataDefinition,
  Level,
} from '../../core/setting/data-definition';
import {DataSourcesList} from '../../core/state';
import {AllState, TAllState} from '../../core/state/all-state';
import {
  SerializableState,
  StatesNotSerializable,
  TSerializableState,
} from '../../core/state/serializable-state';
import {AaRect2d, Vec2d} from '../../utils';

export class GameProcessingHelper {
  static createSerializableState<Def extends DataDefinition>(args: {
    level: Level<Def>;
    cameraSize: Vec2d;
    dataSources: DataSourcesList<Def>;
  }): SerializableState<Def> {
    return TSerializableState.new(args);
  }

  static updateState<Def extends DataDefinition>(
    state: SerializableState<Def>,
    otherStates: StatesNotSerializable<Def>
  ): {
    state: SerializableState<Def>;
    notifications: AnyTypeNotification<Def>[];
  } {
    const allState = this.generateAllState(state, otherStates);
    const {state: newAllState, notifications} = TAllState.updateState(allState);
    const newSerializableState =
      TAllState.extractSerializableState(newAllState);

    return {state: newSerializableState, notifications};
  }

  private static generateAllState<Def extends DataDefinition>(
    serializableState: SerializableState<Def>,
    otherStates: StatesNotSerializable<Def>
  ): AllState<Def> {
    return {
      ...serializableState,
      ...otherStates,
    };
  }

  static generateGraphics<Def extends DataDefinition>(
    state: SerializableState<Def>,
    otherStates: StatesNotSerializable<Def>
  ): CanvasGraphic<Def>[] {
    const allState = this.generateAllState(state, otherStates);
    return TAllState.generateGraphics(allState);
  }

  static calcRenderingAreaOfCanvas<Def extends DataDefinition>(
    state: SerializableState<Def>,
    otherStates: StatesNotSerializable<Def>
  ): AaRect2d {
    const allState = this.generateAllState(state, otherStates);
    return TAllState.calcRenderingAreaOfCanvas(allState);
  }
}
