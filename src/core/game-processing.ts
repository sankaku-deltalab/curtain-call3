import {ActressPartsTrait, MindId} from './components/actress-parts';
import {ActressTrait, AnyActressBehavior, AnyActressState} from './actress';
import {
  Collision,
  FlatCollision,
  Overlaps,
} from './components/collision/collision';
import {DirectorTrait} from './director';
import {GameInstances, GameInstancesTrait} from './game-instances';
import {GameState, GameStateTrait, StateInitializer} from './game-state';
import {CanvasInput, InputTrait} from './components/inputs/input';
import {Res, Result} from '../utils/result';
import {Setting} from './setting';
import {TimeInput, TimeTrait} from './components/time';
import {Im} from '../utils/immutable-manipulation';
import {Enum} from '../utils/enum';
import {RenderingState} from './components/camera';
import {OverlapCalculation} from './components/collision/overlap-calculation';
import {AnyNotification, NotificationTrait} from './notification';
import {AnyCue, CueTrait} from './components/cue';
import {CollisionTrait} from './components/collision/collision-state';

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
      events: AnyCue<Stg>[];
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
      st => addGivenEvents(st, args),
      st => applyInputToActresses(st, args),
      st => updateCollision(st, args)
    )();

    st = Im.pipe(
      () => st,
      st => generateEventsByDirector(st, args),
      st => generateEventsByEventManipulators(st, args),
      st => applyEvents(st, args),
      st => updateByDirector(st, args),
      st => updateByActresses(st, args),
      st => deleteActresses(st, args),
      ({state}) => state
    )();

    return consumeNotifications(st);
  }
}

const updateTime = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {time: TimeInput<Stg>; instances: GameInstances<Stg>}
): GameState<Stg> => {
  const timeScale = args.instances.director.getTimeScales(state);
  return Im.replace(state, 'time', s =>
    TimeTrait.applyInput(s, {input: args.time, baseTimeScale: timeScale.base})
  );
};

const collectActInState = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): [MindId, AnyActressState<Stg>, AnyActressBehavior<Stg>][] => {
  const minds = ActressPartsTrait.getMinds(state.actressParts);
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

const addGivenEvents = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {events: AnyCue<Stg>[]}
): GameState<Stg> => {
  return Im.replace(state, 'event', ev => CueTrait.mergeCues(ev, args.events));
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

const updateCollision = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {time: TimeInput<Stg>; instances: GameInstances<Stg>}
): GameState<Stg> => {
  const flatCollisions = calcFlatCollisions(state, args);
  const overlaps = calcOverlaps(flatCollisions);

  return Im.replace(state, 'collision', () => ({flatCollisions, overlaps}));
};

const calcFlatCollisions = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): FlatCollision[] => {
  return Im.pipe(
    () => state,
    st => collectActInState(st, args),
    acts =>
      Enum.map(acts, ([_mindId, st, beh]): [string, Collision] => {
        const col = beh.generateCollision(st, {gameState: state});
        return [st.mind.meta.bodyId, col];
      }),
    col => Object.fromEntries(col),
    col => CollisionTrait.calcFlatCollisions(col)
  )();
};

const calcOverlaps = (collisions: FlatCollision[]): Overlaps => {
  return OverlapCalculation.calcOverlaps(collisions);
};

const generateEventsByDirector = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  const overlaps = state.collision.overlaps;
  const events = args.instances.director.generateCuesAtUpdate(state, {
    overlaps,
  });
  return Im.replace(state, 'event', ev => CueTrait.mergeCues(ev, events));
};

const generateEventsByEventManipulators = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  const manKeysUnsorted = Object.keys(args.instances.eventManipulators);
  const priority = args.instances.director.getCuePriority();
  const manKeys = CueTrait.sortCueTypesByPriority(manKeysUnsorted, {
    priority,
  });

  const nestedEvents = Enum.map(manKeys, evType => {
    const man = args.instances.eventManipulators[evType];
    const overlaps = state.collision.overlaps;
    const payloads = man.generateCuesAtUpdate(state, {overlaps});
    return payloads.map(payload => ({type: evType, payload}));
  });

  return Im.replace(state, 'event', ev =>
    CueTrait.mergeCues(ev, nestedEvents.flat())
  );
};

const applyEvents = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  let st = state;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const {state: st2, event} = popEvent(st, args);
    if (event === undefined) return st;
    const manipulator = args.instances.eventManipulators[event.type];
    st = manipulator.applyCue(st2, event.payload);
  }
};

const popEvent = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): {state: GameState<Stg>; event?: AnyCue<Stg>} => {
  const priority = args.instances.director.getCuePriority();
  const {state: evSt, cue: event} = CueTrait.popCue(state.event, {priority});
  return {
    state: Im.replace(state, 'event', () => evSt),
    event,
  };
};

const updateByDirector = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  const director = GameInstancesTrait.getDirectorBehavior(args.instances);
  const overlaps = state.collision.overlaps;

  let st = DirectorTrait.extractDirectorGameState(state);
  st = director.update(st, {overlaps});

  return DirectorTrait.mergeDirectorGameState(st, state);
};

const updateByActresses = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
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
  return Im.pipe(
    () => state,
    st => {
      const {state: noSt, notifications} =
        NotificationTrait.consumeAllNotifications(st.notification);
      return {
        state: Im.replace(st, 'notification', () => noSt),
        notifications,
      };
    }
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
    () => state.actressParts,
    a => Im.replace(a, 'minds', m => Im.removeMulti(m, delMinds)),
    a => Im.replace(a, 'bodies', b => Im.removeMulti(b, delBodies))
  )();
  const st = Im.replace(state, 'actressParts', () => newAct);
  return {state: st};
};
