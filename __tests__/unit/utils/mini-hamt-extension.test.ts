import * as hamt from 'mini-hamt';
import {collectMiniHamtItems} from '../../../src/utils/mini-hamt-extension';

const items: [string, number][] = Array(500)
  .fill(0)
  .map((_, i) => [i.toString(), i]);

describe('mini-hamt-extension.collectMiniHamtItems', (): void => {
  test('can collect items correctly', (): void => {
    let map = hamt.empty as hamt.HamtNode<string, unknown>;
    for (const [k, v] of items) {
      map = hamt.set(map, k, v);
    }

    let deletedCount = 0;
    const delKeys = [0, 14, 54, 49, 74].map(i => i.toString());
    for (const delKey of delKeys) {
      map = hamt.del(map, delKey);
      deletedCount += 1;
      const collected = collectMiniHamtItems(map).map(([k]) => k);

      const expectedLength = items.length - deletedCount;
      expect(collected).toHaveLength(expectedLength);
    }
  });
});
