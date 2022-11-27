import {ActressTrait, AnyBodyState, BodyId, BodyState} from '../core/actress';
import {BodyTypes, Setting} from '../core/setting';

export class ActressHelper {
  static bodyIsInType<Stg extends Setting, BT extends BodyTypes<Stg>>(
    body: AnyBodyState<Stg>,
    bodyType: BT
  ): body is BodyState<Stg, BT> {
    return ActressTrait.bodyIsInType(body, bodyType);
  }

  static idAndBodyIsInType<Stg extends Setting, BT extends BodyTypes<Stg>>(
    body: [BodyId, AnyBodyState<Stg>],
    bodyType: BT
  ): body is [BodyId, BodyState<Stg, BT>] {
    return ActressTrait.bodyIsInType(body[1], bodyType);
  }
}
