import {DefineDataDefinition} from '../helper/game-dev';
import {Killer} from './bodies/killer';
import {Player} from './bodies/player';
import {Target} from './bodies/target';
import {Params} from './data-sources/params';
import {TargetStat} from './data-sources/target-stat';
import {
  TargetSpawnPosItem,
  TargetSpawnPosProps,
} from './dynamic-sources/target-spawn-pos';
import {ExampleLevel} from './level';
import {EndGameNotification} from './notifications/end-game-notification';

export type ExampleDataDefinition = DefineDataDefinition<{
  level: ExampleLevel;
  bodies: {
    player: Player;
    target: Target;
    killer: Killer;
  };
  dataSources: {
    targetStat: TargetStat;
    params: Params;
  };
  dynamicSources: {
    targetSpawnPos: {props: TargetSpawnPosProps; item: TargetSpawnPosItem};
  };
  notifications: {
    endGame: EndGameNotification;
  };
  customInputs: {
    pressedButtonA: boolean;
  };
}>;
