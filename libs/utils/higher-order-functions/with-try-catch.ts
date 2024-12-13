type WithTryCatchReturn<T> = T extends Promise<infer U>
  ? Promise<[U | undefined, Error | null]>
  : [T | undefined, Error | null];

  /**
    * This function wraps a function in a try-catch block and returns the result and error.
    * @param cb - The function to wrap.
    * @returns - A tuple containing the result of the function and the error if one was thrown.
    * If the function returns a promise, the result will be a promise that resolves to the tuple.
    * If the function throws an error, the error will be an instance of Error. and the result will be null and vice versa.
    **/
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
