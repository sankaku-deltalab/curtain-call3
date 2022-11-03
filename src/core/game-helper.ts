import {pipe} from 'rambda';
import {
  ActressTrait,
  AnyBodyState,
  AnyMindState,
  BodyId,
  BodyState,
  BodyStateRaw,
  MindId,
  MindStateRaw,
} from './actress';
import {PointerInputTrait} from './components';
import {GameState} from './game-state';
import {AnyEvent, SceneTrait} from './scene';
import {BodyTypes, MindTypes, Setting} from './setting';
import {Res, Result} from './utils/result';
import {Im, Vec2d} from './utils/util';

export class GameHelper {
  static getMinds<Stg extends Setting>(
    state: GameState<Stg>
  ): Record<MindId, AnyMindState<Stg>> {
    return ActressTrait.getMinds(state.actresses);
  }

  static getBodies<Stg extends Setting>(
    state: GameState<Stg>
  ): Record<BodyId, AnyBodyState<Stg>> {
    return ActressTrait.getBodies(state.actresses);
  }

  static getBody<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: GameState<Stg>,
    bodyId: BodyId,
    bodyType: BT
  ): Result<BodyState<Stg, BT>> {
    const body = ActressTrait.getBodies(state.actresses)[bodyId];
    if (body === undefined) {
      return Res.err('not found');
    }
    if (body.meta.bodyType !== bodyType) {
      return Res.err('incorrect body type');
    }
    return Res.ok(body as BodyState<Stg, BT>);
  }

  static addActress<
    Stg extends Setting,
    BT extends BodyTypes<Stg>,
    MT extends MindTypes<Stg>
  >(
    state: GameState<Stg>,
    act: {
      bodyType: BT;
      mindType: MT;
      body: BodyStateRaw<Stg, BT>;
      mind: MindStateRaw<Stg, MT>;
    }
  ): {state: GameState<Stg>; bodyId: BodyId; mindId: MindId} {
    const originalSt = state;
    return pipe(
      () => state,
      st => ActressTrait.addActress(st.actresses, act),
      ({state: actSt, bodyId, mindId}) => ({
        state: Im.replace(originalSt, 'actresses', () => actSt),
        bodyId,
        mindId,
      })
    )();
  }

  static consumeAllEvents<Stg extends Setting>(
    state: GameState<Stg>
  ): {state: GameState<Stg>; events: AnyEvent<Stg>[]} {
    const originalSt = state;
    return pipe(
      () => state.scene,
      st => SceneTrait.consumeAllEvents(st),
      ({state: sceneSt, events}) => ({
        state: Im.replace(originalSt, 'scene', () => sceneSt),
        events,
      })
    )();
  }
}

export class InputHelper {
  static deltaWhileDown<Stg extends Setting>(state: GameState<Stg>): Vec2d {
    return PointerInputTrait.deltaWhileDown(state.input.pointer);
  }
}

export class GraphicHelper {
  static isCanvasSpriteGraphic<Stg extends Setting>(
    graphic: CanvasGraphic<Stg>
  ): graphic is CanvasSpriteGraphic {
    return graphic.type === 'canvas-sprite';
  }

  static isCanvasLineGraphic<Stg extends Setting>(
    graphic: CanvasGraphic<Stg>
  ): graphic is CanvasLineGraphic {
    return graphic.type === 'canvas-line';
  }
}