export type RecSet<T extends string = string> = Record<T, true | undefined>;

export class TRecSet {
  static new<T extends string>(keys: T[] = []): RecSet<T> {
    return Object.fromEntries(keys.map(k => [k, true])) as RecSet<T>;
  }

  static add<T extends string>(set: RecSet<T>, key: string): RecSet<T> {
    return {...set, [key]: true};
  }

  static remove<T extends string>(set: RecSet<T>, key: string): RecSet<T> {
    return {...set, [key]: undefined};
  }

  static has<T extends string>(set: RecSet<T>, key: T): boolean {
    return set[key] === true;
  }

  static iter<T extends string>(set: RecSet<T>): T[] {
    return Object.keys(set).filter(key => TRecSet.has(set, key as T)) as T[];
  }

  static filter<T extends string>(
    set: RecSet<T>,
    filter: (key: T) => boolean
  ): RecSet {
    const items = this.iter(set).filter(filter);
    return TRecSet.new(items);
  }
}
