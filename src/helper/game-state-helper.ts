import {
  ActressInitializer,
  ActressPartsTrait,
  AnyBodyState,
  AnyMindState,
  BodyId,
  BodyState,
  MindId,
} from '../core/components/actress-parts';
import {Overlaps} from '../core/components';
import {CueTrait} from '../core/components/cue';
import {GameState} from '../core/game-state';
import {NotificationTrait} from '../core/notification';
import {SceneTrait} from '../core/scene';
import {
  BodyTypes,
  CuePayload,
  CueTypes,
  LevelState,
  MindTypes,
  NotificationPayload,
  NotificationTypes,
  Setting,
} from '../core/setting';
import {Res, Result} from '../utils/result';
import {Im} from '../utils/immutable-manipulation';
import {Enum} from '../utils/enum';
import {RecM2MTrait} from '../utils/rec-m2m';

export class GameStateHelper {
  static getMinds<Stg extends Setting>(
    state: GameState<Stg>
  ): [MindId, AnyMindState<Stg>][] {
    return ActressPartsTrait.getMinds(state.actressParts);
  }

  static getBodiesOf<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: GameState<Stg>,
    bodyType: BT
  ): [BodyId, BodyState<Stg, BT>][] {
    const idAndBodyIsInType = (
      body: [BodyId, AnyBodyState<Stg>]
    ): body is [BodyId, BodyState<Stg, BT>] => {
      return ActressPartsTrait.bodyIsInType(body[1], bodyType);
    };

    return Im.pipe(
      () => ActressPartsTrait.getBodies(state.actressParts),
      bodies => bodies.filter(idAndBodyIsInType)
    )();
  }

  static getBodies<Stg extends Setting>(
    state: GameState<Stg>
  ): [BodyId, AnyBodyState<Stg>][] {
    return ActressPartsTrait.getBodies(state.actressParts);
  }

  static getBody<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: GameState<Stg>,
    bodyId: BodyId,
    bodyType: BT
  ): Result<BodyState<Stg, BT>> {
    const body = ActressPartsTrait.getBody(state.actressParts, bodyId);
    if (body.err) return body;

    if (body.val.meta.bodyType !== bodyType) {
      return Res.err('incorrect body type');
    }
    return Res.ok(body.val as BodyState<Stg, BT>);
  }

  static getFirstBody<Stg extends Setting, BT extends BodyTypes<Stg>>(
    state: GameState<Stg>,
    bodyType: BT
  ): Result<BodyState<Stg, BT>> {
    return ActressPartsTrait.getFirstBody(state.actressParts, bodyType);
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
      st => ActressPartsTrait.addActress(st.actressParts, act),
      ({state: actSt, bodyId, mindId}) => ({
        state: Im.update(originalSt, 'actressParts', () => actSt),
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
      st => ActressPartsTrait.addActresses(st.actressParts, acts),
      ({state: actSt, ids}) => ({
        state: Im.update(originalSt, 'actressParts', () => actSt),
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
    return Im.update(state, 'actressParts', act => {
      return ActressPartsTrait.updateBody(
        act,
        args.bodyId,
        args.body.meta.bodyType,
        () => args.body
      );
    });
  }

  static replaceBodies<Stg extends Setting>(
    state: GameState<Stg>,
    bodies: [BodyId, AnyBodyState<Stg>][]
  ): GameState<Stg> {
    return Im.update(state, 'actressParts', act => {
      return ActressPartsTrait.replaceBodies(act, bodies);
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
    return Im.update(state, 'actressParts', act => {
      return ActressPartsTrait.updateBody(act, bodyId, bodyType, updater);
    });
  }

  static updateBodies<Stg extends Setting>(
    state: GameState<Stg>,
    updater: (
      body: AnyBodyState<Stg>,
      args: {bodyId: BodyId}
    ) => AnyBodyState<Stg> | undefined
  ): GameState<Stg> {
    const bodies = ActressPartsTrait.getBodies(state.actressParts);
    return Enum.reduce(bodies, state, ([bodyId, body], st: GameState<Stg>) =>
      this.updateBody(st, bodyId, body.meta.bodyType, updater)
    );
  }

  static addCue<Stg extends Setting, CueType extends CueTypes<Stg>>(
    state: GameState<Stg>,
    type: CueType,
    payload: CuePayload<Stg, CueType>
  ): GameState<Stg> {
    const originalSt = state;
    return Im.pipe(
      () => state.cue,
      st => CueTrait.mergeCues(st, [{type, payload}]),
      cueSt => Im.update(originalSt, 'cue', () => cueSt)
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
      noSt => Im.update(originalSt, 'notification', () => noSt)
    )();
  }

  static getLevel<Stg extends Setting>(state: GameState<Stg>): LevelState<Stg> {
    return SceneTrait.getLevel(state.scene);
  }

  static updateLevel<Stg extends Setting>(
    state: GameState<Stg>,
    updater: (level: LevelState<Stg>) => LevelState<Stg>
  ): GameState<Stg> {
    return Im.update(state, 'scene', scSt =>
      SceneTrait.updateLevel(scSt, updater)
    );
  }
}
