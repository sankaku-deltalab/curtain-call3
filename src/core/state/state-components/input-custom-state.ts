import {CustomInputs, DataDefinition} from '../../setting/data-definition';

export type InputCustomState<Def extends DataDefinition> = {
  current: CustomInputs<Def>;
  prev: CustomInputs<Def>;
};

export class TInputCustomState {
  static new<Def extends DataDefinition>(
    initial: CustomInputs<Def>
  ): InputCustomState<Def> {
    return {
      current: initial,
      prev: initial,
    };
  }

  static update<Def extends DataDefinition>(
    state: InputCustomState<Def>,
    args: {
      newInput: CustomInputs<Def>;
    }
  ): InputCustomState<Def> {
    return {
      current: args.newInput,
      prev: state.current,
    };
  }

  static getCurrent<Def extends DataDefinition>(
    state: InputCustomState<Def>
  ): CustomInputs<Def> {
    return state.current;
  }

  static getPrevious<Def extends DataDefinition>(
    state: InputCustomState<Def>
  ): CustomInputs<Def> {
    return state.prev;
  }
}
