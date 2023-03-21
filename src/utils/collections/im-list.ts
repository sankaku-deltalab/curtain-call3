import {collectionTypes} from './collection-types';

const type = collectionTypes.list;

export type ImList<T> = {
  type: typeof type;
  size: number;
  head?: ImListNode<T>;
};
export type ImListNode<T> = {v: T; next?: ImListNode<T>};

const empty: ImList<unknown> = {size: 0, type};

export class TImList {
  static new<T>(items?: Iterable<T>): ImList<T> {
    if (items === undefined) return empty as ImList<T>;

    let headMut: ImListNode<T> | undefined = undefined;
    let tailMut: ImListNode<T> | undefined = undefined;
    let size = 0;
    for (const item of items ?? []) {
      size += 1;
      const prevTail = tailMut;
      tailMut = {v: item};
      if (prevTail !== undefined) prevTail.next = tailMut;
      if (headMut === undefined) headMut = tailMut;
    }
    return {size: size, head: headMut, type};
  }

  static push<T>(list: ImList<T>, value: T): ImList<T> {
    return {
      size: list.size + 1,
      head: {v: value, next: list.head},
      type,
    };
  }

  static pop<T, DefaultVal>(
    list: ImList<T>,
    defaultVal: DefaultVal
  ): [T | DefaultVal, ImList<T>] {
    if (list.head === undefined) return [defaultVal, list];
    const oldHead = list.head;
    const newHead = list.head.next;
    return [oldHead.v, {size: list.size - 1, head: newHead, type}];
  }

  static toArray<T>(list: ImList<T>): T[] {
    if (list.head === undefined) return [];
    const items: T[] = Array(list.size);
    let i = 0;
    let node: ImListNode<T> | undefined = list.head;
    while (node !== undefined) {
      items[i] = node.v;
      i += 1;
      node = node.next;
    }
    return items;
  }

  static concat<T>(left: ImList<T>, right: ImList<T>): ImList<T> {
    if (left.head === undefined) return right;
    if (right.head === undefined) return left;

    const leftArray = TImList.toArray(left);
    const len = leftArray.length;
    let head = right.head;
    for (let i = len - 1; i >= 0; i -= 1) {
      head = {v: leftArray[i], next: head};
    }

    const newSize = left.size + right.size;
    return {
      size: newSize,
      head,
      type,
    };
  }

  static pushMulti<T>(list: ImList<T>, values: Iterable<T>): ImList<T> {
    let r = list;
    for (const v of values) {
      r = TImList.push(r, v);
    }
    return r;
  }

  static isEmpty<T>(list: ImList<T>): boolean {
    return list.head === undefined;
  }
}
