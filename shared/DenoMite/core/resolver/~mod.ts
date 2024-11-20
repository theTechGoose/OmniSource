import type { ResolverCache } from "./helpers/cache/~mod.ts";
import {Reflect} from "@reflect"
import '@global_models';

export class Resolver {
  constructor(private cache: ResolverCache) {}
  private registry: AssortedInstances = [];

  register(cl: ConstructorInstance) {
    this.registry.push(cl);
  }

  replace(toReplace: Constructor, replaceWith: ConstructorInstance) {
    this.cache.replace(toReplace, replaceWith);
    return this
  }

  private findInRegistry(cl: Constructor) {
    return this.registry.find((c) => c === cl);
  }

   resolve(cl: Constructor): ConstructorInstance {
    const template = this.findInRegistry(cl);
    if(!template) throw new Error(`Class ${cl.name} not found in registry`);
    const cacheHit = this.cache.get(cl)
    if (cacheHit) return cacheHit;
    const params = this.getParams(cl);
    const output = new cl(...params);
    this.cache.add(output);
    return output;
  }

  private isNotInRegistry(cl: Constructor) {
    return !!this.registry.find((c) => c.constructor === cl);
  }

  getParams(target: FnOrCtr): Array<ConstructorInstance> {
    const paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
    return paramTypes.map((dep: Constructor) => {
      const found = this.cache.get(dep);
      if (found) return found;
      const resolved = this.resolve(dep);
      return resolved;
    });
  }
}

