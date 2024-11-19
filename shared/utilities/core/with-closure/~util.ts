export function withClosure(fn: Function, ...fnArgs: Array<any>) {
  return (...args: Array<any>) => {
    return fn.call(this, ...[...args, ...fnArgs]);
  }
}

