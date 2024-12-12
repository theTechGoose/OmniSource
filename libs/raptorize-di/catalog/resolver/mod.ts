import { Constructor, ExtendedConstructor, IDependencyManifest } from "../../mod.ts";
import { PreparedDependency } from "../../setup/manifest/mod.ts";

export class Resolver {
  constructor(private manifest: IDependencyManifest) {}

  resolve<T>(target: Constructor<T>): T {
    const extendedTarget = target as ExtendedConstructor;
    const dep = this.manifest.getDependencyById(extendedTarget.id);
    if (!dep) {
      const newDep = new PreparedDependency(extendedTarget, []);
      this.manifest.addDependency(newDep);
      return newDep.buildInstance(this.manifest) as T;
    }
    return dep.instance as T;
  }

  resolveAll<T>(targets: Constructor<T>[]): T[] {
    return targets.map((target) => this.resolve(target));
  }
}
