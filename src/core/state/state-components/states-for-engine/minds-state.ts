import {
  AnyTypeBody,
  BodyType,
  DataDefinition,
} from '../../../setting/data-definition';
import {AnyTypeMind, Mind} from '../../../user-defined-processors/mind';
import {GameState} from '../../game-states';
import {TBodiesState} from '../bodies-state';

export type MindsState<Def extends DataDefinition> = {
  minds: {[BT in BodyType<Def>]: Mind<Def, BT>};
};

export class TMindsState {
  static new<Def extends DataDefinition>(minds: {
    [BT in BodyType<Def>]: Mind<Def, BT>;
  }): MindsState<Def> {
    return {minds};
  }

  static calcBodyPropsMindArray<Def extends DataDefinition>(
    {minds}: MindsState<Def>,
    state: GameState<Def>
  ): {body: AnyTypeBody<Def>; props: unknown; mind: AnyTypeMind<Def>}[] {
    const bodies = TBodiesState.getAllBodies(state.bodies);
    return bodies.map(body => {
      const mind = minds[body.id[0]];
      const props = mind.calcProps(state, body);
      return {body, props, mind};
    });
  }

  static updateGameStateByMinds<Def extends DataDefinition>(
    {minds}: MindsState<Def>,
    state: GameState<Def>
  ): GameState<Def> {
    const bodyPropsMindArray = this.calcBodyPropsMindArray({minds}, state);

    // Use multi-processing in future if we can
    const newBodies = bodyPropsMindArray.map(({body, props, mind}) => {
      return mind.updateBody(body, props);
    });

    return {
      ...state,
      bodies: TBodiesState.replaceAllBodies(state.bodies, newBodies),
    };
  }
}
