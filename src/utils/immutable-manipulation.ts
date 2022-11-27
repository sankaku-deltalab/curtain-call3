import {pipe as rambdaPipe} from 'rambda';

type Rec = Record<string, unknown>;

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

  static remove<
    Key extends string,
    Val extends unknown,
    T extends Record<Key, Val>
  >(obj: T, removeKey: Key): T {
    const newObj = {...obj};
    delete newObj[removeKey];
    return newObj;
  }

  static removeMulti<
    Key extends string,
    Val extends unknown,
    T extends Record<Key, Val>
  >(obj: T, removeKeys: Key[]): T {
    const newObj = {...obj};
    for (const k of removeKeys) {
      delete newObj[k];
    }
    return newObj;
  }

  static range(start: number, stop: number): number[] {
    const values: number[] = [];
    for (let i = start; i < stop; i++) {
      values.push(i);
    }
    return values;
  }

  static merge<T extends Rec, T2 extends Rec>(obj1: T, obj2: T2): T & T2 {
    return {
      ...obj1,
      ...obj2,
    };
  }

  static mapObj<K extends string, V, V2>(
    obj: Record<K, V>,
    func: (value: V, key: K) => V2
  ): Record<K, V2> {
    return Im.pipe(
      () => obj,
      obj => Object.entries(obj) as [K, V][],
      pairs => pairs.map(([k, v]) => [k, func(v, k)]),
      pairs => Object.fromEntries(pairs)
    )();
  }

  static pipe = rambdaPipe;
}
