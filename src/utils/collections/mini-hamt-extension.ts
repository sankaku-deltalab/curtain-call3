import {Key, Value, HamtNode} from 'mini-hamt';

export const collectMiniHamtItems = <K extends Key, V extends Value>(
  map: HamtNode<K, V>
): [K, V][] => {
  const visited = new Set<HamtNode<K, V>>();
  nodeVisit(map, visited);

  const collected: [K, V][] = [];
  for (const node of visited.values()) {
    if (node.type !== 'LEAF') continue;
    collected.push([node.key, node.value]);
  }

  return collected;
};

// Dijkstra-like style
// Is this correct? I don't know...
const nodeVisit = <K extends Key, V extends Value>(
  node: HamtNode<K, V>,
  visited: Set<HamtNode<K, V>>
): void => {
  if (visited.has(node)) return;
  visited.add(node);

  if (node.type === 'LEAF') return;

  for (const n of node.children) {
    nodeVisit(n, visited);
  }
};
