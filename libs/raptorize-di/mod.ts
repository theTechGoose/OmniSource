import {createFunclet} from "@shared/utils";
import "#reflect";
import { DependencyManifest, PreparedDependency } from "./catalog/manifest/mod.ts";

const manifest = new DependencyManifest();

export const λ = createFunclet(manifest, <T extends Constructor>(_target: T): InstanceType<T> => {
  const target = _target as unknown as ExtendedConstructor
  const dep = λ.vault.getDependencyById(target.id)
  if(!dep) throw new Error(`Dependency not found: ${target.id}`)
  return dep.instance as InstanceType<T>
})

export function Dependency<T extends Object>(target: T) {
  const params = Reflect.getMetadata("design:paramtypes", target) ?? [];
  const dep = new PreparedDependency(target as any, params);
  λ.vault.addDependency(dep);

  return class {
    static id: string = dep.id;
    id: string = dep.id;
  } as unknown as T & { id: string };
}
