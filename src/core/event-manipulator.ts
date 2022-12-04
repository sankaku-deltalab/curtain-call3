import {Overlaps} from './components';
import {GameState} from './game-state';
import {EventPayload, EventTypes, Setting} from './setting';

export interface EventManipulator<
  Stg extends Setting,
  Type extends EventTypes<Stg>
> {
  generateEventsAtUpdate(
    state: GameState<Stg>,
    args: {
      overlaps: Overlaps;
    }
  ): EventPayload<Stg, Type>[];

  applyEvent(
    state: GameState<Stg>,
    payload: EventPayload<Stg, Type>
  ): GameState<Stg>;
}
