import {ActressPartsTrait, MindId} from './components/actress-parts';
import {ActressTrait, AnyActressBehavior, AnyActressState} from './actress';
import {
  Collision,
  FlatCollision,
  Overlaps,
} from './components/collision/collision';
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
import {ImListTrait} from '../utils/im-list';

export type UpdateArgs<Stg extends Setting> = {
  input: CanvasInput<Stg>;
  cues: AnyCue<Stg>[];
  time: TimeInput<Stg>;
  renderingState: RenderingState;
  instances: GameInstances<Stg>;
};

export class GameProcessing {
  static createInitialState<Stg extends Setting>(
    args: StateInitializer<Stg>
  ): GameState<Stg> {
    return GameStateTrait.initialState(args);
  }

  static update<Stg extends Setting>(
    state: GameState<Stg>,
    args: UpdateArgs<Stg>
  ): {state: GameState<Stg>; notifications: AnyNotification<Stg>[]} {
    let st = state;
    st = Im.pipe(
      () => state,
      st => updateTime(st, args),
      st => updateInput(st, args),
      st => addGivenCues(st, args),
      st => applyInputToDirector(st, args),
      st => applyInputToActresses(st, args),
      st => updateCollision(st, args)
    )();

    st = Im.pipe(
      () => st,
      st => generateCuesByDirector(st, args),
      st => generateCuesByCueHandlers(st, args),
      st => applyCues(st, args),
      st => updateByDirector(st, args),
      st => updateByActresses(st, args),
      st => deleteActresses(st, args),
      ({state}) => state
    )();

    return consumeNotifications(st);
  }

  static collectActInState<Stg extends Setting>(
    state: GameState<Stg>,
    args: {instances: GameInstances<Stg>}
  ): {
    mindId: MindId;
    state: AnyActressState<Stg>;
    beh: AnyActressBehavior<Stg>;
  }[] {
    const minds = ActressPartsTrait.getMinds(state.actressParts);
    const bodiesMap = new Map(ActressPartsTrait.getBodies(state.actressParts));
    const acts = minds.map(([mindId, mind]) => {
      const beh = GameInstancesTrait.getActressBehavior(
        mind.meta.mindType,
        args.instances
      );
      if (beh.err) {
        return beh;
      }
      const actSt = ActressTrait.extractActressState(mindId, mind, bodiesMap);
      if (actSt.err) {
        return actSt;
      }

      return Res.ok({
        mindId,
        state: actSt.val,
        beh: beh.val,
      });
    });
    return Res.onlyOk(acts);
  }
}

const updateTime = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {time: TimeInput<Stg>; instances: GameInstances<Stg>}
): GameState<Stg> => {
  const timeScale = args.instances.director.getTimeScales(state);
  return Im.update(state, 'time', s =>
    TimeTrait.applyInput(s, {input: args.time, baseTimeScale: timeScale.base})
  );
};

const collectActInState = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): {
  state: AnyActressState<Stg>;
  beh: AnyActressBehavior<Stg>;
}[] => {
  return GameProcessing.collectActInState(state, args);
};

const mergeActressStates = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    actStates: Result<AnyActressState<Stg>>[];
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
  return Im.update(state, 'input', st => InputTrait.updateState(st, updArgs));
};

const addGivenCues = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {cues: AnyCue<Stg>[]}
): GameState<Stg> => {
  return Im.update(state, 'cue', cue =>
    CueTrait.mergeCues(cue, ImListTrait.new(args.cues))
  );
};

const applyInputToDirector = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): GameState<Stg> => {
  const director = GameInstancesTrait.getDirectorBehavior(args.instances);
  return director.applyInput(state);
};

const applyInputToActresses = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {time: TimeInput<Stg>; instances: GameInstances<Stg>}
): GameState<Stg> => {
  const instances = args.instances;
  const actresses = collectActInState(state, {instances});

  const actStates: Result<AnyActressState<Stg>>[] = actresses.map(
    ({state: actSt, beh}) => {
      return Res.ok(beh.applyInput(actSt, {state}));
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

  return Im.update(state, 'collision', () => ({flatCollisions, overlaps}));
};

const calcFlatCollisions = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): FlatCollision[] => {
  return Im.pipe(
    () => state,
    st => collectActInState(st, args),
    acts =>
      Enum.map(acts, ({state: st, beh}): [string, Collision] => {
        const props = beh.createProps(st, {state});
        const col = beh.generateCollision(st, props);
        return [st.mind.meta.bodyId, col];
      }),
    col => CollisionTrait.calcFlatCollisions(col)
  )();
};

const calcOverlaps = (collisions: FlatCollision[]): Overlaps => {
  return OverlapCalculation.calcOverlaps(collisions);
};

const generateCuesByDirector = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  const cues = args.instances.director.generateCuesAtUpdate(state);
  return Im.update(state, 'cue', cue => CueTrait.mergeCues(cue, cues));
};

const generateCuesByCueHandlers = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  const cueTypesUnsorted = Object.keys(args.instances.cueHandlers);
  const priority = args.instances.director.getCuePriority();
  const cueTypes = CueTrait.sortCueTypesByPriority(cueTypesUnsorted, {
    priority,
  });

  let addingCues = ImListTrait.new<AnyCue<Stg>>();
  for (const cueType of cueTypes) {
    const handler = args.instances.cueHandlers[cueType];
    const payloads = handler.generateCuesAtUpdate(state, {});
    ImListTrait.toArray(payloads).forEach(payload => {
      addingCues = ImListTrait.push(addingCues, {type: cueType, payload});
    });
  }

  return Im.update(state, 'cue', cue => CueTrait.mergeCues(cue, addingCues));
};

const applyCues = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): GameState<Stg> => {
  let st = state;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const {state: st2, cue} = popCue(st, args);
    if (cue === undefined) return st;
    const handler = args.instances.cueHandlers[cue.type];
    st = handler.applyCue(st2, cue.payload);
  }
};

const popCue = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {
    instances: GameInstances<Stg>;
  }
): {state: GameState<Stg>; cue?: AnyCue<Stg>} => {
  const priority = args.instances.director.getCuePriority();
  const {state: cueSt, cue} = CueTrait.popCue(state.cue, {priority});
  return {
    state: Im.update(state, 'cue', () => cueSt),
    cue,
  };
};

const updateByDirector = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): GameState<Stg> => {
  const director = GameInstancesTrait.getDirectorBehavior(args.instances);
  return director.update(state);
};

const updateByActresses = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {instances: GameInstances<Stg>}
): GameState<Stg> => {
  const instances = args.instances;
  const actresses = collectActInState(state, {instances});

  const actStates: Result<AnyActressState<Stg>>[] = actresses.map(
    ({state: actSt, beh}) => {
      const props = beh.createProps(actSt, {state});
      return Res.ok(beh.update(actSt, props));
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
      const {noSt: noSt, notifications} =
        NotificationTrait.consumeAllNotifications(st.notification);
      return {
        state: Im.update(st, 'notification', () => noSt),
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
  const delActs = acts.filter(({state: st}) => st.body.meta.del);
  const delMinds = delActs.map(({state: st}) => st.mindId);
  const delBodies = delActs.map(({state: st}) => st.mind.meta.bodyId);
  const st = Im.update(state, 'actressParts', actSt =>
    ActressPartsTrait.deleteMindsAndBodies(actSt, delMinds, delBodies)
  );
  return {state: st};
};
