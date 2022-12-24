export type Key = string;
export type Value = unknown;

export type HamtMap<_K extends Key, _V extends Value> = {
  type: unknown;
  mask: unknown;
  children: unknown;
};

export declare const empty: HamtMap<Key, Value>;

export declare function get<K extends Key, V extends Value>(
  map: HamtMap<Key, V>,
  key: K
): V | undefined;

export declare function set<K extends Key, V extends Value>(
  map: HamtMap<Key, V>,
  key: K,
  value: V
): HamtMap<Key, V>;

export declare function del<K extends Key, V extends Value>(
  map: HamtMap<Key, V>,
  key: K
): HamtMap<Key, V>;
