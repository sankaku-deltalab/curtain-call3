import {Im} from './immutable-manipulation';

export type Vec2d = Readonly<{x: number; y: number}>;

export class Vec2dTrait {
  static zero(): Vec2d {
    return {x: 0, y: 0};
  }

  static one(): Vec2d {
    return {x: 1, y: 1};
  }

  static sizeSq(a: Vec2d): number {
    return Math.pow(a.x, 2) + Math.pow(a.y, 2);
  }

  static size(a: Vec2d): number {
    return Math.sqrt(Vec2dTrait.sizeSq(a));
  }

  static uniformed(a: Vec2d): Vec2d {
    const size = Vec2dTrait.size(a);
    return Vec2dTrait.div(a, size);
  }

  static add(a: Vec2d, b: Vec2d): Vec2d {
    return {x: a.x + b.x, y: a.y + b.y};
  }

  static sub(a: Vec2d, b: Vec2d): Vec2d {
    return {x: a.x - b.x, y: a.y - b.y};
  }

  static mlt(a: Vec2d, b: number): Vec2d {
    return {x: a.x * b, y: a.y * b};
  }

  static div(a: Vec2d, b: number): Vec2d {
    return {x: a.x / b, y: a.y / b};
  }

  static hProduct(a: Vec2d, b: Vec2d): Vec2d {
    // Hadamard product
    return {x: a.x * b.x, y: a.y * b.y};
  }

  static dot(a: Vec2d, b: Vec2d): number {
    return a.x * b.x + a.y * b.y;
  }

  static reflect(
    velocity: Vec2d,
    normal: Vec2d,
    opt?: {uniformNormal?: boolean}
  ): Vec2d {
    const uniformNormal = opt?.uniformNormal ?? true;
    const v = velocity;
    const vn = Vec2dTrait.mlt(v, -1);
    const n = uniformNormal ? Vec2dTrait.uniformed(normal) : normal;

    const scale = 2 * Vec2dTrait.dot(vn, n);
    const args = {v, n};
    return Vec2dTrait.calculate(args, ({v, n}) => v + n * scale);
  }

  static eq(a: Vec2d, b: Vec2d): boolean {
    return a.x === b.x && a.y === b.y;
  }

  static isZero(v: Vec2d): boolean {
    return v.x === 0 && v.y === 0;
  }

  static fromRadians(angleRad: number, size: number): Vec2d {
    return {
      x: Math.cos(angleRad) * size,
      y: Math.sin(angleRad) * size,
    };
  }

  static calculate<T extends Record<string, Vec2d>>(
    args: T,
    formula: (args: Record<keyof T & string, number>) => number
  ): Vec2d {
    const argsX = Im.mapObj(args, v => v.x);
    const argsY = Im.mapObj(args, v => v.y);
    return {
      x: formula(argsX),
      y: formula(argsY),
    };
  }
}
