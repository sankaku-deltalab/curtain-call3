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
  static start(progress: GameProgressState): GameProgressState {
    if (progress.mode !== 'not-started') {
      return progress;
    }
    return Im.replace(progress, 'mode', (): 'active' => 'active');
  }

  static pause(progress: GameProgressState): GameProgressState {
    if (progress.mode !== 'active') {
      return progress;
    }
    return Im.replace(progress, 'mode', (): 'paused' => 'paused');
  }

  static unpause(progress: GameProgressState): GameProgressState {
    if (progress.mode !== 'paused') {
      return progress;
    }
    return Im.replace(progress, 'mode', (): 'active' => 'active');
  }

  static finish(progress: GameProgressState): GameProgressState {
    if (!(progress.mode in ['not-started', 'finished'])) {
      return progress;
    }
    return Im.replace(progress, 'mode', (): 'finished' => 'finished');
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
