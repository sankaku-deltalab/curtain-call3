import {ImList} from '../utils/im-list';
import {AnyCue, CuePriority} from './components/cue';
import {GameState} from './game-state';
import {Setting} from './setting';

export class DirectorTrait {}

export interface DirectorBehavior<Stg extends Setting> {
  applyInput(state: GameState<Stg>): GameState<Stg>;

  update(state: GameState<Stg>): GameState<Stg>;

  generateCuesAtUpdate(state: GameState<Stg>): ImList<AnyCue<Stg>>;

  getCuePriority(): CuePriority<Stg>;

  getTimeScales(state: GameState<Stg>): TimeScaling<Stg>;
}

export type TimeScaling<_Stg extends Setting> = {base: number};
