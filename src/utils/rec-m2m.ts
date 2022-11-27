import {Im} from './immutable-manipulation';
import {RecSet, RecSetTrait} from './rec-set';

/**
 * Record represents many to many relation.
 * If it has A to B relation, rel is {A: {B: true, ...}, ...}.
 */
export type RecM2M = Record<string, RecSet>;

export class RecM2MTrait {
  static new(): RecM2M {
    return {};
  }

  static addRelation(rel: RecM2M, from: string, to: string): RecM2M {
    if (from in rel) {
      return Im.replace(rel, from, opponents => RecSetTrait.add(opponents, to));
    }

    return Im.add(rel, from, RecSetTrait.new([to]));
  }

  static hasRelation(rel: RecM2M, from: string, to: string): boolean {
    const opponents: RecSet | undefined = rel[from];
    if (opponents === undefined) {
      return false;
    }

    return to in opponents;
  }

  static fromPairs(pairs: [string, string][]): RecM2M {
    return pairs.reduce(
      (rel, curr) => RecM2MTrait.addRelation(rel, curr[0], curr[1]),
      RecM2MTrait.new()
    );
  }

  static toPairs(rel: RecM2M): [string, string][] {
    return Object.entries(rel).flatMap(([from, opponents]) => {
      return RecSetTrait.iter(opponents).map<[string, string]>(o => [from, o]);
    });
  }

  static merge(a: RecM2M, b: RecM2M): RecM2M {
    const pairs = [...this.toPairs(a), ...this.toPairs(b)];
    return this.fromPairs(pairs);
  }

  static removeNonDestinations(rel: RecM2M): RecM2M {
    return Im.pipe(
      () => rel,
      r => Object.entries(r),
      r => r.filter(([_from, tos]) => !Object.is(tos, {})),
      r => Object.fromEntries(r)
    )();
  }

  static filter(
    rel: RecM2M,
    filter: (from: string, to: string) => boolean
  ): RecM2M {
    return Im.pipe(
      () => rel,
      r => this.toPairs(r),
      pairs => pairs.filter(([from, to]) => filter(from, to)),
      pairs => this.fromPairs(pairs)
    )();
  }
}
