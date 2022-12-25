import {ImList, ImListTrait} from 'src/utils/im-list';
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
  cues: ImList<AnyCue<Stg>>;
  notifications: ImList<AnyNotification<Stg>>;
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
    bodies: ReadonlyMap<BodyId, AnyBodyState<Stg>>
  ): Result<AnyActressState<Stg>> {
    const body = bodies.get(mind.meta.bodyId);
    if (body === undefined) {
      return Res.err('body not found');
    }

    return Res.ok({
      mindId,
      mind: mind,
      body: body,
      cues: ImListTrait.new(),
      notifications: ImListTrait.new(),
    });
  }

  static mergeActressStates<Stg extends Setting>(
    state: GameState<Stg>,
    actSts: AnyActressState<Stg>[]
  ): GameState<Stg> {
    const {minds, bodies, cues, notifications} =
      ActressTrait.extractItemsFromActressStates(actSts);

    return Im.pipe(
      () => state,
      st => Im.update(st, 'cue', s => CueTrait.mergeCues(s, cues)),
      st =>
        Im.update(st, 'notification', s =>
          NotificationTrait.mergeNotifications(s, notifications)
        ),
      st =>
        Im.update(st, 'actressParts', s =>
          ActressPartsTrait.resetMindsAndBodies(s, {minds, bodies})
        )
    )();
  }

  static extractItemsFromActressStates<Stg extends Setting>(
    actSts: AnyActressState<Stg>[]
  ): {
    minds: [MindId, AnyMindState<Stg>][];
    bodies: [BodyId, AnyBodyState<Stg>][];
    cues: ImList<AnyCue<Stg>>;
    notifications: ImList<AnyNotification<Stg>>;
  } {
    const minds: [MindId, AnyMindState<Stg>][] = [];
    const bodies: [BodyId, AnyBodyState<Stg>][] = [];
    let cues: ImList<AnyCue<Stg>> = ImListTrait.new();
    let notifications: ImList<AnyNotification<Stg>> = ImListTrait.new();

    for (const act of actSts) {
      minds.push([act.mindId, act.mind]);
      bodies.push([act.mind.meta.bodyId, act.body]);
      cues = ImListTrait.concat(act.cues, cues);
      notifications = ImListTrait.concat(act.notifications, notifications);
    }
    return {minds, bodies, cues, notifications};
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
