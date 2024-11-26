import { λ } from "../kit/loader/_mod.ts";
import { PreparedDependency } from "../kit/dependency/_mod.ts";
import { Reflect } from "#reflect";

export function Dependency<T>(target: T) {
  const params = Reflect.getMetadata("design:paramtypes", target) ?? [];
  const dep = new PreparedDependency(target as any, params);
  λ.vault.manifest.addDependency(dep)
  return class {
    static id: string = dep.id;
    id: string = dep.id;
  } as T;
}
