import {Im, Res, Result} from '../utils';
import {Collision, Graphic} from './components';
import {
  ActressPartsTrait,
  AnyMindState,
  BodyState,
  MindId,
  MindState,
} from './components/actress-parts';
import {AnyEvent, EventTrait} from './components/event';
import {GameState, GameStateTrait, VisibleGameState} from './game-state';
import {AnyNotification, NotificationTrait} from './notification';
import {BodyTypes, MindTypes, Setting} from './setting';

export type ActressState<
  Stg extends Setting,
  BT extends BodyTypes<Stg>,
  MT extends MindTypes<Stg>
> = Readonly<{
  mindId: MindId;
  body: BodyState<Stg, BT>;
  mind: MindState<Stg, MT>;
  ev: AnyEvent<Stg>[];
  notifications: AnyNotification<Stg>[];
}>;

export type AnyActressState<Stg extends Setting> = ActressState<
  Stg,
  BodyTypes<Stg>,
  MindTypes<Stg>
>;

export class ActressTrait {
  static extractActressState<Stg extends Setting>(
    st: GameState<Stg>,
    mindId: MindId
  ): Result<AnyActressState<Stg>> {
    const mind = GameStateTrait.extractMind(mindId, st);
    if (Res.isErr(mind)) {
      return mind;
    }

    const body = GameStateTrait.extractBody(mind.val.meta.bodyId, st);
    if (Res.isErr(body)) {
      return body;
    }

    return Res.ok({
      mindId,
      mind: mind.val,
      body: body.val,
      ev: [],
      notifications: [],
    });
  }

  static mergeActressStates<Stg extends Setting>(
    state: GameState<Stg>,
    actSts: [MindId, AnyActressState<Stg>][]
  ): GameState<Stg> {
    const minds: Record<MindId, AnyMindState<Stg>> = Object.fromEntries(
      actSts.map(([mid, s]) => [mid, s.mind])
    );
    const bodies = Object.fromEntries(
      actSts.map(([_, s]) => [s.mind.meta.bodyId, s.body])
    );
    const newEvents = actSts.flatMap(([_, s]) => s.ev);
    const newNotifications = actSts.flatMap(([_, s]) => s.notifications);

    return Im.pipe(
      () => state,
      st => Im.replace(st, 'event', s => EventTrait.mergeEvents(s, newEvents)),
      st =>
        Im.replace(st, 'notification', s =>
          NotificationTrait.mergeNotifications(s, newNotifications)
        ),
      st =>
        Im.replace(st, 'actressParts', s =>
          ActressPartsTrait.mergeMindsAndBodies(s, {minds, bodies})
        )
    )();
  }
}

export interface ActressBehavior<
  Stg extends Setting,
  BT extends BodyTypes<Stg>,
  MT extends MindTypes<Stg>
> {
  readonly bodyType: BT;
  readonly mindType: MT;

  applyInput(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): ActressState<Stg, BT, MT>;

  update(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): ActressState<Stg, BT, MT>;

  generateGraphics(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): Graphic<Stg>[];

  generateCollision(
    st: ActressState<Stg, BT, MT>,
    args: {
      gameState: VisibleGameState<Stg>;
    }
  ): Collision;
}

export type AnyActressBehavior<Stg extends Setting> = ActressBehavior<
  Stg,
  BodyTypes<Stg>,
  MindTypes<Stg>
>;
