import {
  DefineDynamicSourceItem,
  DefineDynamicSourceProps,
} from '../../helper/game-dev';
import {Vec2d} from '../../utils';

export type TargetSpawnPosProps = DefineDynamicSourceProps<{}>;
export type TargetSpawnPosItem = DefineDynamicSourceItem<{
  id: string;
  pos: Vec2d;
}>;
