import * as hamt from 'mini-hamt';
import {collectMiniHamtItems} from './mini-hamt-extension';

type Key = string;
type Value = undefined;

export type ImMap<K extends Key, V extends Value> = hamt.HamtNode<K, V>;

export class ImMapTrait {
  static new<K extends Key, V extends Value>(
    items?: Iterable<[K, V]>
  ): ImMap<K, V> {
    let map = hamt.empty as hamt.HamtNode<K, V>;
    for (const [k, v] of items ?? []) {
      map = hamt.set(map, k, v);
    }
    return map;
  }

  static put<K extends Key, V extends Value>(
    map: ImMap<K, V>,
    key: K,
    value: V
  ): ImMap<K, V> {
    return hamt.set(map, key, value);
  }

  static delete<K extends Key, V extends Value>(
    map: ImMap<K, V>,
    key: K
  ): ImMap<K, V> {
    return hamt.del(map, key);
  }

  static fetch<K extends Key, V extends Value, DefaultVal = undefined>(
    map: ImMap<K, V>,
    key: K,
    defaultVal: DefaultVal
  ): V | DefaultVal {
    const r = hamt.get(map, key);
    return r !== undefined ? r : defaultVal;
  }

  static items<K extends Key, V extends Value>(map: ImMap<K, V>): [K, V][] {
    return collectMiniHamtItems(map);
  }

  static keys<K extends Key, V extends Value>(map: ImMap<K, V>): K[] {
    return collectMiniHamtItems(map).map(([k, _v]) => k);
  }

  static values<K extends Key, V extends Value>(map: ImMap<K, V>): V[] {
    return collectMiniHamtItems(map).map(([_k, v]) => v);
  }
}
