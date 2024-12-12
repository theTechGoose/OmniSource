import { createFunclet } from "../../../utilities/higher-order-functions/mod.ts";
import { DependencyManifest } from "../manifest/mod.ts";
import { Constructor, ExtendedConstructor } from "../../mod.ts";

const manifest = new DependencyManifest();

const vault = {
  manifest,
};

export const λ = createFunclet(vault, <T extends Constructor>(_target: T): InstanceType<T> => {
  const target = _target as unknown as ExtendedConstructor;
  const dep = λ.vault.manifest.getDependencyById(target.id);
  if (!dep) throw new Error(`Dependency not found: ${target.id}`);
  return dep.instance as InstanceType<T>;
});
