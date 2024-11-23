/**
  * Wraps a function in a closure that will call the function with the arguments passed to the closure and the arguments passed to this function.
  * @param {Function} fn - The function to wrap in a closure.
  * @param {any[]} fnArgs - The arguments to pass to the function. these will be passed after the arguments passed to the closure.
  * @returns {Function} - A closure that calls the function with the arguments passed to the closure and the arguments passed to this function.
  **/
export function withClosure(fn: Function, ...fnArgs: Array<any>): Function {
  return (...args: Array<any>) => {
    return fn(...args, ...fnArgs);
  }
}




