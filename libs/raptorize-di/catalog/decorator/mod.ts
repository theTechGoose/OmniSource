import { Reflect } from "../../deps.ts";
import { PreparedDependency } from "../../setup/manifest/mod.ts";
import { λ } from "../../setup/loader/mod.ts";

export function Dependency<T>(target: T) {
  const params = Reflect.getMetadata("design:paramtypes", target) ?? [];
  const dep = new PreparedDependency(target as any, params);
  λ.vault.manifest.addDependency(dep);
  return class {
    static id: string = dep.id;
    id: string = dep.id;
  } as T;
}
