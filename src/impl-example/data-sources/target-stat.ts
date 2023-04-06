import {DefineDataSourceItem} from '../../helper/game-dev';

export type TargetStat = DefineDataSourceItem<{
  id: string;
  score: number;
  spriteKey: string;
}>;
