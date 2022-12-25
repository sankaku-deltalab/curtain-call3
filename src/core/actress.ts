import {Im, Res, Result} from '../utils';
import {Collision, Graphic} from './components';
import {
  ActressPartsTrait,
  AnyBodyState,
  AnyMindState,
  BodyId,
  BodyState,
  MindId,
  MindState,
} from './components/actress-parts';
import {AnyCue, CueTrait} from './components/cue';
import {GameState} from './game-state';
import {AnyNotification, NotificationTrait} from './notification';
import {BodyTypes, MindProps, MindTypes, Setting} from './setting';

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
    mindId: MindId,
    mind: AnyMindState<Stg>,
    bodies: Record<BodyId, AnyBodyState<Stg>>
  ): Result<AnyActressState<Stg>> {
    const body = bodies[mind.meta.bodyId];
    if (body === undefined) {
      return Res.err('body not found');
    }

    return Res.ok({
      mindId,
      mind: mind,
      body: body,
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

export type ActressProps<
  Stg extends Setting,
  MT extends MindTypes<Stg>
> = MindProps<Stg, MT>;

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

  createProps(
    act: ActressState<Stg, BT, MT>,
    args: {state: GameState<Stg>}
  ): ActressProps<Stg, MT>;

  update(
    act: ActressState<Stg, BT, MT>,
    props: ActressProps<Stg, MT>
  ): ActressState<Stg, BT, MT>;

  generateGraphics(
    act: ActressState<Stg, BT, MT>,
    props: ActressProps<Stg, MT>
  ): Graphic<Stg>[];

  generateCollision(
    act: ActressState<Stg, BT, MT>,
    props: ActressProps<Stg, MT>
  ): Collision;
}

export type AnyActressBehavior<Stg extends Setting> = ActressBehavior<
  Stg,
  BodyTypes<Stg>,
  MindTypes<Stg>
>;
