import * as hamt from 'mini-hamt';
import {collectMiniHamtItems} from './mini-hamt-extension';
import {collectionTypes} from './collection-types';

const type = collectionTypes.struct;

type Rec = Record<string, unknown>;
type Keyof<Items extends Rec> = keyof Items & string;

export type ImStruct<Items extends Rec> = {
  type: typeof type;
  root: hamt.HamtNode<Keyof<Items>, Items[keyof Items]>;
};

export class TImStruct {
  static new<Items extends Rec>(items: Items): ImStruct<Items> {
    let map = hamt.empty as hamt.HamtNode<Keyof<Items>, Items[keyof Items]>;
    for (const k in items) {
      const v = items[k];
      map = hamt.set(map, k, v);
    }
    return {type, root: map};
  }

  static put<Items extends Rec, Key extends Keyof<Items>>(
    map: ImStruct<Items>,
    key: Key,
    value: Items[Key]
  ): ImStruct<Items> {
    return {
      type,
      root: hamt.set(map.root, key, value),
    };
  }

  static fetch<Items extends Rec, Key extends Keyof<Items>>(
    map: ImStruct<Items>,
    key: Key
  ): Items[Key] {
    const r = hamt.get(map.root, key) as Items[Key];
    return r;
  }

  static update<Items extends Rec, Key extends Keyof<Items>>(
    map: ImStruct<Items>,
    key: Key,
    updater: (v: Items[Key]) => Items[Key]
  ): ImStruct<Items> {
    const oldVal = TImStruct.fetch(map, key);
    const newVal = updater(oldVal);
    return TImStruct.put(map, key, newVal);
  }

  static items<Items extends Rec>(
    map: ImStruct<Items>
  ): [Keyof<Items>, Items[Keyof<Items>]][] {
    return collectMiniHamtItems(map.root) as [
      Keyof<Items>,
      Items[Keyof<Items>]
    ][];
  }

  static toObject<Items extends Rec>(map: ImStruct<Items>): Items {
    return Object.fromEntries(collectMiniHamtItems(map.root)) as Items;
  }

  static keys<Items extends Rec>(map: ImStruct<Items>): Keyof<Items>[] {
    return collectMiniHamtItems(map.root).map(([k, _v]) => k);
  }

  static values<Items extends Rec>(
    map: ImStruct<Items>
  ): Items[Keyof<Items>][] {
    return collectMiniHamtItems(map.root).map(
      ([_k, v]) => v
    ) as Items[Keyof<Items>][];
  }

  static putMulti<Items extends Rec>(
    map: ImStruct<Items>,
    items: Partial<Items>
  ): ImStruct<Items> {
    let m = map;
    for (const [k, v] of Object.entries(items)) {
      m = TImStruct.put(m, k, v);
    }
    return m;
  }
}
