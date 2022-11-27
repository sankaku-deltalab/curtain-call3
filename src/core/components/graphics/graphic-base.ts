import {Vec2d} from '../../../utils/vec2d';

export type Color = number;

export type GraphicBase = Readonly<{
  key: string;
  pos: Vec2d;
  zIndex: number;
}>;

export type CanvasGraphicBase = Readonly<{key: string; zIndex: number}>;
