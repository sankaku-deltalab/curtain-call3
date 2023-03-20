import {AaRect2d, Im} from '../../utils';
import {
  Collision,
  FlattenCollision,
  TCollision,
} from '../components/collision/collision';
import {CanvasGraphic, Graphic, TGraphic} from '../components/graphics/graphic';
import {
  AnyTypeBodyId,
  AnyTypeNotification,
  DataDefinition,
} from '../setting/data-definition';
import {GameState} from './game-states';
import {SerializableState} from './serializable-state';
import {
  CanvasRenderingState,
  TCameraState,
} from './state-components/camera-state';
import {TCollisionState} from './state-components/collision-state';
import {TInputPointerState} from './state-components/input-pointer-state';
import {DirectorState} from './state-components/states-for-engine/director-state';
import {
  InputCanvasPointerState,
  TInputCanvasPointerState,
} from './state-components/states-for-engine/input-canvas-pointer-state';
import {
  MindsState,
  TMindsState,
} from './state-components/states-for-engine/minds-state';
import {TProceduresState} from './state-components/states-for-engine/procedures-state';
import {ProceduresState} from './state-components/states-for-engine/procedures-state';
import {RealWorldTimeState} from './state-components/states-for-engine/real-world-time-state';
import {TTimeState} from './state-components/time-state';

/**
 * AllState is
 * - Not serializable.
 * - Used in engine-side processing.
 */
export type AllState<Def extends DataDefinition> = GameState<Def> & {
  minds: MindsState<Def>;
  procedures: ProceduresState<Def>;
  director: DirectorState<Def>;
  inputCanvasPointer: InputCanvasPointerState;
  rendering: CanvasRenderingState;
  realWorldTime: RealWorldTimeState;
};

export class TAllState {
  static extractGameState<Def extends DataDefinition>(
    state: AllState<Def>
  ): GameState<Def> {
    return {
      level: state.level,
      bodies: state.bodies,
      camera: state.camera,
      collision: state.collision,
      dataSources: state.dataSources,
      dynamicSources: state.dynamicSources,
      time: state.time,
      inputPointer: state.inputPointer,
    };
  }

  static mergeGameState<Def extends DataDefinition>(
    state: AllState<Def>,
    gameState: GameState<Def>
  ): AllState<Def> {
    return {
      ...state,
      level: gameState.level,
      bodies: gameState.bodies,
      camera: gameState.camera,
      collision: gameState.collision,
      dataSources: gameState.dataSources,
      dynamicSources: gameState.dynamicSources,
      time: gameState.time,
      inputPointer: gameState.inputPointer,
    };
  }

  static extractSerializableState<Def extends DataDefinition>(
    state: AllState<Def>
  ): SerializableState<Def> {
    return {
      level: state.level,
      bodies: state.bodies,
      camera: state.camera,
      collision: state.collision,
      dataSources: state.dataSources,
      time: state.time,
      inputPointer: state.inputPointer,
    };
  }

  private static updateAsGameState<Def extends DataDefinition>(
    state: AllState<Def>,
    updater: (
      gameState: GameState<Def>,
      allState: AllState<Def>
    ) => GameState<Def>
  ): AllState<Def> {
    const newGameState = updater(this.extractGameState(state), state);
    return this.mergeGameState(state, newGameState);
  }

  static updateState<Def extends DataDefinition>(
    state: AllState<Def>
  ): {state: AllState<Def>; notifications: AnyTypeNotification<Def>[]} {
    let st = state;
    st = Im.pipe(
      () => st,
      st => this.updateTime(st),
      st => this.updateInput(st),
      st => this.updateCollision(st)
    )();

    st = Im.pipe(
      () => st,
      st => this.updateByEarlyProcedures(st),
      st => this.updateByDirector(st),
      st => this.updateByMinds(st),
      st => this.updateByLaterProcedures(st)
    )();

    const notifications = st.director.director.generateNotification(st);

    return {state: st, notifications};
  }

