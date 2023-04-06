import {GameState} from '../../core/state';
import {
  BodyBaseAttrs,
  DataSourceHelper,
  DefineBody,
  LevelHelper,
} from '../../helper/game-dev';
import {Im, TVec2d, Vec2d} from '../../utils';
import {ExampleDataDefinition} from '../def';

export type Player = DefineBody<
  'player',
  {
    id: ['player', string];
    bodyType: 'player';
    pos: Vec2d;
    life: number;
  }
>;

type Def = ExampleDataDefinition;

export class TPlayer {
  static new(state: GameState<Def>): BodyBaseAttrs<'player', Player> {
    const {playerInitialLife: playerDefaultLife} = DataSourceHelper.fetchB(
      state,
      'params',
      LevelHelper.getLevel(state).paramsKey
    );

    return {
      bodyType: 'player',
      pos: TVec2d.zero(),
      life: playerDefaultLife,
    };
  }

  static takeDamage(player: Player, damage: number): Player {
    return Im.update(player, 'life', life => life - damage);
  }
}
