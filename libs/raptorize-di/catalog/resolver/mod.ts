import type { Constructor, IDependencyManifest } from "../../mod.ts";
import { PreparedDependency } from "../manifest/mod.ts";

export class Resolver {
  constructor(private manifest: IDependencyManifest) {}

  resolve<T>(target: Constructor<T>): T {
    const dep = this.manifest.getDependencyById(target.id || "");
    if (!dep) {
      const newDep = new PreparedDependency(target, []);
      this.manifest.addDependency(newDep);
      return newDep.buildInstance(this.manifest) as T;
    }
    return dep.instance as T;
  }

  resolveAll<T>(targets: Constructor<T>[]): T[] {
    return targets.map((target) => this.resolve(target));
  }
}
