import {Collision} from '../../core/components/collision';
import {Graphic} from '../../core/components/graphics';
import {Body} from '../../core/setting';
import {GameState} from '../../core/state';
import {Mind, MindArgs} from '../../core/user-defined-processors';
import {CollisionHelper} from '../../helper/game-dev';
import {ExampleDataDefinition} from '../def';

type Def = ExampleDataDefinition;
type BT = 'killer';
type Props = {};

export class KIllerMind implements Mind<Def, BT, Props> {
  calcProps(_state: GameState<Def>, _body: Body<Def, BT>): Props {
    return {};
  }

  updateBody(
    body: Body<Def, BT>,
    _args: MindArgs,
    _props: Props
  ): Body<Def, BT> {
    return body;
  }

  mustDeleteSelf(_body: Body<Def, BT>, _props: Props): boolean {
    return false;
  }

  generateGraphics(_body: Body<Def, BT>, _props: Props): Graphic<Def>[] {
    return [];
  }

  generateCollision(_body: Body<Def, BT>, _props: Props): Collision {
    return CollisionHelper.createCollision({shapes: []});
  }
}
