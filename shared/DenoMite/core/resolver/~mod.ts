import "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { ResolverCache } from "./helpers/cache/~mod.ts";
import { Ctx } from "../../builtins/~index.ts";
import { extractLoadedClasses } from "./helpers/loader/mod.ts";
import { Reflect } from "@reflect";
import {dependencies} from '../server/~mod.ts'
import "@global_models";

export class _Resolver {
  injectFn: (target: any) => any = null as any;
  constructor(private cache: ResolverCache) {}
  protected registry: AssortedInstances = [];

  __DANGER__SELF_REGISTER_TESTS_ONLY() {
    dependencies.forEach(d => this.register(d))
  }

  register(cl: ConstructorInstance) {
    this.registry.push(cl);
  }

  replace(toReplace: Constructor, replaceWith: ConstructorInstance) {
    this.cache.replace(toReplace, replaceWith);
    return this;
  }

  private findInRegistry(cl: Constructor) {
    return this.registry.find((c) => c === cl);
  }

  captureCtx(ctx: any) {
    this.register(Ctx);
    this.cache.add(new Ctx(ctx));
    this.injectFn = (target: any) => {
      return this.inject(target);
    };
    return this.injectFn;
  }

  private inject<T extends (...args: any[]) => any>(target: T): () => T {
    const params = this.getParams(target);
    return () => target(...params);
  }

  resolve<T extends Constructor>(cl: T): ConstructorInstance<T> {
    const template = this.findInRegistry(cl);
    if (!template) throw new Error(`Class ${cl.name} not found in registry`);
    const cacheHit = this.cache.get(cl);
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
    let paramTypes = Reflect.getMetadata("design:paramtypes", target) || [];
    console.log({paramTypes, target})
    if (!paramTypes.length) paramTypes = this.paramIdentifier(target);
    return paramTypes.map((dep: Constructor) => {
      const resolved = this.resolve(dep);
      return resolved;
    });
  }

  paramIdentifier(target: FnOrCtr) {
    const names = extractLoadedClasses(target);
    const params = names.map((n) => {
      return this.registry.find((r) => {
        return r.name === n;
      });
    });
    return params;
  }
}

export class Resolver extends _Resolver {
  constructor() {
    super(new ResolverCache());
  }
}
