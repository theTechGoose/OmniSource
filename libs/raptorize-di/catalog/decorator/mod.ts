import { Constructor } from "../../reflect.ts";
import { PreparedDependency } from "../manifest/mod.ts";
import { λ } from "../../mod.ts";
import "#reflect";

export function Dependency() {
  return function<T extends Constructor>(target: T): T {
    if (typeof target !== "function") {
      throw new globalThis.Error("Decorator can only be applied to classes");
    }
    const params = globalThis.Reflect.getMetadata("design:paramtypes", target as unknown as object) ?? [];
    const dep = new PreparedDependency(target, params);
    λ.vault.manifest.addDependency(dep);
    globalThis.Object.defineProperty(target, "id", { value: dep.id, configurable: true });
    return target;
  };
}
