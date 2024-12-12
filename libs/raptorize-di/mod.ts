import { createFunclet } from "../../libs/utilities/higher-order-functions/mod.ts";
import { DependencyManifest } from "./catalog/manifest/mod.ts";
import { PreparedDependency } from "./catalog/manifest/mod.ts";
import "#reflect";

// Initialize core dependencies
const manifest = new DependencyManifest();
manifest.init();
const vault = { manifest };

interface DependencyVault {
  manifest: DependencyManifest;
}

// Lambda for dependency resolution
export const λ = createFunclet<DependencyVault, (...args: any[]) => any>(
  vault,
  function(...args: any[]): any {
    const constructor = args[0];
    if (typeof constructor !== "function" || !constructor.name) {
      throw new globalThis.Error("Lambda requires a constructor argument");
    }
    const dep = λ.vault.manifest.getDependencyByConstructor(constructor as Constructor);
    if (!dep) {
      throw new globalThis.Error(`Dependency not found for ${constructor.name}`);
    }
    if (!dep.instance) {
      return dep.buildInstance(λ.vault.manifest);
    }
    return dep.instance;
  }
);

// Core interfaces
export interface IDependencyManifest {
  forEach(fn: (dep: IPreparedDependency) => void): void;
  init(): void;
  addDependency(target: IPreparedDependency): void;
  getDependencyById(id: string): IPreparedDependency | undefined;
  getDependencyByConstructor(constructor: Constructor): IPreparedDependency | undefined;
}

export interface IPreparedDependency {
  readonly id: string;
  instance?: unknown;  // Make instance mutable and optional
  buildInstance(registry: IDependencyManifest): unknown;
  buildManual(...params: any[]): this;
}

// Re-export module components
export * from "./catalog/decorator/mod.ts";
export * from "./catalog/manifest/mod.ts";
export * from "./catalog/resolver/mod.ts";
export * from "./catalog/loader/mod.ts";

// Re-export global types for convenience
export type { Constructor };
