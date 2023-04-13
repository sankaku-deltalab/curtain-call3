import {CustomInputs, DataDefinition} from '../../../setting/data-definition';

export type InputRawCustomInputsState<Def extends DataDefinition> = {
  inputs: CustomInputs<Def>;
};

export class TInputRawCustomInputsState {
  static new<Def extends DataDefinition>(
    inputs: CustomInputs<Def>
  ): InputRawCustomInputsState<Def> {
    return {
      inputs: inputs,
    };
  }
}
