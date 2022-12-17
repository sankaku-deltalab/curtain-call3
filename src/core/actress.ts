import {Im, Res, Result} from '../utils';
import {Collision, Graphic} from './components';
import {
  ActressPartsTrait,
  AnyMindState,
  BodyState,
  MindId,
  MindState,
} from './components/actress-parts';
import {AnyCue, CueTrait} from './components/cue';
import {GameState, GameStateTrait} from './game-state';
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
  cues: AnyCue<Stg>[];
  notifications: AnyNotification<Stg>[];
}>;

export type AnyActressState<Stg extends Setting> = ActressState<
  Stg,
  BodyTypes<Stg>,
  MindTypes<Stg>
>;

export class ActressTrait {
  static extractActressState<Stg extends Setting>(
    state: GameState<Stg>,
    mindId: MindId
  ): Result<AnyActressState<Stg>> {
    const mind = GameStateTrait.extractMind(mindId, state);
    if (Res.isErr(mind)) {
      return mind;
    }

    const body = GameStateTrait.extractBody(mind.val.meta.bodyId, state);
    if (Res.isErr(body)) {
      return body;
    }

    return Res.ok({
      mindId,
      mind: mind.val,
      body: body.val,
      cues: [],
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
    const newCues = actSts.flatMap(([_, s]) => s.cues);
    const newNotifications = actSts.flatMap(([_, s]) => s.notifications);

    return Im.pipe(
      () => state,
      st => Im.update(st, 'cue', s => CueTrait.mergeCues(s, newCues)),
      st =>
        Im.update(st, 'notification', s =>
          NotificationTrait.mergeNotifications(s, newNotifications)
        ),
      st =>
        Im.update(st, 'actressParts', s =>
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
    act: ActressState<Stg, BT, MT>,
    args: {
      state: GameState<Stg>;
    }
  ): ActressState<Stg, BT, MT>;

  update(
    act: ActressState<Stg, BT, MT>,
    args: {state: GameState<Stg>}
  ): ActressState<Stg, BT, MT>;

  generateGraphics(
    act: ActressState<Stg, BT, MT>,
    args: {state: GameState<Stg>}
  ): Graphic<Stg>[];

  generateCollision(
    act: ActressState<Stg, BT, MT>,
    args: {state: GameState<Stg>}
  ): Collision;
}

export type AnyActressBehavior<Stg extends Setting> = ActressBehavior<
  Stg,
  BodyTypes<Stg>,
  MindTypes<Stg>
>;
