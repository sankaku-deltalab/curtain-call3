import {CanvasGraphic} from '../../core/components/graphics/graphic';
import {
  AnyTypeNotification,
  DataDefinition,
  Level,
} from '../../core/setting/data-definition';
import {DataSourcesList} from '../../core/state';
import {AllProcessorsState} from '../../core/state/all-processors-state';
import {AllState, TAllState} from '../../core/state/all-state';
import {
  SerializableState,
  TSerializableState,
} from '../../core/state/serializable-state';
import {UserGivenValuesState} from '../../core/state/user-given-values-state';
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
    processors: AllProcessorsState<Def>,
    values: UserGivenValuesState<Def>
  ): {
    state: SerializableState<Def>;
    notifications: AnyTypeNotification<Def>[];
  } {
    const allState = this.generateAllState(state, processors, values);
    const {state: newAllState, notifications} = TAllState.updateState(allState);
    const newSerializableState =
      TAllState.extractSerializableState(newAllState);

    return {state: newSerializableState, notifications};
  }

  private static generateAllState<Def extends DataDefinition>(
    serializableState: SerializableState<Def>,
    processors: AllProcessorsState<Def>,
    values: UserGivenValuesState<Def>
  ): AllState<Def> {
    return {
      ...serializableState,
      ...values,
      ...processors,
    };
  }

  static generateGraphics<Def extends DataDefinition>(
    state: SerializableState<Def>,
    processors: AllProcessorsState<Def>,
    values: UserGivenValuesState<Def>
  ): CanvasGraphic<Def>[] {
    const allState = this.generateAllState(state, processors, values);
    return TAllState.generateGraphics(allState);
  }

  static calcRenderingAreaOfCanvas<Def extends DataDefinition>(
    state: SerializableState<Def>,
    processors: AllProcessorsState<Def>,
    values: UserGivenValuesState<Def>
  ): AaRect2d {
    const allState = this.generateAllState(state, processors, values);
    return TAllState.calcRenderingAreaOfCanvas(allState);
  }
}
