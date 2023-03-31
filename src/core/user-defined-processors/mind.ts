import {GameState} from '../state/game-states';
import {Body, BodyType, DataDefinition} from '../setting/data-definition';
import {Graphic} from '../components/graphics/graphic';
import {Collision} from '../components/collision/collision';

export type MindArgs = {
  deltaMs: number;
  engineDeltaMs: number;
};

export interface Mind<
  Def extends DataDefinition,
  BT extends BodyType<Def>,
  Props = unknown
> {
  calcProps(state: GameState<Def>, body: Body<Def, BT>): Props;
  updateBody(body: Body<Def, BT>, args: MindArgs, props: Props): Body<Def, BT>;

  mustDeleteSelf(body: Body<Def, BT>, props: Props): boolean;
  generateGraphics(body: Body<Def, BT>, props: Props): Graphic<Def>[];
  generateCollision(body: Body<Def, BT>, props: Props): Collision;
}

export type AnyTypeMind<Def extends DataDefinition> = Mind<
  Def,
  BodyType<Def>,
  unknown
>;
