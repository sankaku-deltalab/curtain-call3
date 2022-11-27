import {LevelState, Setting} from './setting';
import {Im} from '../utils/immutable-manipulation';

export type SceneState<Stg extends Setting> = Readonly<{
  level: LevelState<Stg>;
}>;

export class SceneTrait {
  static initialState<Stg extends Setting>(args: {
    initialLevel: LevelState<Stg>;
  }): SceneState<Stg> {
    return {
      level: args.initialLevel,
    };
  }

  static getLevel<Stg extends Setting>(
    state: SceneState<Stg>
  ): LevelState<Stg> {
    return state.level;
  }

  static updateLevel<Stg extends Setting>(
    state: SceneState<Stg>,
    updater: (level: LevelState<Stg>) => LevelState<Stg>
  ): SceneState<Stg> {
    return Im.replace(state, 'level', st => updater(st)); // I didn't use `updater` directly because direct using cause type error
  }
}
