import {Im} from './immutable-manipulation';

export class Enum {
  static map<T, T2>(iter: Iterable<T>, converter: (v: T) => T2): T2[] {
    return [...iter].map(converter);
  }

  static filter: Filter = <T, T2 extends T>(
    iter: Iterable<T>,
    filter: ((v: T) => v is T2) | ((v: T) => boolean)
  ): T[] | T2[] => {
    return [...iter].filter(filter);
  };

  static reduce<T, Acc, Init extends Acc = Acc>(
    values: Iterable<T>,
    init: Init,
    updater: (x: T, acc: Acc) => Acc
  ): Acc {
    let acc: Acc = init;
    for (const v of values) {
      acc = updater(v, acc);
    }
    return acc;
  }

  static zip<T, T2>(iter1: T[], iter2: T2[]): [T, T2][] {
    if (iter1.length !== iter2.length)
      throw new Error('iter1 and iter2 length is not equal');

    return Im.pipe(
      () => Im.range(0, iter1.length),
      r => Enum.map<number, [T, T2]>(r, i => [iter1[i], iter2[i]])
    )();
  }
}

type Filter = {
  <T, T2 extends T>(iter: Iterable<T>, filter: (v: T) => v is T2): T2[];
  <T>(iter: Iterable<T>, filter: (v: T) => boolean): T[];
};
