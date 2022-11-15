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
import {
  CanvasGraphic,
  CanvasLineGraphic,
  CanvasSpriteGraphic,
  Overlaps,
  PointerInputTrait,
} from './components';
import {GameState} from './game-state';
import {AnyEvent, SceneTrait} from './scene';
import {
  BodyTypes,
  EventPayload,
  EventTypes,
  LevelState,
  MindTypes,
  NotificationPayload,
  NotificationTypes,
  Setting,
} from './setting';
import {Res, Result} from './utils/result';
import {Im, RecM2MTrait, Vec2d} from './utils/util';

export type ActressInitializer<
  Stg extends Setting,
  BT extends BodyTypes<Stg>,
  MT extends MindTypes<Stg>
> = {
  bodyType: BT;
  mindType: MT;
  body: BodyStateRaw<Stg, BT>;
  mind: MindStateRaw<Stg, MT>;
};

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

  static bodyIs<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: GameState<Stg>,
    bodyId: BodyId,
    bodyType: BT
  ): boolean {
    const body = this.getBody(state, bodyId, bodyType);
    return Res.isOk(body);
  }

  static filterOverlaps<Stg extends Setting>(
    overlaps: Overlaps,
    args: {
      state: GameState<Stg>;
      from: BodyTypes<Stg>;
      to: BodyTypes<Stg>;
    }
  ): Overlaps {
    const st = args.state;
    return RecM2MTrait.filter(
      overlaps,
      (from, to) =>
        GameHelper.bodyIs(st, from, args.from) &&
        GameHelper.bodyIs(st, to, args.to)
    );
  }

  static addActress<
    Stg extends Setting,
    BT extends BodyTypes<Stg>,
    MT extends MindTypes<Stg>
  >(
    state: GameState<Stg>,
    act: ActressInitializer<Stg, BT, MT>
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

  static addEvent<Stg extends Setting, EvType extends EventTypes<Stg>>(
    state: GameState<Stg>,
    type: EvType,
    payload: EventPayload<Stg, EvType>
  ): GameState<Stg> {
    const originalSt = state;
    return pipe(
      () => state.scene,
      st => SceneTrait.mergeEvents(st, [{type, payload}]),
      scSt => Im.replace(originalSt, 'scene', () => scSt)
    )();
  }

  static addNotification<
    Stg extends Setting,
    NoType extends NotificationTypes<Stg>
  >(
    state: GameState<Stg>,
    type: NoType,
    payload: NotificationPayload<Stg, NoType>
  ): GameState<Stg> {
    const originalSt = state;
    return pipe(
      () => state.scene,
      st => SceneTrait.mergeNotifications(st, [{type, payload}]),
      scSt => Im.replace(originalSt, 'scene', () => scSt)
    )();
  }

  static getLevel<Stg extends Setting>(state: GameState<Stg>): LevelState<Stg> {
    return SceneTrait.getLevel(state.scene);
  }

  static updateLevel<Stg extends Setting>(
    state: GameState<Stg>,
    updater: (level: LevelState<Stg>) => LevelState<Stg>
  ): GameState<Stg> {
    return Im.replace(state, 'scene', scSt =>
      SceneTrait.updateLevel(scSt, updater)
    );
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
