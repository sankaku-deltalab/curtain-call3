import {ImMap, Result} from '../../../utils';
import {
  AnyTypeBody,
  Body,
  BodyId,
  BodyType,
  BodyWithoutId,
  DataDefinition,
} from '../../setting/data-definition';

export type BodiesState<Def extends DataDefinition> = {
  bodyIdCount: number;
  bodies: {[BT in BodyType<Def>]?: ImMap<string, Body<Def, BT>>};
};

export class TBodiesState {
  static new<Def extends DataDefinition>(): BodiesState<Def> {
    return {bodyIdCount: 0, bodies: {}};
  }

  static fetch<Def extends DataDefinition, BT extends BodyType<Def>>(
    _bodies: BodiesState<Def>,
    _bodyId: BodyId<Def, BT>
  ): Result<Body<Def, BT>> {
    // TODO:
    throw new Error('not implemented');
  }

  static addBodyB<Def extends DataDefinition, BT extends BodyType<Def>>(
    _bodies: BodiesState<Def>,
    _body: BodyWithoutId<Def, BT>
  ): {state: BodiesState<Def>; body: Body<Def, BT>} {
    // TODO:
    throw new Error('not implemented');
  }

  static bodiesInType<Def extends DataDefinition, BT extends BodyType<Def>>(
    _bodies: BodiesState<Def>,
    _bodyType: BT
  ): Body<Def, BT>[] {
    // TODO:
    throw new Error('not implemented');
  }

  static getAllBodies<Def extends DataDefinition>(
    _bodiesState: BodiesState<Def>
  ): AnyTypeBody<Def>[] {
    // TODO:
    throw new Error('not implemented');
  }

  static replaceAllBodies<Def extends DataDefinition>(
    _bodiesState: BodiesState<Def>,
    _newBodies: AnyTypeBody<Def>[]
  ): BodiesState<Def> {
    // TODO:
    throw new Error('not implemented');
  }
}
