import {Im} from './immutable-manipulation';
import {RecSet, TRecSet} from './rec-set';

/**
 * Record represents many to many relation.
 * If it has A to B relation, rel is {A: {B: true, ...}, ...}.
 */
export type RecM2M<
  T1 extends string = string,
  T2 extends string = string
> = Record<T1, RecSet<T2>>;

export class TRecM2M {
  static new<T1 extends string, T2 extends string>(): RecM2M<T1, T2> {
    return {} as RecM2M<T1, T2>;
  }

  static addRelation<T1 extends string, T2 extends string>(
    rel: RecM2M<T1, T2>,
    from: T1,
    to: T2
  ): RecM2M<T1, T2> {
    if (from in rel) {
      return Im.update(rel, from, opponents => TRecSet.add(opponents, to));
    }

    return Im.add(rel, from, TRecSet.new([to]));
  }

  static hasRelation<T1 extends string, T2 extends string>(
    rel: RecM2M<T1, T2>,
    from: T1,
    to: T2
  ): boolean {
    const opponents: RecSet | undefined = rel[from];
    if (opponents === undefined) {
      return false;
    }

    return to in opponents;
  }

  static fromPairs<T1 extends string, T2 extends string>(
    pairs: [T1, T2][]
  ): RecM2M<T1, T2> {
    return pairs.reduce(
      (rel, curr) => TRecM2M.addRelation(rel, curr[0], curr[1]),
      TRecM2M.new()
    );
  }

  static toPairs<T1 extends string, T2 extends string>(
    rel: RecM2M<T1, T2>
  ): [T1, T2][] {
    const entries = Object.entries(rel) as [T1, RecSet<T2>][];
    return entries.flatMap(([from, opponents]) => {
      return TRecSet.iter(opponents).map<[T1, T2]>(o => [from, o]);
    });
  }

  static merge<T1 extends string, T2 extends string>(
    a: RecM2M<T1, T2>,
    b: RecM2M<T1, T2>
  ): RecM2M<T1, T2> {
    const pairs = [...this.toPairs(a), ...this.toPairs(b)];
    return this.fromPairs(pairs);
  }

  static removeNonDestinations<T1 extends string, T2 extends string>(
    rel: RecM2M<T1, T2>
  ): RecM2M<T1, T2> {
    return Im.pipe(
      () => rel,
      r => Object.entries(r),
      r => r as [T1, RecSet<T2>][],
      r => r.filter(([_from, tos]) => !Object.is(tos, {})),
      r => Object.fromEntries(r) as RecM2M<T1, T2>
    )();
  }

  static filter<T1 extends string, T2 extends string>(
    rel: RecM2M<T1, T2>,
    filter: (from: T1, to: T2) => boolean
  ): RecM2M<T1, T2> {
    return Im.pipe(
      () => rel,
      r => this.toPairs(r),
      pairs => pairs.filter(([from, to]) => filter(from, to)),
      pairs => this.fromPairs(pairs)
    )();
  }
}
