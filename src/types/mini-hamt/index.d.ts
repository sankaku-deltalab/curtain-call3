export type Key = string;
export type Value = unknown;

export type HamtNode<K extends Key, V extends Value> =
  | HamtLeaf<K, V>
  | HamtCollision<K, V>
  | HamtBranch<K, V>;

export type HamtLeaf<K extends Key, V extends Value> = {
  type: 'LEAF';
  code: unknown;
  key: K;
  value: V;
};

export type HamtCollision<K extends Key, V extends Value> = {
  type: 'COLLISION';
  code: unknown;
  children: HamtNode<K, V>[];
};

export type HamtBranch<K extends Key, V extends Value> = {
  type: 'BRANCH';
  mask: unknown;
  children: HamtNode<K, V>[];
};

export declare const empty: HamtNode<Key, Value>;

export declare function get<K extends Key, V extends Value>(
  map: HamtNode<K, V>,
  key: K
): V | undefined;

export declare function set<K extends Key, V extends Value>(
  map: HamtNode<K, V>,
  key: K,
  value: V
): HamtNode<K, V>;

export declare function del<K extends Key, V extends Value>(
  map: HamtNode<K, V>,
  key: K
): HamtNode<K, V>;
