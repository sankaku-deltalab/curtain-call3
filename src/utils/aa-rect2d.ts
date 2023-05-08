import {Vec2d, TVec2d} from './vec2d';

/**
 * Axis-aligned rectangle in 2d
 */
export type AaRect2d = Readonly<{nw: Vec2d; se: Vec2d}>;

export class TAaRect2d {
  static zero(): AaRect2d {
    return {
      nw: TVec2d.zero(),
      se: TVec2d.zero(),
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
    return TVec2d.div(TVec2d.add(nw, se), 2);
  }

  static isCorrect(rect: AaRect2d): boolean {
    return rect.nw.x <= rect.se.x && rect.nw.y <= rect.se.y;
  }

  static eq(area1: AaRect2d, area2: AaRect2d): boolean {
    return TVec2d.eq(area1.nw, area2.nw) && TVec2d.eq(area1.se, area2.se);
  }

  static move(rect: AaRect2d, delta: Vec2d): AaRect2d {
    return {
      nw: TVec2d.add(rect.nw, delta),
      se: TVec2d.add(rect.se, delta),
    };
  }

  static fromCenterAndSize(center: Vec2d, size: Vec2d): AaRect2d {
    const sizeHalf = TVec2d.div(size, 2);
    return {
      nw: TVec2d.sub(center, sizeHalf),
      se: TVec2d.add(center, sizeHalf),
    };
  }

  static projectPointToUnitArea(pos: Vec2d, args: {prevArea: AaRect2d}): Vec2d {
    const p = args.prevArea;
    const scale = TAaRect2d.size(p);
    const center = TAaRect2d.center(p);

    const offsettedPos = TVec2d.sub(pos, center);
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
    const scale = TAaRect2d.size(n);
    const center = TAaRect2d.center(n);

    const scaledPos = TVec2d.hProduct(pos, scale);
    return TVec2d.add(scaledPos, center);
  }

  static projectPoint(
    pos: Vec2d,
    args: {prevArea: AaRect2d; nextArea: AaRect2d}
  ): Vec2d {
    const posInUnit = TAaRect2d.projectPointToUnitArea(pos, args);
    return TAaRect2d.projectPointFromUnitArea(posInUnit, args);
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
    const expandSizeHalf = TVec2d.div(expandSize, 2);
    const nw = TVec2d.sub(area.nw, expandSizeHalf);
    const se = TVec2d.add(area.se, expandSizeHalf);
    return {nw, se};
  }

  static reduceArea(area: AaRect2d, reduceSize: Vec2d): AaRect2d {
    const reduceSizeHalf = TVec2d.div(reduceSize, 2);
    const nw = TVec2d.add(area.nw, reduceSizeHalf);
    const se = TVec2d.sub(area.se, reduceSizeHalf);
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
    const nw = TVec2d.max(area1.nw, area2.nw);
    const se = TVec2d.min(area1.se, area2.se);
    const area = {nw, se};
    if (!TAaRect2d.isCorrect(area)) return TAaRect2d.zero();
    return area;
  }

  static isIn(smaller: AaRect2d, larger: AaRect2d): boolean {
    const intersection = TAaRect2d.intersection(smaller, larger);
    return TAaRect2d.eq(intersection, smaller);
  }

  static isOutOf(smaller: AaRect2d, larger: AaRect2d): boolean {
    const intersection = TAaRect2d.intersection(smaller, larger);
    return TAaRect2d.eq(intersection, TAaRect2d.zero());
  }

  static corners(react: AaRect2d): {
    nw: Vec2d;
    se: Vec2d;
    ne: Vec2d;
    sw: Vec2d;
  } {
    const nw = react.nw;
    const se = react.se;
    const ne = {x: react.se.x, y: react.nw.y};
    const sw = {x: react.nw.x, y: react.se.y};
    return {nw, se, ne, sw};
  }
}
