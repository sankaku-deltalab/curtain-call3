import {pipe as rambdaPipe} from 'rambda';

type Rec = Record<string, unknown>;

export class Im {
  static update<T extends Rec, Key extends keyof T>(
    obj: T,
    key: Key,
    updater: (prev: T[Key]) => T[Key]
  ): T {
    const newValue = updater(obj[key]);
    return {...obj, [key]: newValue};
  }

  static update_in2<
    Key1 extends string,
    Key2 extends string,
    T extends Record<Key1, Record<Key2, unknown>>
  >(
    obj: T,
    [key1, key2]: [Key1, Key2],
    updater: (prev: T[Key1][Key2]) => T[Key1][Key2]
  ): T {
    const newValue = updater(obj[key1][key2]);
    return Im.update(obj, key1, nestedObj => ({
      ...nestedObj,
      [key2]: newValue,
    }));
  }

  static update_in3<
    Key1 extends string,
    Key2 extends string,
    Key3 extends string,
    T extends Record<Key1, Record<Key2, Record<Key3, unknown>>>
  >(
    obj: T,
    [key1, key2, key3]: [Key1, Key2, Key3],
    updater: (prev: T[Key1][Key2][Key3]) => T[Key1][Key2][Key3]
  ): T {
    const newValue = updater(obj[key1][key2][key3]);
    return Im.update_in2(obj, [key1, key2], nestedObj => ({
      ...nestedObj,
      [key3]: newValue,
    }));
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
