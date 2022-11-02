import {pipe} from 'rambda';
import {
  ActressTrait,
  AnyBodyState,
  AnyMindState,
  BodyId,
  BodyStateRaw,
  MindId,
  MindStateRaw,
} from './actress';
import {GameState} from './game-state';
import {AnyEvent, SceneTrait} from './scene';
import {BodyTypes, MindTypes, Setting} from './setting';
import {Im} from './utils/util';

export class GameHelper {
  static getMinds<Stg extends Setting>(
    state: GameState<Stg>
  ): Record<MindId, AnyMindState<Stg>> {
    return ActressTrait.getMinds(state.actresses);
  }

  static getBodies<Stg extends Setting>(
    state: GameState<Stg>
  ): Record<BodyId, AnyBodyState<Stg>> {
    return ActressTrait.getBodies(state.actresses);
  }

  static addActress<
    Stg extends Setting,
    BT extends BodyTypes<Stg>,
    MT extends MindTypes<Stg>
  >(
    state: GameState<Stg>,
    act: {
      bodyType: BT;
      mindType: MT;
      body: BodyStateRaw<Stg, BT>;
      mind: MindStateRaw<Stg, MT>;
    }
  ): {state: GameState<Stg>; bodyId: BodyId; mindId: MindId} {
    const originalSt = state;
    return pipe(
      () => state,
      st => ActressTrait.addActress(st.actresses, act),
      ({state: actSt, bodyId, mindId}) => ({
        state: Im.replace(originalSt, 'actresses', () => actSt),
        bodyId,
        mindId,
      })
    )();
  }

  static consumeAllEvents<Stg extends Setting>(
    state: GameState<Stg>
  ): {state: GameState<Stg>; events: AnyEvent<Stg>[]} {
    const originalSt = state;
    return pipe(
      () => state.scene,
      st => SceneTrait.consumeAllEvents(st),
      ({state: sceneSt, events}) => ({
        state: Im.replace(originalSt, 'scene', () => sceneSt),
        events,
      })
    )();
  }
}
