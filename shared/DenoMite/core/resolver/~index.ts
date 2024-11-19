
class Resolver {
  constructor(private cache: ResolverCache) {}
  private registry: Array<any> = [];

  register(cl: any) {
    this.registry.push(cl);
  }

  replace(toReplace: any, replaceWith: any) {
    this.registry = this.registry.map((c) => c === toReplace ? replaceWith : c);
    this.cache.replace(toReplace, replaceWith);
    return this
  }

  resolve(cl: any) {
    const cacheHit = this.cache.get(cl);
    if (cacheHit) return cacheHit;
    const resolved = this._resolve(cl);
    this.cache.add(resolved);
    return resolved;
  }
  private _resolve() {}
  private getParams(constructor: any) {}
}

