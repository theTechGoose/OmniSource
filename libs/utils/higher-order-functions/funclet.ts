type Funclet<V, F extends (...args: any[]) => any> = F & {
  vault: V;
};

/**
  * Creates a funclet from a function and a vault.
  * @param {F} fn - The function to convert to a funclet.
  * @param {V} vault - The vault to associate with the funclet, this is just a plain object.
  * It can be used to store data that the function needs to access.
  **/
export function createFunclet<V, F extends (...args: any[]) => any>(
  vault: V,
  fn: F,
): Funclet<V, F> {
  const funclet = function(this: unknown, ...args: Parameters<F>): ReturnType<F> {
    return fn.apply(this, args);
  } as Funclet<V, F>;
  funclet.vault = vault;
  return funclet;
}


