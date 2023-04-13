import {CustomInputs, DataDefinition} from '../setting/data-definition';
import {
  CanvasRenderingState,
  InputCanvasPointerState,
  RawCanvasPointerState,
  RealWorldTimeState,
  TInputCanvasPointerState,
  TRealWorldTimeState,
} from './state-components';
import {
  InputRawCustomInputsState,
  TInputRawCustomInputsState,
} from './state-components/states-for-engine/input-raw-custom-inputs-state';

/**
 * UserGivenValuesState is
 * - serializable.
 * - user must give this at every update.
 */
export type UserGivenValuesState<Def extends DataDefinition> = {
  inputCanvasPointer: InputCanvasPointerState;
  inputRawCustomInputs: InputRawCustomInputsState<Def>;
  rendering: CanvasRenderingState;
  realWorldTime: RealWorldTimeState;
};

export type UpdateInput<Def extends DataDefinition> = {
  canvasPointer: RawCanvasPointerState;
  customInput: CustomInputs<Def>;
  renderingState: CanvasRenderingState;
  realWorldTimeDeltaMs: number;
};

export class TUserGivenValuesState {
  static new<Def extends DataDefinition>(
    updateInputs: UpdateInput<Def>
  ): UserGivenValuesState<Def> {
    return {
      inputCanvasPointer: TInputCanvasPointerState.new(
        updateInputs.canvasPointer
      ),
      inputRawCustomInputs: TInputRawCustomInputsState.new(
        updateInputs.customInput
      ),
      rendering: updateInputs.renderingState,
      realWorldTime: TRealWorldTimeState.new(updateInputs.realWorldTimeDeltaMs),
    };
  }
}
