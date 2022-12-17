import {Overlaps} from './components';
import {GameState} from './game-state';
import {CuePayload, CueTypes, Setting} from './setting';

export interface CueHandler<Stg extends Setting, Type extends CueTypes<Stg>> {
  generateCuesAtUpdate(
    state: GameState<Stg>,
    args: {
      overlaps: Overlaps;
    }
  ): CuePayload<Stg, Type>[];

  applyCue(
    state: GameState<Stg>,
    payload: CuePayload<Stg, Type>
  ): GameState<Stg>;
}
