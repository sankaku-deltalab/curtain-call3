import {ActressPartsTrait, MindId} from './components/actress-parts';
import {ActressTrait, AnyActressBehavior, AnyActressState} from './actress';
import {DirectorTrait} from './director';
import {GameInstances, GameInstancesTrait} from './game-instances';
import {GameState} from './game-state';
import {Res} from '../utils/result';
import {Representation, Setting} from './setting';
import {AaRect2d} from '../utils/aa-rect2d';
import {
  CanvasGraphic,
  CanvasGraphicTrait,
  Graphic,
  GraphicTrait,
} from './components/graphics/graphic';
import {RenderingState} from './components/camera';

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

    const graphics = actresses
      .map<[string, Graphic<Stg>[]]>(([mindId, actSt, beh]) => {
        return [mindId, beh.generateGraphics(actSt, {gameState: state})];
      })
      .flatMap(([mindId, graphics]) =>
        GraphicTrait.appendKeys(mindId, graphics)
      );
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

  static getRepresentation<Stg extends Setting>(
    state: GameState<Stg>,
    args: {instances: GameInstances<Stg>}
  ): Representation<Stg> {
    return DirectorTrait.getRepresentation(state, args);
  }
}

const collectActInState = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): [MindId, AnyActressState<Stg>, AnyActressBehavior<Stg>][] => {
  const minds = ActressPartsTrait.getMinds(state.actressParts);
  const lis = Object.entries(minds).map(([mindId, mind]) => {
    const act = GameInstancesTrait.getActressBehavior(
      mind.meta.mindType,
      args.instances
    );
    if (act.err) {
      return act;
    }
    const actSt = ActressTrait.extractActressState(state, mindId);
    if (actSt.err) {
      return actSt;
    }

    return Res.ok<[MindId, AnyActressState<Stg>, AnyActressBehavior<Stg>]>([
      mindId,
      actSt.val,
      act.val,
    ]);
  });
  return Res.onlyOk(lis);
};
