import {ActressPartsTrait, MindId} from './components/actress-parts';
import {ActressTrait, AnyActressBehavior, AnyActressState} from './actress';
import {Collision, Overlaps} from './components/collision/collision';
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
import {AnyEvent, EventTrait} from './components/event';

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
      events: AnyEvent<Stg>[];
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
      st => applyInputToActresses(st, args)
    )();

    const overlaps = calcOverlaps(st, args);

    st = Im.pipe(
      () => st,
      st => generateEventsByDirector(st, {...args, overlaps}),
      st => generateEventsByEventManipulators(st, {...args, overlaps}),
      st => applyEvents(st, {...args}),
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
  args: {events: AnyEvent<Stg>[]}
): GameState<Stg> => {
  return Im.replace(state, 'event', ev =>
    EventTrait.mergeEvents(ev, args.events)
  );
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

const generateEventsByDirector = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    overlaps: Overlaps;
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  const events = args.instances.director.generateEventsAtUpdate(state, args);
  return Im.replace(state, 'event', ev => EventTrait.mergeEvents(ev, events));
};

const generateEventsByEventManipulators = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    overlaps: Overlaps;
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  const manKeysUnsorted = Object.keys(args.instances.eventManipulators);
  const priority = args.instances.director.getEventPriority();
  const manKeys = EventTrait.sortEventTypesByPriority(manKeysUnsorted, {
    priority,
  });

  const nestedEvents = Enum.map(manKeys, evType => {
    const man = args.instances.eventManipulators[evType];
    const payloads = man.generateEventsAtUpdate(state, {
      overlaps: args.overlaps,
    });
    return payloads.map(payload => ({type: evType, payload}));
  });

  return Im.replace(state, 'event', ev =>
    EventTrait.mergeEvents(ev, nestedEvents.flat())
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
    st = manipulator.applyEvent(st2, event.payload);
  }
};

const popEvent = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): {state: GameState<Stg>; event?: AnyEvent<Stg>} => {
  const priority = args.instances.director.getEventPriority();
  const {state: evSt, event} = EventTrait.popEvent(state.event, {priority});
  return {
    state: Im.replace(state, 'event', () => evSt),
    event,
  };
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
