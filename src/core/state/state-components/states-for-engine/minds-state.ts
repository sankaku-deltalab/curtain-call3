import {
  AnyTypeBody,
  BodyType,
  DataDefinition,
} from '../../../setting/data-definition';
import {
  AnyTypeMind,
  Mind,
  MindArgs,
} from '../../../user-defined-processors/mind';
import {GameState} from '../../game-states';
import {TBodiesState} from '../bodies-state';
import {THitStopsState} from '../hit-stop-state';

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
  ): {
    body: AnyTypeBody<Def>;
    props: unknown;
    args: MindArgs;
    mind: AnyTypeMind<Def>;
  }[] {
    const bodies = TBodiesState.getAllBodies(state.bodies);
    return bodies.map(body => {
      const mind = minds[body.bodyType];
      const props = mind.calcProps(state, body);
      const timeScale = THitStopsState.getBodyTimeScale(
        state.hitStops,
        body.id
      );
      const args: MindArgs = {
        deltaMs: state.time.gameTimeMs * timeScale,
        engineDeltaMs: state.time.gameTimeMs,
      };
      return {body, props, args, mind};
    });
  }

  static updateGameStateByMindUpdate<Def extends DataDefinition>(
    {minds}: MindsState<Def>,
    state: GameState<Def>
  ): GameState<Def> {
    const bodyPropsMindArray = this.calcBodyPropsMindArray({minds}, state);

    // Use multi-processing in future if we can
    const newBodies = bodyPropsMindArray.map(({body, props, args, mind}) => {
      return mind.updateBody(body, args, props);
    });

    return {
      ...state,
      bodies: TBodiesState.resetAllBodies(state.bodies, newBodies),
    };
  }

  static updateGameStateByMindDelete<Def extends DataDefinition>(
    {minds}: MindsState<Def>,
    state: GameState<Def>
  ): GameState<Def> {
    const bodyPropsMindArray = this.calcBodyPropsMindArray({minds}, state);

    // Use multi-processing in future if we can
    const newBodies = bodyPropsMindArray
      .filter(({body, props, mind}) => {
        return !mind.mustDeleteSelf(body, props);
      })
      .map(({body}) => body);

    return {
      ...state,
      bodies: TBodiesState.resetAllBodies(state.bodies, newBodies),
    };
  }
}
