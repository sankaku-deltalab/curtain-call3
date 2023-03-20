import {DataDefinition, Level} from '../../setting/data-definition';

export type LevelState<Def extends DataDefinition> = Readonly<{
  level: Level<Def>;
}>;

export class TLevelState {
  static new<Def extends DataDefinition>(level: Level<Def>): LevelState<Def> {
    return {level};
  }

  static putLevel<Def extends DataDefinition>(
    levelState: LevelState<Def>,
    level: Level<Def>
  ): LevelState<Def> {
    return {
      ...levelState,
      level: level,
    };
  }
}
