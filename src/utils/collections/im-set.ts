import * as hamt from 'mini-hamt';
import {collectionTypes} from './collection-types';
import {collectMiniHamtItems} from './mini-hamt-extension';

const type = collectionTypes.set;

type Key = string;

export type ImSet<K extends Key> = {
  type: typeof type;
  size: number;
  root: hamt.HamtNode<K, true>;
};

export class TImSet {
  static new<K extends Key>(items?: Iterable<K>): ImSet<K> {
    let map = hamt.empty as hamt.HamtNode<K, true>;
    for (const k of items ?? []) {
      map = hamt.set(map, k, true);
    }
    const keysSet = new Set(asArray(items ?? []).map(([k]) => k));
    return {type, size: keysSet.size, root: map};
  }

  static put<K extends Key>(map: ImSet<K>, key: K): ImSet<K> {
    const mapHasKey = hamt.get(map.root, key) !== undefined;
    const size = map.size + (mapHasKey ? 0 : 1);
    return {type, size, root: hamt.set(map.root, key, true)};
  }

  static delete<K extends Key>(map: ImSet<K>, key: K): ImSet<K> {
    const mapHasKey = hamt.get(map.root, key) !== undefined;
    if (!mapHasKey) return map;

    const size = map.size - 1;
    return {type, size, root: hamt.del(map.root, key)};
  }

  static has<K extends Key>(map: ImSet<K>, key: K): boolean {
    const r = hamt.get(map.root, key);
    return r === true;
  }

  static keys<K extends Key>(map: ImSet<K>): K[] {
    return collectMiniHamtItems(map.root).map(([k, _v]) => k);
  }
}

const asArray = <T>(ary: Iterable<T>): T[] => {
  if (Array.isArray(ary)) return ary;
  return [...ary];
};
