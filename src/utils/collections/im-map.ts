import * as hamt from 'mini-hamt';
import {collectMiniHamtItems} from './mini-hamt-extension';
import {collectionTypes} from './collection-types';
import {Res, Result} from '../result';

const type = collectionTypes.map;

type Key = string;
type Value = unknown;

export type ImMap<K extends Key, V extends Value> = {
  type: typeof type;
  size: number;
  root: hamt.HamtNode<K, V>;
};

export class ImMapTrait {
  static new<K extends Key, V extends Value>(
    items?: Iterable<[K, V]>
  ): ImMap<K, V> {
    let map = hamt.empty as hamt.HamtNode<K, V>;
    for (const [k, v] of items ?? []) {
      map = hamt.set(map, k, v);
    }
    const keysSet = new Set(asArray(items ?? []).map(([k]) => k));
    return {type, size: keysSet.size, root: map};
  }

  static put<K extends Key, V extends Value>(
    map: ImMap<K, V>,
    key: K,
    value: V
  ): ImMap<K, V> {
    const mapHasKey = hamt.get(map.root, key) !== undefined;
    const size = map.size + (mapHasKey ? 0 : 1);
    return {type, size, root: hamt.set(map.root, key, value)};
  }

  static delete<K extends Key, V extends Value>(
    map: ImMap<K, V>,
    key: K
  ): ImMap<K, V> {
    const mapHasKey = hamt.get(map.root, key) !== undefined;
    if (!mapHasKey) return map;

    const size = map.size - 1;
    return {type, size, root: hamt.del(map.root, key)};
  }

  static fetch<K extends Key, V extends Value>(
    map: ImMap<K, V>,
    key: K
  ): Result<V> {
    const r = hamt.get(map.root, key);
    return r !== undefined ? Res.ok(r) : Res.err(`key "${key}" not in map`);
  }

  static update<K extends Key, V extends Value>(
    map: ImMap<K, V>,
    key: K,
    defaultVal: V,
    updater: (v: V) => V
  ): ImMap<K, V> {
    const maybeOldVal = ImMapTrait.fetch(map, key);
    if (maybeOldVal.err) return ImMapTrait.put(map, key, defaultVal);

    const newVal = updater(maybeOldVal.val);
    return ImMapTrait.put(map, key, newVal);
  }

  static items<K extends Key, V extends Value>(map: ImMap<K, V>): [K, V][] {
    return collectMiniHamtItems(map.root);
  }

  static keys<K extends Key, V extends Value>(map: ImMap<K, V>): K[] {
    return collectMiniHamtItems(map.root).map(([k, _v]) => k);
  }

  static values<K extends Key, V extends Value>(map: ImMap<K, V>): V[] {
    return collectMiniHamtItems(map.root).map(([_k, v]) => v);
  }

  static putMulti<K extends Key, V extends Value>(
    map: ImMap<K, V>,
    items: [K, V][]
  ): ImMap<K, V> {
    let m = map;
    for (const [k, v] of items) {
      m = ImMapTrait.put(m, k, v);
    }
    return m;
  }

  static deleteMulti<K extends Key, V extends Value>(
    map: ImMap<K, V>,
    keys: K[]
  ): ImMap<K, V> {
    let m = map;
    for (const k of keys) {
      m = ImMapTrait.delete(m, k);
    }
    return m;
  }
}

const asArray = <T>(ary: Iterable<T>): T[] => {
  if (Array.isArray(ary)) return ary;
  return [...ary];
};
