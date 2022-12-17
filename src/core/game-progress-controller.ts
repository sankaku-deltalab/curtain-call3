import {GameInstances} from './game-instances';
import {GameState} from './game-state';
import {CanvasInput} from './components/inputs/input';
import {Setting} from './setting';
import {TimeInput} from './components/time';
import {Im} from '../utils/immutable-manipulation';
import {RenderingState} from './components/camera';
import {GameProcessing} from './game-processing';
import {AnyNotification} from './notification';
import {AnyCue} from './components';

export type GameProgressState = Readonly<{
  mode: 'not-started' | 'active' | 'paused' | 'finished';
}>;

export class GameProgressController {
  static start(state: GameProgressState): GameProgressState {
    if (state.mode !== 'not-started') {
      return state;
    }
    return Im.replace(state, 'mode', (): 'active' => 'active');
  }

  static pause(state: GameProgressState): GameProgressState {
    if (state.mode !== 'active') {
      return state;
    }
    return Im.replace(state, 'mode', (): 'paused' => 'paused');
  }

  static unpause(state: GameProgressState): GameProgressState {
    if (state.mode !== 'paused') {
      return state;
    }
    return Im.replace(state, 'mode', (): 'active' => 'active');
  }

  static finish(state: GameProgressState): GameProgressState {
    if (!(state.mode in ['not-started', 'finished'])) {
      return state;
    }
    return Im.replace(state, 'mode', (): 'finished' => 'finished');
  }

  static updateGame<Stg extends Setting>(
    state: GameState<Stg>,
    args: {
      progress: GameProgressState;
      input: CanvasInput<Stg>;
      cues: AnyCue<Stg>[];
      time: TimeInput<Stg>;
      renderingState: RenderingState;
      instances: GameInstances<Stg>;
    }
  ): {state: GameState<Stg>; notifications: AnyNotification<Stg>[]} {
    if (args.progress.mode !== 'active') {
      return {state, notifications: []};
    }
    return GameProcessing.update(state, args);
  }
}
