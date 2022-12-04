import {GameState} from './game-state';
import {EventPayload, EventTypes, Setting} from './setting';

export interface EventManipulator<
  Stg extends Setting,
  Type extends EventTypes<Stg>
> {
  applyEvent(
    state: GameState<Stg>,
    payload: EventPayload<Stg, Type>
  ): GameState<Stg>;
}
