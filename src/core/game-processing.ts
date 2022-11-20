import {
  ActressTrait,
  AnyActressBehavior,
  AnyActressState,
  MindId,
} from './actress';
import {Collision, Overlaps} from './components/collision/collision';
import {DirectorTrait} from './director';
import {GameInstances, GameInstancesTrait} from './game-instances';
import {GameState, GameStateTrait, StateInitializer} from './game-state';
import {CanvasInput, InputTrait} from './components/inputs/input';
import {Res, Result} from './utils/result';
import {Setting} from './setting';
import {TimeInput, TimeTrait} from './components/time';
import {Enum, Im} from './utils/util';
import {RenderingState} from './components/camera';
import {AnyNotification, SceneTrait} from './scene';
import {OverlapCalculation} from './components/collision/overlap-calculation';

export class GameProcessing {
  static createInitialState<Stg extends Setting>(
    args: StateInitializer<Stg>
  ): GameState<Stg> {
    return GameStateTrait.initialState(args);
  }

  static update<Stg extends Setting>(
    state: GameState<Stg>,
    args: {
      input: CanvasInput<Stg>;
      time: TimeInput<Stg>;
      renderingState: RenderingState;
      instances: GameInstances<Stg>;
    }
  ): {state: GameState<Stg>; notifications: AnyNotification<Stg>[]} {
    let st = state;
    st = Im.pipe(
      () => state,
      st => updateTime(st, args),
      st => updateInput(st, args),
      st => applyInputToActresses(st, args)
    )();

    const overlaps = calcOverlaps(st, args);

    st = Im.pipe(
      () => st,
      st => updateByDirector(st, {...args, overlaps}),
      st => updateByActresses(st, args),
      st => deleteActresses(st, args),
      ({state}) => state
    )();

    return consumeNotifications(st);
  }
}

const updateTime = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {time: TimeInput<Stg>}
): GameState<Stg> => {
  return Im.replace(state, 'time', s => TimeTrait.applyInput(s, args.time));
};

const collectActInState = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): [MindId, AnyActressState<Stg>, AnyActressBehavior<Stg>][] => {
  const minds = ActressTrait.getMinds(state.actresses);
  const lis = Object.entries(minds).map(([mindId, mind]) => {
    const act = GameInstancesTrait.getActressBehavior(
      mind.meta.mindType,
      args.instances
    );
    if (act.err) {
      return act;
    }
    const actSt = ActressTrait.extractActressState(state, mindId);
    if (actSt.err) {
      return actSt;
    }

    return Res.ok<[MindId, AnyActressState<Stg>, AnyActressBehavior<Stg>]>([
      mindId,
      actSt.val,
      act.val,
    ]);
  });
  return Res.onlyOk(lis);
};

const mergeActressStates = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    actStates: Result<[MindId, AnyActressState<Stg>]>[];
  }
): GameState<Stg> => {
  return ActressTrait.mergeActressStates(state, Res.onlyOk(args.actStates));
};

const updateInput = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {input: CanvasInput<Stg>; renderingState: RenderingState}
): GameState<Stg> => {
  const updArgs = {
    canvasInput: args.input,
    camSt: state.camera,
    renSt: args.renderingState,
  };
  return Im.replace(state, 'input', st => InputTrait.updateState(st, updArgs));
};

const applyInputToActresses = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {time: TimeInput<Stg>; instances: GameInstances<Stg>}
): GameState<Stg> => {
  const instances = args.instances;
  const actresses = collectActInState(state, {instances});

  const actStates: Result<[MindId, AnyActressState<Stg>]>[] = actresses.map(
    ([mindId, actSt, beh]) => {
      return Res.ok([
        mindId,
        beh.applyInput(actSt, {...args, gameState: state}),
      ]);
    }
  );

  return mergeActressStates(state, {actStates});
};

const calcOverlaps = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): Overlaps => {
  return Im.pipe(
    () => state,
    st => collectActInState(st, args),
    acts =>
      Enum.map(acts, ([_mindId, st, beh]): [string, Collision] => {
        const col = beh.generateCollision(st, {gameState: state});
        return [st.mind.meta.bodyId, col];
      }),
    col => Object.fromEntries(col),
    col => OverlapCalculation.calcOverlaps(col)
  )();
};

const updateByDirector = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    time: TimeInput<Stg>;
    overlaps: Overlaps;
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  const director = GameInstancesTrait.getDirectorBehavior(args.instances);

  let st = DirectorTrait.extractDirectorGameState(state);
  st = director.update(st, {overlaps: args.overlaps});

  return DirectorTrait.mergeDirectorGameState(st, state);
};

const updateByActresses = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {time: TimeInput<Stg>; instances: GameInstances<Stg>}
): GameState<Stg> => {
  const instances = args.instances;
  const actresses = collectActInState(state, {instances});

  const actStates: Result<[MindId, AnyActressState<Stg>]>[] = actresses.map(
    ([mindId, actSt, beh]) => {
      return Res.ok([mindId, beh.update(actSt, {...args, gameState: state})]);
    }
  );

  return mergeActressStates(state, {actStates});
};

const consumeNotifications = <Stg extends Setting>(
  state: GameState<Stg>
): {state: GameState<Stg>; notifications: AnyNotification<Stg>[]} => {
  const originalSt = state;
  return Im.pipe(
    () => originalSt,
    st => SceneTrait.consumeAllNotifications(st.scene),
    ({state: scSt, notifications}) => ({
      state: Im.replace(originalSt, 'scene', () => scSt),
      notifications,
    })
  )();
};

const deleteActresses = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): {state: GameState<Stg>} => {
  const acts = collectActInState(state, args);
  const delActs = acts.filter(([_mid, st, _beh]) => st.body.meta.del);
  const delMinds = delActs.map(([mid]) => mid);
  const delBodies = delActs.map(([_mid, st]) => st.mind.meta.bodyId);
  const newAct = Im.pipe(
    () => state.actresses,
    a => Im.replace(a, 'minds', m => Im.removeMulti(m, delMinds)),
    a => Im.replace(a, 'bodies', b => Im.removeMulti(b, delBodies))
  )();
  const st = Im.replace(state, 'actresses', () => newAct);
  return {state: st};
};
