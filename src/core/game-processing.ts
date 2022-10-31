import {
  ActressTrait,
  AnyActressBehavior,
  AnyActressState,
  MindId,
} from './actress';
import {Overlaps} from './components/collision';
import {DirectorTrait} from './director';
import {GameInstances, GameInstancesTrait} from './game-instances';
import {GameState, GameStateTrait} from './game-state';
import {CanvasInput, CanvasInputTrait, Input} from './components/inputs/input';
import {Res, Result} from './result';
import {Setting} from './setting';
import {TimeInput, TimeTrait} from './components/time';
import {Mut, Vec2d} from './util';
import {Graphic, GraphicTrait} from './components/graphics/graphic';
import {RenderingState} from './components/camera';

export class GameProcessing {
  static init<Stg extends Setting>(args: {
    camera: {
      pos: Vec2d;
      size: Vec2d;
    };
  }): GameState<Stg> {
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
  ): GameState<Stg> {
    let st = state;

    st = updateTime(st, args);
    const r = applyInputToState(st, args);
    st = r[0];
    const input = r[1];
    st = applyInputToActresses(st, {...args, input});
    const overlaps = calcOverlaps(st);
    st = updateByDirector(st, {...args, overlaps});
    st = updateByActresses(st, args);

    return st;
  }

  static generateGraphics<Stg extends Setting>(
    state: GameState<Stg>,
    args: {
      input: Input<Stg>;
      time: TimeInput<Stg>;
      instances: GameInstances<Stg>;
    }
  ): Graphic<Stg>[] {
    const instances = args.instances;
    const actresses = collectActInState(state, {instances});

    return actresses
      .map<[string, Graphic<Stg>[]]>(([mindId, actSt, beh]) => {
        return [mindId, beh.generate_graphics(actSt, {gameState: state})];
      })
      .flatMap(([mindId, graphics]) =>
        GraphicTrait.appendKeys(mindId, graphics)
      );
  }
}

const updateTime = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {time: TimeInput<Stg>}
): GameState<Stg> => {
  return Mut.replace(state, 'time', s => TimeTrait.applyInput(s, args.time));
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
    instances: GameInstances<Stg>;
  }
): GameState<Stg> => {
  return args.actStates
    .filter(Res.isOk)
    .map(Res.unwrap)
    .reduce(
      (gameSt, [mindId, actSt]) =>
        ActressTrait.mergeActressState(gameSt, mindId, actSt),
      state
    );
};

const applyInputToState = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {input: CanvasInput<Stg>; renderingState: RenderingState}
): [GameState<Stg>, Input<Stg>] => {
  const prevState = state.input;
  const [input, inputSt] = CanvasInputTrait.convertInputToGame(
    [args.input, prevState],
    {renSt: args.renderingState, camSt: state.camera}
  );
  const newSt = Mut.replace(state, 'input', () => inputSt);
  return [newSt, input];
};

const applyInputToActresses = <Stg extends Setting>(
  state: GameState<Stg>,
  args: {input: Input<Stg>; time: TimeInput<Stg>; instances: GameInstances<Stg>}
): GameState<Stg> => {
  const instances = args.instances;
  const actresses = collectActInState(state, {instances});

  const actStates: Result<[MindId, AnyActressState<Stg>]>[] = actresses.map(
    ([mindId, actSt, beh]) => {
      return Res.ok([
        mindId,
        beh.apply_input(actSt, {...args, gameState: state}),
      ]);
    }
  );

  return mergeActressStates(state, {actStates, instances});
};

const calcOverlaps = <Stg extends Setting>(state: GameState<Stg>): Overlaps => {
  return {}; // TODO: impl this
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

  return mergeActressStates(state, {actStates, instances});
};
