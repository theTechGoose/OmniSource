// Core types for dependency injection
export interface Constructor<T = any> {
  new (...args: any[]): T;
  id?: string;
}

export interface ExtendedConstructor extends Constructor {
  id: string;
}

export interface IDependencyManifest {
  forEach(fn: (dep: IPreparedDependency) => void): void;
  init(): void;
  addDependency(target: IPreparedDependency): void;
  getDependencyById(id: string): IPreparedDependency | undefined;
  getDependencyByConstructor(constructor: Constructor): IPreparedDependency | undefined;
}

export interface IPreparedDependency {
  readonly id: string;
  instance: unknown;
  buildInstance(registry: IDependencyManifest): unknown;
  buildManual(...params: any[]): this;
}

// Re-export all module components
export * from "./catalog/decorator/mod.ts";
export * from "./catalog/resolver/mod.ts";
export * from "./setup/manifest/mod.ts";
export * from "./setup/loader/mod.ts";
