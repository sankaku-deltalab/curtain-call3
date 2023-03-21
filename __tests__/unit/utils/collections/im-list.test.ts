import {TImList} from '../../../../src/utils/collections/im-list';

describe('ImListTrait.new', (): void => {
  test('can create empty ImList', (): void => {
    const list = TImList.new();
    const actual = TImList.toArray(list);

    expect(actual).toEqual([]);
  });

  test('can create ImList from array', (): void => {
    const list = TImList.new([1, 2, 3]);
    const actual = TImList.toArray(list);

    expect(actual).toEqual([1, 2, 3]);
  });
});

describe('ImListTrait.push', (): void => {
  test('add element to head', (): void => {
    const list = TImList.new([1, 2, 3]);
    const element = 0;

    const actual = TImList.push(list, element);
    expect(TImList.toArray(actual)).toEqual([0, 1, 2, 3]);
  });

  test('add element to empty ImList', (): void => {
    const list = TImList.new();
    const element = 0;

    const actual = TImList.push(list, element);
    expect(TImList.toArray(actual)).toEqual([0]);
  });
});

describe('ImListTrait.pop', (): void => {
  test('pop element from head', (): void => {
    const list = TImList.new([1, 2, 3]);

    const [gotten, newList] = TImList.pop(list, undefined);

    expect(gotten).toBe(1);
    expect(TImList.toArray(newList)).toEqual([2, 3]);
  });

  test('give default value and empty ImList if given list is empty', (): void => {
    const list = TImList.new();
    const defaultVal = 123;

    const [gotten, newList] = TImList.pop(list, defaultVal);

    expect(gotten).toBe(defaultVal);
    expect(TImList.toArray(newList)).toEqual([]);
  });
});

describe('ImListTrait.concat', (): void => {
  test('can concatenate two list', (): void => {
    const left = TImList.new([1, 2, 3]);
    const right = TImList.new([4, 5, 6]);

    const actual = TImList.concat(left, right);
    expect(TImList.toArray(actual)).toEqual([1, 2, 3, 4, 5, 6]);
  });

  test('return right if left is empty', (): void => {
    const left = TImList.new();
    const right = TImList.new([4, 5, 6]);

    const actual = TImList.concat(left, right);
    expect(actual).toBe(right);
  });

  test('return left if right is empty', (): void => {
    const left = TImList.new([1, 2, 3]);
    const right = TImList.new();

    const actual = TImList.concat(left, right);
    expect(actual).toBe(left);
  });
});

describe('ImListTrait.pushMulti', (): void => {
  test('push values in iterable', (): void => {
    const list = TImList.new();
    const values = [1, 2, 3];

    const actual = TImList.pushMulti(list, values);
    expect(TImList.toArray(actual)).toEqual([3, 2, 1]);
  });
});

describe('ImListTrait.isEmpty', (): void => {
  test('return right if list is empty', (): void => {
    const list = TImList.new();
    expect(TImList.isEmpty(list)).toBe(true);
  });

  test('return false if list is not empty', (): void => {
    const list = TImList.new([1]);
    expect(TImList.isEmpty(list)).toBe(false);
  });
});
