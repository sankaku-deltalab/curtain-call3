import {DefineBody} from '../../helper/game-dev';
import {Vec2d} from '../../utils';

export type Target = DefineBody<
  'target',
  {
    id: ['target', string];
    bodyType: 'target';
    pos: Vec2d;
    score: number;
    spriteKey: string;
  }
>;
