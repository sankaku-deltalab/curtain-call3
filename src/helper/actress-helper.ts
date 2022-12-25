import {AnyActressState} from '../core';
import {
  ActressInitializer,
  ActressPartsTrait,
  AnyBodyState,
  BodyId,
  BodyState,
} from '../core/components/actress-parts';
import {
  BodyStateRaw,
  BodyTypes,
  CuePayload,
  CueTypes,
  MindStateRaw,
  MindTypes,
  NotificationPayload,
  NotificationTypes,
  Setting,
} from '../core/setting';
import {Im, ImListTrait} from '../utils';

export class ActressHelper {
  static createActressInitializer<
    Stg extends Setting,
    BT extends BodyTypes<Stg>,
    MT extends MindTypes<Stg>
  >(args: {
    bodyType: BT;
    mindType: MT;
    body: BodyStateRaw<Stg, BT>;
    mind: MindStateRaw<Stg, MT>;
  }): ActressInitializer<Stg, BT, MT> {
    return args;
  }

  static bodyIsInType<Stg extends Setting, BT extends BodyTypes<Stg>>(
    body: AnyBodyState<Stg>,
    bodyType: BT
  ): body is BodyState<Stg, BT> {
    return ActressPartsTrait.bodyIsInType(body, bodyType);
  }

  static idAndBodyIsInType<Stg extends Setting, BT extends BodyTypes<Stg>>(
    body: [BodyId, AnyBodyState<Stg>],
    bodyType: BT
  ): body is [BodyId, BodyState<Stg, BT>] {
    return ActressPartsTrait.bodyIsInType(body[1], bodyType);
  }

  static addCue<
    Stg extends Setting,
    Act extends AnyActressState<Stg>,
    CT extends CueTypes<Stg>
  >(act: Act, type: CT, payload: CuePayload<Stg, CT>): Act {
    const cue = {type, payload};
    return Im.update(act, 'cues', c => ImListTrait.push(c, cue));
  }

  static addNotification<
    Stg extends Setting,
    Act extends AnyActressState<Stg>,
    NT extends NotificationTypes<Stg>
  >(act: Act, type: NT, payload: NotificationPayload<Stg, NT>): Act {
    const notification = {type, payload};
    return Im.update(act, 'notifications', n =>
      ImListTrait.push(n, notification)
    );
  }

  static delActress<Stg extends Setting, Act extends AnyActressState<Stg>>(
    act: Act
  ): Act {
    return Im.update_in3(act, ['body', 'meta', 'del'], () => true);
  }
}