  private static updateTime<Def extends DataDefinition>(
    state: AllState<Def>
  ): AllState<Def> {
    const {base: baseTimeScale} = state.director.director.getTimeScales(
      this.extractGameState(state)
    );
    const engineDeltaMs = state.realWorldTime.realWorldTimeDeltaMs;

    return {
      ...state,
      time: TTimeState.update(state.time, {engineDeltaMs, baseTimeScale}),
    };
  }

  private static updateInput<Def extends DataDefinition>(
    state: AllState<Def>
  ): AllState<Def> {
    const newRawPointer = TInputCanvasPointerState.convertToRawPointer(
      state.inputCanvasPointer,
      {
        cameraState: state.camera,
        renderingState: state.rendering,
      }
    );
    return {
      ...state,
      inputPointer: TInputPointerState.update(state.inputPointer, {
        newRawPointer,
      }),
    };
  }

  private static updateCollision<Def extends DataDefinition>(
    state: AllState<Def>
  ): AllState<Def> {
    const flattenCollisions = this.extractFlattenCollisions(state);
    return {
      ...state,
      collision: TCollisionState.update(state.collision, flattenCollisions),
    };
  }

  private static extractFlattenCollisions<Def extends DataDefinition>(
    state: AllState<Def>
  ): FlattenCollision<Def>[] {
    return Im.pipe(
      () => state,
      state => TMindsState.calcBodyPropsMindArray(state.minds, state),
      acts =>
        acts.map(({body, props, mind}): [AnyTypeBodyId<Def>, Collision] => [
          body.id,
          mind.generateCollision(body, props),
        ]),
      collisions => TCollision.calcFlattenCollisions(collisions)
    )();
  }

  private static updateByEarlyProcedures<Def extends DataDefinition>(
    state: AllState<Def>
  ): AllState<Def> {
    return this.updateAsGameState(state, (gameState, allState) => {
      return TProceduresState.updateGameStateByEarlyProcedures(
        allState.procedures,
        gameState
      );
    });
  }

  private static updateByDirector<Def extends DataDefinition>(
    state: AllState<Def>
  ): AllState<Def> {
    return this.updateAsGameState(state, (gameState, allState) => {
      return allState.director.director.update(gameState);
    });
  }

  private static updateByMinds<Def extends DataDefinition>(
    state: AllState<Def>
  ): AllState<Def> {
    return this.updateAsGameState(state, (gameState, allState) => {
      return TMindsState.updateGameStateByMinds(allState.minds, gameState);
    });
  }

  private static updateByLaterProcedures<Def extends DataDefinition>(
    state: AllState<Def>
  ): AllState<Def> {
    return this.updateAsGameState(state, (gameState, allState) => {
      return TProceduresState.updateGameStateByLaterProcedures(
        allState.procedures,
        gameState
      );
    });
  }

  static generateGraphics<Def extends DataDefinition>(
    state: AllState<Def>
  ): CanvasGraphic<Def>[] {
    const bodyPropsMindArray = TMindsState.calcBodyPropsMindArray(
      state.minds,
      state
    );
    // NOTE: I didn't use flat because it is too slow.
    const graphics: Graphic<Def>[] = [];
    for (const {body, props, mind} of bodyPropsMindArray) {
      const gs = mind.generateGraphics(body, props);
      for (const g of gs) {
        graphics.push(TGraphic.appendKey(body.id[1], g));
      }
    }

    return TGraphic.convertGraphicsToCanvas(graphics, {
      cameraState: state.camera,
      renderingState: state.rendering,
    });
  }

  static calcRenderingAreaOfCanvas<Def extends DataDefinition>(
    state: AllState<Def>
  ): AaRect2d {
    return TCameraState.calcRenderingAreaOfCanvas(state.camera, {
      renderingState: state.rendering,
    });
  }
}