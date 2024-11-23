
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
  fn: F,
  vault: V,
): Funclet<V, F> {
  const funclet = fn as Funclet<V, F>;
  funclet.vault = vault;
  return funclet;
}


