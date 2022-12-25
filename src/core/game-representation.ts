import {MindId} from './components/actress-parts';
import {AnyActressBehavior, AnyActressState} from './actress';
import {GameInstances} from './game-instances';
import {GameState} from './game-state';
import {Setting} from './setting';
import {AaRect2d} from '../utils/aa-rect2d';
import {
  CanvasGraphic,
  CanvasGraphicTrait,
  Graphic,
  GraphicTrait,
} from './components/graphics/graphic';
import {RenderingState} from './components/camera';
import {GameProcessing} from './game-processing';

export class GameRepresentation {
  static generateGraphics<Stg extends Setting>(
    state: GameState<Stg>,
    args: {
      renderingState: RenderingState;
      instances: GameInstances<Stg>;
    }
  ): CanvasGraphic<Stg>[] {
    const instances = args.instances;
    const actresses = collectActInState(state, {instances});

    const graphics: Graphic<Stg>[] = [];
    for (const [mindId, actSt, beh] of actresses) {
      const props = beh.createProps(actSt, {state});
      const gs = beh.generateGraphics(actSt, props);
      for (const g of gs) {
        graphics.push(GraphicTrait.appendKey(mindId, g));
      }
    }

    return CanvasGraphicTrait.convertGraphicsToCanvas(graphics, {
      camSt: state.camera,
      renSt: args.renderingState,
    });
  }

  static getRenderingArea<Stg extends Setting>(
    state: GameState<Stg>,
    args: {
      renSt: RenderingState;
    }
  ): AaRect2d {
    return CanvasGraphicTrait.getRenderingArea({
      camSt: state.camera,
      renSt: args.renSt,
    });
  }
}

const collectActInState = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): [MindId, AnyActressState<Stg>, AnyActressBehavior<Stg>][] => {
  const acts = GameProcessing.collectActInState(state, args);
  return acts.map(a => [a.mindId, a.state, a.beh]);
};
