import {createFunclet} from "@shared/utils";
import {DependencyManifest} from "../dependency/_mod.ts";
import { Constructor, ExtendedConstructor } from "@root/models.ts";

const manifest = new DependencyManifest();

const vault = {
  manifest
} 

export const λ = createFunclet(vault, <T extends Constructor>(_target: T): InstanceType<T> => {
  const target = _target as unknown as ExtendedConstructor
  const dep = λ.vault.manifest.getDependencyById(target.id)
  if(!dep) throw new Error(`Dependency not found: ${target.id}`)
  return dep.instance as InstanceType<T>
})
