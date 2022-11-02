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
      nw: Vec2dTrait.add(center, sizeHalf),
      se: Vec2dTrait.sub(center, sizeHalf),
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

export type RecSet = Record<string, true | undefined>;

export class RecSetTrait {
  static new(): RecSet {
    return {};
  }

  static add(set: RecSet, key: string): RecSet {
    return {...set, [key]: true};
  }

  static remove(set: RecSet, key: string): RecSet {
    return {...set, [key]: undefined};
  }

  static has(set: RecSet, key: string): boolean {
    return set[key] === true;
  }

  static iter(set: RecSet): string[] {
    return Object.keys(set).filter(key => RecSetTrait.has(set, key));
  }
}
