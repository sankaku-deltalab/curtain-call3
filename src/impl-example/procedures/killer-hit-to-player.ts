import {BodyId} from '../../core/setting';
import {GameState} from '../../core/state';
import {OverlapsReducerProcedure} from '../../core/user-defined-processors';
import {BodiesHelper} from '../../helper/game-dev';
import {TPlayer} from '../bodies/player';
import {ExampleDataDefinition} from '../def';

type Def = ExampleDataDefinition;

export class KillerHitToPlayer extends OverlapsReducerProcedure<
  Def,
  'killer',
  'player'
> {
  leftBodyType: 'killer' = 'killer';
  rightBodyType: 'player' = 'player';

  applyOverlaps(
    state: GameState<Def>,
    killerId: BodyId<Def, 'killer'>,
    playerId: BodyId<Def, 'player'>
  ): GameState<Def> {
    const maybeKiller = BodiesHelper.fetchBody(state, killerId);
    const maybePlayer = BodiesHelper.fetchBody(state, playerId);
    if (maybeKiller.err || maybePlayer.err) return state;

    const killer = maybeKiller.val;
    const player = maybePlayer.val;

    if (!killer.canGiveDamage) return state;
    const newPlayer = TPlayer.takeDamage(player, killer.damage);
    return BodiesHelper.putBody(state, newPlayer);
  }
}
