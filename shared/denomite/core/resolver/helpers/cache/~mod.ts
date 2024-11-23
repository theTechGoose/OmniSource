import "@global_models";
import {metadataKeys} from "@root/constants.ts";
import { Reflect } from "@reflect";

interface CacheToken<T extends Constructor = any> {
  constructor: T;
  value: ConstructorInstance<T>;
}

export class ResolverCache {
  private cache: Array<CacheToken> = [];
  state = () => this.cache;

  add<T extends ConstructorInstance>(...cl: Array<T>): ResolverCache {
    const filtered = cl.filter((c) =>
      !this.isNotCacheable(this.extractConstructors(c).first)
    );

    const alreadyCached = this.checkForAlreadyCached(cl);
    
    if (alreadyCached.length) {
      throw new Error(
        `Classes ${alreadyCached.map((c) => c.name).join(", ")} already cached`,
      );
    }
    const constructed = filtered.map(this.constructToken.bind(this));
    this.cache = [...this.cache, ...constructed];
    return this;
  }

  replace<T>(constructor: Constructor<T>, withValue: T): ResolverCache {
    if (this.isNotCacheable(constructor)) return this;
    this.cache = this.cache.map((cl) => {
      const condition = cl.constructor === constructor
      if (condition) {
        return this.constructToken(withValue, constructor);
      }
      return cl;
    });
    return this;
  }

  constructToken(instance: ConstructorInstance): CacheToken;
  constructToken(
    instance: ConstructorInstance,
    override?: Constructor,
  ): CacheToken;
  constructToken(
    instance: ConstructorInstance,
    override?: Constructor,
  ): CacheToken {
    return {
      constructor: override ? override : this.extractConstructors(instance).first,
      value: instance,
    };
  }

  extractConstructors(...cls: Array<ConstructorInstance>) { 
    const output =  cls.map(c => c.constructor);
    const out = {
      first: output[0] ?? [],
      all: output,
    }
    return out
  }

  checkForAlreadyCached(
    constructors: Array<ConstructorInstance>,
  ): Array<ConstructorInstance> {
    return constructors.filter((c) => {
      const touples = this.cache.map((cl) => this.extractConstructors(c, cl).all);
      return touples.some((t) => {
        const [compareValue, cachedValue] = t;
        return compareValue === cachedValue
      })
    });
  }

  get(constructor: Constructor) {
    if (this.isNotCacheable(constructor)) return null;
     const idx = this.cache.findIndex((cl) => cl.constructor === constructor);
     if(idx === -1) return null;
     const cacheToken = this.cache[idx];
     return cacheToken.value;
  }

  isNotCacheable(cl: Constructor): boolean {
    return Reflect.getMetadata(metadataKeys.isNotCacheable, cl);
  }
}
