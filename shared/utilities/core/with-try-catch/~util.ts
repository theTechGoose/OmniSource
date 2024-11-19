type WithTryCatchReturn<T> = T extends Promise<infer U>
  ? Promise<[U | undefined, Error | null]>
  : [T | undefined, Error | null];

export function withTryCatch<T>(cb: () => Promise<T>): Promise<[T | undefined, Error | null]>;
export function withTryCatch<T>(cb: () => T): [T | undefined, Error | null];
export function withTryCatch<T>(cb: () => T): WithTryCatchReturn<T> {
  try {
    const result = cb();

    if (result instanceof Promise) {
      return result
        .then(
          (value) => [value, null] as [T, null],
          (error) => [undefined, error instanceof Error ? error : new Error(String(error))] as [undefined, Error]
        ) as WithTryCatchReturn<T>;
    } else {
      return [result, null] as WithTryCatchReturn<T>;
    }
  } catch (error) {
    return [undefined, error instanceof Error ? error : new Error(String(error))] as WithTryCatchReturn<T>;
  }
}
