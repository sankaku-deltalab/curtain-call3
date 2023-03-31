import {DataDefinition} from '../setting/data-definition';
import {
  CanvasRenderingState,
  InputCanvasPointerState,
  RealWorldTimeState,
} from './state-components';

/**
 * UserGivenValuesState is
 * - serializable.
 * - user must give this at every update.
 */
export type UserGivenValuesState<_Def extends DataDefinition> = {
  inputCanvasPointer: InputCanvasPointerState;
  rendering: CanvasRenderingState;
  realWorldTime: RealWorldTimeState;
};
