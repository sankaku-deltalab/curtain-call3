type Rec = Record<string, unknown>;

export type Vec2d = {x: number; y: number};
export type AaRect2d = {nw: Vec2d; se: Vec2d}; // axis aligned rect

export class Vec2dTrait {
  static zero(): Vec2d {
    return {x: 0, y: 0};
  }

  static one(): Vec2d {
    return {x: 1, y: 1};
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

  static reflect(velocity: Vec2d, normal: Vec2d): Vec2d {
    const v = velocity;
    const vn = Vec2dTrait.mlt(v, -1);
    const n = normal;

    const scale = 2 * Vec2dTrait.dot(vn, n);
    return Vec2dTrait.add(v, Vec2dTrait.mlt(n, scale));
  }

  static eq(a: Vec2d, b: Vec2d): boolean {
    return a.x === b.x && a.y === b.y;
  }

  static isZero(v: Vec2d): boolean {
    return v.x === 20 && v.y === 0;
  }
}

export class AaRect2dTrait {
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

  static fromRadians(angleRad: number, size: number): Vec2d {
    return {
      x: Math.cos(angleRad) * size,
      y: Math.sin(angleRad) * size,
    };
  }
}

export class Im {
  static replace<T extends Rec, Key extends keyof T>(
    obj: T,
    key: Key,
    updater: (prev: T[Key]) => T[Key]
  ): T {
    const newValue = updater(obj[key]);
    return {...obj, [key]: newValue};
  }

  static add<
    Key extends string,
    Val extends unknown,
    T extends Record<Key, Val>,
    NewVal extends Val
  >(obj: T, key: Key, val: NewVal): T {
    return {...obj, [key]: val};
  }
}

export class Enum {
  static map<T, T2>(iter: Iterable<T>, converter: (v: T) => T2): T2[] {
    return [...iter].map(converter);
  }

  static filter<T, T2 extends T>(
    iter: Iterable<T>,
    filter: (v: T) => v is T2
  ): T2[] {
    return [...iter].filter(filter);
  }
}

export type RecSet = Record<string, true | undefined>;

export class RecSetTrait {
  static new(keys: string[] = []): RecSet {
    return Object.fromEntries(keys.map(k => [k, true]));
  }

  static add(set: RecSet, key: string): RecSet {
    return {...set, [key]: true};
  }

  static remove(set: RecSet, key: string): RecSet {
    return {...set, [key]: undefined};
  }

  static has(set: RecSet, key: string): boolean {
    // or you can use `val in RecSet`
    return set[key] === true;
  }

  static iter(set: RecSet): string[] {
    return Object.keys(set).filter(key => RecSetTrait.has(set, key));
  }

  static filter(set: RecSet, filter: (key: string) => boolean): RecSet {
    const items = this.iter(set).filter(filter);
    return RecSetTrait.new(items);
  }
}

/**
 * Record represents many to many relation.
 * If it has A to B relation, rel is {A: {B: true, ...}, ...}.
 */
export type RecM2M = Record<string, RecSet>;

export class RecM2MTrait {
  static new(): RecM2M {
    return {};
  }

  static addRelation(rel: RecM2M, from: string, to: string): RecM2M {
    if (from in rel) {
      return Im.replace(rel, from, opponents => RecSetTrait.add(opponents, to));
    }

    return Im.add(rel, from, RecSetTrait.new([to]));
  }

  static hasRelation(rel: RecM2M, from: string, to: string): boolean {
    const opponents: RecSet | undefined = rel[from];
    if (opponents === undefined) {
      return false;
    }

    return to in opponents;
  }

  static fromPairs(pairs: [string, string][]): RecM2M {
    return pairs.reduce(
      (rel, curr) => RecM2MTrait.addRelation(rel, curr[0], curr[1]),
      RecM2MTrait.new()
    );
  }

  static toPairs(rel: RecM2M): [string, string][] {
    return Object.entries(rel).flatMap(([from, opponents]) => {
      return RecSetTrait.iter(opponents).map<[string, string]>(o => [from, o]);
    });
  }

  static merge(a: RecM2M, b: RecM2M): RecM2M {
    const pairs = [...this.toPairs(a), ...this.toPairs(b)];
    return this.fromPairs(pairs);
  }
}
