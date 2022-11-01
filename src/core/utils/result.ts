// clone of ts-result and https://imhoff.blog/posts/using-results-in-typescript
// ts-result is usable but not serializable

export type Result<T, E = unknown> = Ok<T> | Err<E>;

type Ok<T> = {ok: true; err: false; val: T};
type Err<E> = {ok: false; err: true; val: E};

export class Res {
  static ok<T>(val: T): Result<T, never> {
    return {ok: true, err: false, val};
  }

  static err<E>(error: E): Result<never, E> {
    return {ok: false, err: true, val: error};
  }

  static isOk<T>(r: Result<T, unknown>): r is Ok<T> {
    return r.ok;
  }

  static isErr<E>(r: Result<unknown, E>): r is Err<E> {
    return r.err;
  }

  static unwrap<T>(result: Ok<T>): T {
    return result.val;
  }

  static unsafeUnwrap<T>(result: Result<T, unknown>): T {
    if (result.err) {
      const errObj =
        result.val instanceof Error
          ? result.val
          : new Error(`unwrap failed. value: ${result.val}`);
      throw errObj;
    }
    return result.val;
  }

  static unwrapOr<T>(result: Result<T, unknown>, optional: T): T {
    if (result.err) {
      return optional;
    }
    return result.val;
  }

  static onlyOk<T>(results: Result<T, unknown>[]): T[] {
    return results.filter(Res.isOk).map(r => r.val);
  }

  static errIfUndefined<T, E>(val: T | undefined, err: E): Result<T, E> {
    if (val === undefined) {
      return Res.err(err);
    }
    return Res.ok(val);
  }
}
