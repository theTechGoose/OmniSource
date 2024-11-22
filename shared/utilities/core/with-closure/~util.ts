export function withClosure(fn: Function, ...fnArgs: Array<any>) {
  return (...args: Array<any>) => {

    //@ts-ignore
    return fn.call(this, ...[...args, ...fnArgs]);
  }
}

