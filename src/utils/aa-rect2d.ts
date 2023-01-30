import {Vec2d, Vec2dTrait} from './vec2d';

/**
 * Axis-aligned rectangle in 2d
 */
export type AaRect2d = Readonly<{nw: Vec2d; se: Vec2d}>;

export class AaRect2dTrait {
  static zero(): AaRect2d {
    return {
      nw: Vec2dTrait.zero(),
      se: Vec2dTrait.zero(),
    };
  }

  static unit(): AaRect2d {
    return {
      nw: {x: 0.5, y: 0.5},
      se: {x: -0.5, y: -0.5},
    };
  }

  static size(rect: AaRect2d): Vec2d {
    const {nw, se} = rect;
    return {
      x: se.x - nw.x,
      y: se.y - nw.y,
    };
  }

  static center(rect: AaRect2d): Vec2d {
    const {nw, se} = rect;
    return Vec2dTrait.div(Vec2dTrait.add(nw, se), 2);
  }

  static isCorrect(rect: AaRect2d): boolean {
    return rect.nw.x <= rect.se.x && rect.nw.y <= rect.se.y;
  }

  static eq(area1: AaRect2d, area2: AaRect2d): boolean {
    return (
      Vec2dTrait.eq(area1.nw, area2.nw) && Vec2dTrait.eq(area1.se, area2.se)
    );
  }

  static move(rect: AaRect2d, delta: Vec2d): AaRect2d {
    return {
      nw: Vec2dTrait.add(rect.nw, delta),
      se: Vec2dTrait.add(rect.se, delta),
    };
  }

  static fromCenterAndSize(center: Vec2d, size: Vec2d): AaRect2d {
    const sizeHalf = Vec2dTrait.div(size, 2);
    return {
      nw: Vec2dTrait.sub(center, sizeHalf),
      se: Vec2dTrait.add(center, sizeHalf),
    };
  }

  static projectPointToUnitArea(pos: Vec2d, args: {prevArea: AaRect2d}): Vec2d {
    const p = args.prevArea;
    const scale = AaRect2dTrait.size(p);
    const center = AaRect2dTrait.center(p);

    const offsettedPos = Vec2dTrait.sub(pos, center);
    return {
      x: offsettedPos.x / scale.x,
      y: offsettedPos.y / scale.y,
    };
  }

  static projectPointFromUnitArea(
    pos: Vec2d,
    args: {nextArea: AaRect2d}
  ): Vec2d {
    const n = args.nextArea;
    const scale = AaRect2dTrait.size(n);
    const center = AaRect2dTrait.center(n);

    const scaledPos = Vec2dTrait.hProduct(pos, scale);
    return Vec2dTrait.add(scaledPos, center);
  }

  static projectPoint(
    pos: Vec2d,
    args: {prevArea: AaRect2d; nextArea: AaRect2d}
  ): Vec2d {
    const posInUnit = AaRect2dTrait.projectPointToUnitArea(pos, args);
    return AaRect2dTrait.projectPointFromUnitArea(posInUnit, args);
  }

  /**
   *
   * {x, y} is
   * - {0, 0} if pos in area.
   * - {-1, -1} if pos in nw of outside.
   * - {1, 1} if pos in se of outside.
   * - {-1, 1} if pos in ne of outside.
   * - {1, -1} if pos in sw of outside.
   *
   * ```
   * {-1, -1} |  {0, -1}   | {1, -1}
   * ---------nw===========+---------
   *  {-1, 0} |   {0, 0}   | {1, 0}
   * ---------+===========se---------
   *  {-1, 1} |   {0, 1}   | {1, 1}
   *
   * A
   * | y
   * |     x
   * +------>
   * ```
   * @param pos
   * @param args
   * @returns
   */
  static calcPointPosition(pos: Vec2d, args: {area: AaRect2d}): Vec2d {
    const {nw, se} = args.area;
    const x = pos.x < nw.x ? -1 : pos.x > se.x ? 1 : 0;
    const y = pos.y < nw.y ? -1 : pos.y > se.y ? 1 : 0;
    return {x, y};
  }

  static expandArea(area: AaRect2d, expandSize: Vec2d): AaRect2d {
    const expandSizeHalf = Vec2dTrait.div(expandSize, 2);
    const nw = Vec2dTrait.sub(area.nw, expandSizeHalf);
    const se = Vec2dTrait.add(area.se, expandSizeHalf);
    return {nw, se};
  }

  static reduceArea(area: AaRect2d, reduceSize: Vec2d): AaRect2d {
    const reduceSizeHalf = Vec2dTrait.div(reduceSize, 2);
    const nw = Vec2dTrait.add(area.nw, reduceSizeHalf);
    const se = Vec2dTrait.sub(area.se, reduceSizeHalf);
    return {nw, se};
  }

  static clampPosition(pos: Vec2d, area: AaRect2d): Vec2d {
    const clamp = (v: number, min: number, max: number): number => {
      return v < min ? min : v > max ? max : v;
    };
    return {
      x: clamp(pos.x, area.nw.x, area.se.x),
      y: clamp(pos.y, area.nw.y, area.se.y),
    };
  }

  static intersection(area1: AaRect2d, area2: AaRect2d): AaRect2d {
    const nw = Vec2dTrait.max(area1.nw, area2.nw);
    const se = Vec2dTrait.min(area1.se, area2.se);
    const area = {nw, se};
    if (!AaRect2dTrait.isCorrect(area)) return AaRect2dTrait.zero();
    return area;
  }

  static isIn(smaller: AaRect2d, larger: AaRect2d): boolean {
    const intersection = AaRect2dTrait.intersection(smaller, larger);
    return AaRect2dTrait.eq(intersection, smaller);
  }

  static isOutOf(smaller: AaRect2d, larger: AaRect2d): boolean {
    const intersection = AaRect2dTrait.intersection(smaller, larger);
    return AaRect2dTrait.eq(intersection, AaRect2dTrait.zero());
  }

  static corners(react: AaRect2d): {
    nw: Vec2d;
    se: Vec2d;
    ne: Vec2d;
    sw: Vec2d;
  } {
    const nw = react.nw;
    const se = react.se;
    const ne = {x: react.nw.x, y: react.se.y};
    const sw = {x: react.se.x, y: react.nw.y};
    return {nw, se, ne, sw};
  }
}
