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
