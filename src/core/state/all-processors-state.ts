import {DataDefinition} from '../setting/data-definition';
import {
  DirectorState,
  DynamicSourcesState,
  MindsState,
  ProceduresState,
} from './state-components';

/**
 * AllProcessorsState is
 * - not serializable.
 * - constant (but can contain cache in future).
 */
export type AllProcessorsState<Def extends DataDefinition> = {
  minds: MindsState<Def>;
  dynamicSources: DynamicSourcesState<Def>;
  procedures: ProceduresState<Def>;
  director: DirectorState<Def>;
};
