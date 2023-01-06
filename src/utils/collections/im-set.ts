import * as hamt from 'mini-hamt';
import {collectionTypes} from './collection-types';

const type = collectionTypes.set;

type Key = string;

export type ImSet<K extends Key> = {
  type: typeof type;
  root: hamt.HamtNode<K, true>;
};

export class ImSetTrait {
  static new<K extends Key>(items?: Iterable<K>): ImSet<K> {
    let map = hamt.empty as hamt.HamtNode<K, true>;
    for (const k of items ?? []) {
      map = hamt.set(map, k, true);
    }
    return {type, root: map};
  }

  static put<K extends Key>(map: ImSet<K>, key: K): ImSet<K> {
    return {type, root: hamt.set(map.root, key, true)};
  }

  static delete<K extends Key>(map: ImSet<K>, key: K): ImSet<K> {
    return {type, root: hamt.del(map.root, key)};
  }

  static has<K extends Key>(map: ImSet<K>, key: K): boolean {
    const r = hamt.get(map.root, key);
    return r === true;
  }
}
