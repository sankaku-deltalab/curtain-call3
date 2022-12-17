import {Overlaps} from './components';
import {GameState} from './game-state';
import {CuePayload, CueTypes, Setting} from './setting';

export interface EventManipulator<
  Stg extends Setting,
  Type extends CueTypes<Stg>
> {
  generateEventsAtUpdate(
    state: GameState<Stg>,
    args: {
      overlaps: Overlaps;
    }
  ): CuePayload<Stg, Type>[];

  applyEvent(
    state: GameState<Stg>,
    payload: CuePayload<Stg, Type>
  ): GameState<Stg>;
}
