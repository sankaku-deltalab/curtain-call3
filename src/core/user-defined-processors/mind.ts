import {GameState} from '../state/game-states';
import {Body, BodyType, DataDefinition} from '../setting/data-definition';
import {Collision, Graphic} from '../components';

export interface Mind<
  Def extends DataDefinition,
  BT extends BodyType<Def>,
  Props = unknown
> {
  calcProps(state: GameState<Def>, body: Body<Def, BT>): Props;
  updateBody(body: Body<Def, BT>, props: Props): Body<Def, BT>;

  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[];
  generateCollision(body: Body<Def, BT>, props: Props): Collision;
}

export type AnyTypeMind<Def extends DataDefinition> = Mind<
  Def,
  BodyType<Def>,
  unknown
>;
