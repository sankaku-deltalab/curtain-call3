import {
  ActressInitializer,
  ActressTrait,
  AnyBodyState,
  AnyMindState,
  BodyId,
  BodyState,
  MindId,
} from '../core/actress';
import {Overlaps} from '../core/components';
import {EventTrait} from '../core/event';
import {GameState} from '../core/game-state';
import {NotificationTrait} from '../core/notification';
import {SceneTrait} from '../core/scene';
import {
  BodyTypes,
  EventPayload,
  EventTypes,
  LevelState,
  MindTypes,
  NotificationPayload,
  NotificationTypes,
  Setting,
} from '../core/setting';
import {Res, Result} from '../utils/result';
import {Enum, Im, RecM2MTrait} from '../utils/util';

export class GameStateHelper {
  static getMinds<Stg extends Setting>(
    state: GameState<Stg>
  ): Record<MindId, AnyMindState<Stg>> {
    return ActressTrait.getMinds(state.actresses);
  }

  static getBodiesOf<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: GameState<Stg>,
    bodyType: BT
  ): Record<BodyId, BodyState<Stg, BT>> {
    const idAndBodyIsInType = (
      body: [BodyId, AnyBodyState<Stg>]
    ): body is [BodyId, BodyState<Stg, BT>] => {
      return ActressTrait.bodyIsInType(body[1], bodyType);
    };

    return Im.pipe(
      () => ActressTrait.getBodies(state.actresses),
      bodies => Object.entries(bodies),
      bodies => bodies.filter(idAndBodyIsInType),
      bodies => Object.fromEntries(bodies),
      v => v
    )();
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
        GameStateHelper.bodyIs(st, from, args.from) &&
        GameStateHelper.bodyIs(st, to, args.to)
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
    return Im.pipe(
      () => state,
      st => ActressTrait.addActress(st.actresses, act),
      ({state: actSt, bodyId, mindId}) => ({
        state: Im.replace(originalSt, 'actresses', () => actSt),
        bodyId,
        mindId,
      })
    )();
  }

  static addActresses<
    Stg extends Setting,
    BT extends BodyTypes<Stg>,
    MT extends MindTypes<Stg>
  >(
    state: GameState<Stg>,
    acts: ActressInitializer<Stg, BT, MT>[]
  ): {state: GameState<Stg>; ids: {bodyId: BodyId; mindId: MindId}[]} {
    const originalSt = state;
    return Im.pipe(
      () => state,
      st => ActressTrait.addActresses(st.actresses, acts),
      ({state: actSt, ids}) => ({
        state: Im.replace(originalSt, 'actresses', () => actSt),
        ids,
      })
    )();
  }

  static replaceBody<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: GameState<Stg>,
    args: {
      bodyId: BodyId;
      body: BodyState<Stg, BT>;
    }
  ): GameState<Stg> {
    return Im.replace(state, 'actresses', act => {
      return ActressTrait.updateBody(
        act,
        args.bodyId,
        args.body.meta.bodyType,
        () => args.body
      );
    });
  }

  static replaceBodies<Stg extends Setting>(
    state: GameState<Stg>,
    bodies: Record<BodyId, AnyBodyState<Stg>>
  ): GameState<Stg> {
    return Im.replace(state, 'actresses', act => {
      return ActressTrait.replaceBodies(act, bodies);
    });
  }

  static updateBody<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: GameState<Stg>,
    bodyId: BodyId,
    bodyType: BT,
    updater: (
      body: BodyState<Stg, BT>,
      args: {bodyId: BodyId}
    ) => BodyState<Stg, BT> | undefined
  ): GameState<Stg> {
    return Im.replace(state, 'actresses', act => {
      return ActressTrait.updateBody(act, bodyId, bodyType, updater);
    });
  }

  static updateBodies<Stg extends Setting>(
    state: GameState<Stg>,
    updater: (
      body: AnyBodyState<Stg>,
      args: {bodyId: BodyId}
    ) => AnyBodyState<Stg> | undefined
  ): GameState<Stg> {
    const bodies = Object.entries(this.getBodies(state));
    return Enum.reduce(bodies, state, ([bodyId, body], st: GameState<Stg>) =>
      this.updateBody(st, bodyId, body.meta.bodyType, updater)
    );
  }

  static addEvent<Stg extends Setting, EvType extends EventTypes<Stg>>(
    state: GameState<Stg>,
    type: EvType,
    payload: EventPayload<Stg, EvType>
  ): GameState<Stg> {
    const originalSt = state;
    return Im.pipe(
      () => state.event,
      st => EventTrait.mergeEvents(st, [{type, payload}]),
      evSt => Im.replace(originalSt, 'event', () => evSt)
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
    return Im.pipe(
      () => state.notification,
      st => NotificationTrait.mergeNotifications(st, [{type, payload}]),
      noSt => Im.replace(originalSt, 'notification', () => noSt)
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
}
