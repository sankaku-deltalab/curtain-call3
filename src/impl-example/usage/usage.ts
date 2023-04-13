import {AllProcessorsState} from '../../core/state/all-processors-state';
import {UpdateInput} from '../../core/state/user-given-values-state';
import {GameProcessingHelper} from '../../helper/game-management';
import {TVec2d} from '../../utils';
import {ExampleDataDefinition} from '../def';
import {ExampleDirector} from '../director';
import {TExampleLevel} from '../level';
import {KIllerMind} from '../minds/killer-mind';
import {PlayerMind} from '../minds/player-mind';
import {TargetMind} from '../minds/target-mind';
import {KillerHitToPlayer} from '../procedures/killer-hit-to-player';

type Def = ExampleDataDefinition;

const serializableState = GameProcessingHelper.createSerializableState<Def>({
  level: TExampleLevel.new(),
  cameraSize: {x: 256, y: 256},
  dataSources: {
    params: [
      {id: 'default', playerInitialLife: 3},
      {id: 'hard', playerInitialLife: 1},
    ],
    targetStat: [
      {id: 'default', score: 1, spriteKey: ''},
      {id: 'special', score: 1, spriteKey: ''},
    ],
  },
  initialCustomInputs: {
    pressedButtonA: false,
  },
});

const allProcessors: AllProcessorsState<Def> = {
  director: {director: new ExampleDirector()},
  dynamicSources: {dynamicSources: {targetSpawnPos: {}}},
  procedures: {
    earlyProcedure: [new KillerHitToPlayer()],
    laterProcedure: [],
  },
  minds: {
    minds: {
      player: new PlayerMind(),
      target: new TargetMind(),
      killer: new KIllerMind(),
    },
  },
};

const updateInput: UpdateInput<Def> = {
  canvasPointer: {down: false, canvasPos: TVec2d.zero()},
  customInput: {pressedButtonA: false},
  realWorldTimeDeltaMs: 123,
  renderingState: {
    canvasSize: TVec2d.zero(),
    center: TVec2d.zero(),
    scale: 1,
  },
};

const {state: _newState, notifications: _} = GameProcessingHelper.updateState(
  serializableState,
  allProcessors,
  updateInput
);
