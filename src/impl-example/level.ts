import {DefineLevel} from '../helper/game-dev';

export type ExampleLevel = DefineLevel<{
  finishedWaveCount: number;
  paramsKey: string;
  score: number;
  rank: number;
}>;

export class TExampleLevel {
  static new(): ExampleLevel {
    return {
      finishedWaveCount: 0,
      paramsKey: 'default',
      score: 0,
      rank: 1,
    };
  }
}
