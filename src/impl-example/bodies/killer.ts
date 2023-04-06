import {DefineBody} from '../../helper/game-dev';
import {Vec2d} from '../../utils';

export type Killer = DefineBody<
  'killer',
  {
    // meta
    id: ['killer', string];
    bodyType: 'killer';

    // movement
    pos: Vec2d;
    movement: KillerMovement;

    // damaging
    damage: number;
    canGiveDamage: boolean;
  }
>;

export type KillerMovement = {
  type: 'constant';
  velocity: Vec2d;
};
