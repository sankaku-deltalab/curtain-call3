import {ImStructTrait} from '../../../../src/utils/collections/im-struct';

describe('ImStructTrait.new', (): void => {
  test('can create struct from object', (): void => {
    const struct = ImStructTrait.new({a: 1, b: '2'});
    const actual = ImStructTrait.toObject(struct);

    expect(actual).toEqual({a: 1, b: '2'});
  });
});

describe('ImStructTrait.put', (): void => {
  test('put value to head', (): void => {
    const struct = ImStructTrait.new({a: 1, b: '2'});
    const actual = ImStructTrait.put(struct, 'a', 2);

    expect(ImStructTrait.toObject(actual)).toEqual({a: 2, b: '2'});
  });

  test('put value to unassigned key', (): void => {
    const items: {a?: number; b: string} = {b: '2'};
    const struct = ImStructTrait.new(items);
    const actual = ImStructTrait.put(struct, 'a', 2);

    expect(ImStructTrait.toObject(actual)).toEqual({a: 2, b: '2'});
  });
});

describe('ImStructTrait.fetch', (): void => {
  test('fetch value', (): void => {
    const struct = ImStructTrait.new({a: 1, b: '2'});
    const fetched = ImStructTrait.fetch(struct, 'a');

    expect(fetched).toBe(1);
  });
});

describe('ImStructTrait.update', (): void => {
  test('update value', (): void => {
    const struct = ImStructTrait.new({a: 1, b: '2'});
    const actual = ImStructTrait.update(struct, 'a', v => v + 1);

    expect(ImStructTrait.toObject(actual)).toEqual({a: 2, b: '2'});
  });
});

describe('ImStructTrait.items', (): void => {
  test('get items from struct', (): void => {
    const struct = ImStructTrait.new({a: 1, b: '2'});
    const itemsUnsorted = ImStructTrait.items(struct);
    const itemsSorted = [...itemsUnsorted].sort((left, right) =>
      left[0].localeCompare(right[0])
    );

    const expected = [
      ['a', 1],
      ['b', '2'],
    ];
    expect(itemsSorted).toEqual(expected);
  });
});

describe('ImStructTrait.keys', (): void => {
  test('get keys from struct', (): void => {
    const struct = ImStructTrait.new({a: 1, b: '2'});
    const keysUnsorted = ImStructTrait.keys(struct);
    const keysSorted = [...keysUnsorted].sort((left, right) =>
      left.localeCompare(right)
    );

    const expected = ['a', 'b'];
    expect(keysSorted).toEqual(expected);
  });
});

describe('ImStructTrait.values', (): void => {
  test('get keys from struct', (): void => {
    const struct = ImStructTrait.new({a: '1', b: '2'});
    const valuesUnsorted = ImStructTrait.values(struct);
    const valuesSorted = [...valuesUnsorted].sort((left, right) =>
      left.localeCompare(right)
    );

    const expected = ['1', '2'];
    expect(valuesSorted).toEqual(expected);
  });
});

describe('ImStructTrait.putMulti', (): void => {
  test('put value with Object', (): void => {
    const struct = ImStructTrait.new({a: 1, b: '2', c: 3});
    const actual = ImStructTrait.putMulti(struct, {a: 2, b: 'b'});

    expect(ImStructTrait.toObject(actual)).toEqual({a: 2, b: 'b', c: 3});
  });
});
