export type ImList<T> = {size: number; head?: ImListNode<T>};
export type ImListNode<T> = {v: T; next?: ImListNode<T>};

const empty: ImList<unknown> = {size: 0};

export class ImListTrait {
  static new<T>(items?: Iterable<T>): ImList<T> {
    if (items === undefined) return empty as ImList<T>;

    let head: ImListNode<T> | undefined = undefined;
    let size = 0;
    for (const item of items ?? []) {
      size += 1;
      head = {v: item, next: head};
    }
    return {size: size, head};
  }

  static push<T>(list: ImList<T>, value: T): ImList<T> {
    return {
      size: list.size + 1,
      head: {v: value, next: list.head},
    };
  }

  static pop<T, DefaultVal>(
    list: ImList<T>,
    defaultVal: DefaultVal
  ): [T | DefaultVal, ImList<T>] {
    if (list.head === undefined) return [defaultVal, list];
    const oldHead = list.head;
    const newHead = list.head.next;
    return [oldHead.v, {size: list.size - 1, head: newHead}];
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

    const leftArray = ImListTrait.toArray(left);
    const len = leftArray.length;
    let head = right.head;
    for (let i = len; i >= 0; i -= 1) {
      head = {v: leftArray[i], next: head};
    }

    const newSize = left.size + right.size;
    return {
      size: newSize,
      head,
    };
  }

  static pushMulti<T>(list: ImList<T>, values: Iterable<T>): ImList<T> {
    let r = list;
    for (const v of values) {
      r = ImListTrait.push(r, v);
    }
    return r;
  }

  static isEmpty<T>(list: ImList<T>): boolean {
    return list.head === undefined;
  }
}