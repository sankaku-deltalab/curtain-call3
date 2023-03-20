import {DataDefinition} from '../setting/data-definition';
import {AllState} from './all-state';
import {GameState} from './game-states';

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
