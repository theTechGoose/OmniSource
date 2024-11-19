import { container, type InjectionToken } from "npm:tsyringe";
import { resolveWithDependencies } from "@shared";
import {nanoid} from "npm:nanoid"
import { withClosure, withTryCatch } from "../../utilities/mod.ts";


type ArrayArgs<A = unknown[]> = A extends unknown[] ? A : never;
type ClassType<T = any, Args extends ArrayArgs = any> = (new (...args: Args) => T)
type WithLabel<T extends ClassType = any> = T & { label?: string};
type ResolverFunction = <T extends ClassType = any>(cl: WithLabel<T>,) => InstanceType<T>;
type ResolverCacheFunction = <T extends ClassType>( cl: WithLabel<T>,) => InstanceType<T> | undefined;
interface DangerousResolver<T extends ClassType> {
  get: () => InstanceType<T>;
  resolver: Resolver;
}

let currentInstance = null as Resolver | null;
const classMap: Array<{class: any, label: string}> = [] 

function resolveToken(cl: WithLabel, label: string) {
  const token = classMap.find((c) => c.label === label)?.class;
  if(token) return token;
  const isDupe = classMap.find((c) => c.class === cl);
  if(!isDupe) classMap.push({class: cl, label});
  return cl;
}



export class Resolver {
  static resolveWithCurrentInstance__Danger__<T extends ClassType>(cl?: T): DangerousResolver<T> {
    const resolver = currentInstance ? currentInstance : new Resolver();
    return {
      resolver,
      get: () => {
        if (!cl) throw new Error('No class provided')
        return resolver.resolve(cl)
      }
    };
  }

  private cache: Array<unknown> = [];

  constructor() {
    currentInstance = this;
  }

  replace<T extends ClassType>(key: string | T, value: WithLabel<T>, data?: unknown) {
    //container.register(key, { useFactory: resolveWithDependencies(value, data) });
    //const instance = resolveWithDependencies(value, data)();
    //const idx = this.cache.findIndex((c) => c instanceof value);
    //if (idx !== -1) this.cache[idx] = instance;
    //this.cache.push(instance);
  }

  resolve: ResolverFunction = (cl) => {
    const cacheHit = this.lookInCache(cl)
    if (cacheHit) return cacheHit;
    const resolved = this._resolve(cl);
    this.saveInCache(resolved);
    return resolved;
  };

  add<T extends ClassType>(cl: string | WithLabel<T> , data = {}): void | (() => void) {
    const isString = typeof cl === 'string';
    const label = isString ? cl : nanoid();
    if(isString) return withClosure(this.register, label, data)
      else return this.register(cl, label, data);
  }

  private register(cl: WithLabel, label: string,  data = {} as any) {
    const token = resolveToken(cl, label);
    container.register(token, { useFactory: resolveWithDependencies(cl, data) });
  }


  private _resolve: ResolverFunction = (cl) => {
    const token = resolveToken(cl, cl.label ?? nanoid());
    const [value, error] = withTryCatch(() => {
        return container.resolve(token) as InstanceType<typeof cl>;
    }) 
    if(!value)  {
      console.log({token, value, classMap})
      throw error;
    }
    return value;
  };

  private saveInCache(cl: unknown) {
    this.cache.push(cl);
  }

  private lookInCache: ResolverCacheFunction = (cl: WithLabel) => {
    return this.cache.find((c) => c instanceof cl) as InstanceType<typeof cl> | undefined;
  };
}
