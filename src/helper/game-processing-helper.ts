import {CanvasGraphic, RenderingState} from '../core/components';
import {GameRepresentation} from '../core/game-representation';
import {GameState, StateInitializer} from '../core/game-state';
import {AnyNotification} from '../core/notification';
import {Setting} from '../core/setting';
import {GameInstances, GameProcessing, UpdateArgs} from '../core';
import {AaRect2d} from '../utils';

export class GameProcessingHelper {
  static createInitialState<Stg extends Setting>(
    args: StateInitializer<Stg>
  ): GameState<Stg> {
    return GameProcessing.createInitialState(args);
  }

  static update<Stg extends Setting>(
    state: GameState<Stg>,
    args: UpdateArgs<Stg>
  ): {state: GameState<Stg>; notifications: AnyNotification<Stg>[]} {
    return GameProcessing.update(state, args);
  }

  static generateGraphics<Stg extends Setting>(
    state: GameState<Stg>,
    args: {
      renderingState: RenderingState;
      instances: GameInstances<Stg>;
    }
  ): CanvasGraphic<Stg>[] {
    return GameRepresentation.generateGraphics(state, args);
  }

  static getRenderingArea<Stg extends Setting>(
    state: GameState<Stg>,
    args: {
      renSt: RenderingState;
    }
  ): AaRect2d {
    return GameRepresentation.getRenderingArea(state, args);
  }
}
