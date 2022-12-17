import {AnyActressState} from '../core';
import {
  ActressInitializer,
  ActressPartsTrait,
  AnyBodyState,
  BodyId,
  BodyState,
  BodyStateRaw,
  MindStateRaw,
} from '../core/components/actress-parts';
import {BodyTypes, MindTypes, Setting} from '../core/setting';
import {Im} from '../utils';

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

  static delActress<Stg extends Setting, Act extends AnyActressState<Stg>>(
    act: Act
  ): Act {
    return Im.update_in3(act, ['body', 'meta', 'del'], () => true);
  }
}
