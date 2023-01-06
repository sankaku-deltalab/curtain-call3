import * as hamt from 'mini-hamt';

type Key = string;

export type ImSet<K extends Key> = hamt.HamtNode<K, true>;

export class ImSetTrait {
  static new<K extends Key>(items?: Iterable<K>): ImSet<K> {
    let map = hamt.empty as hamt.HamtNode<K, true>;
    for (const k of items ?? []) {
      map = hamt.set(map, k, true);
    }
    return map;
  }

  static put<K extends Key>(map: ImSet<K>, key: K): ImSet<K> {
    return hamt.set(map, key, true);
  }

  static delete<K extends Key>(map: ImSet<K>, key: K): ImSet<K> {
    return hamt.del(map, key);
  }

  static has<K extends Key>(map: ImSet<K>, key: K): boolean {
    const r = hamt.get(map, key);
    return r === true;
  }
}
