import {CanvasGraphic} from '../../core/components/graphics/graphic';
import {
  AnyTypeNotification,
  DataDefinition,
} from '../../core/setting/data-definition';
import {AllState, TAllState} from '../../core/state/all-state';
import {
  SerializableState,
  StatesNotInSerializable,
} from '../../core/state/serializable-state';
import {CanvasRenderingState} from '../../core/state/state-components/camera-state';
import {AaRect2d} from '../../utils';

export class GameProcessingHelper {
  static createSerializableState() {}

  static updateState<Def extends DataDefinition>(
    state: SerializableState<Def>,
    otherStates: StatesNotInSerializable<Def>
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
    otherStates: StatesNotInSerializable<Def>
  ): AllState<Def> {
    return {
      ...serializableState,
      ...otherStates,
    };
  }

  static generateGraphics<Def extends DataDefinition>(
    state: SerializableState<Def>,
    otherStates: StatesNotInSerializable<Def>
  ): CanvasGraphic<Def>[] {
    const allState = this.generateAllState(state, otherStates);
    return TAllState.generateGraphics(allState);
  }

  static calcRenderingAreaOfCanvas<Def extends DataDefinition>(
    state: SerializableState<Def>,
    otherStates: StatesNotInSerializable<Def>
  ): AaRect2d {
    const allState = this.generateAllState(state, otherStates);
    return TAllState.calcRenderingAreaOfCanvas(allState);
  }
}
