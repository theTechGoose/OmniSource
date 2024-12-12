import { nanoid } from "#nanoid";


export class PreparedDependency {
  readonly id: string;
  private _instance: unknown | null = null;

  get instance() {
    return this._instance;
  }

  constructor(
    public readonly target: Constructor,
    public readonly parameters: Array<Constructor>,
  ) {
    const _id = target.id;
    const id = _id || nanoid();
    this.id = id;
  }

  buildInstance(registry: DependencyManifest) {
    if (this._instance) {
      return this._instance;
    }
    const builtParams = this.parameters.map((param) => {
      const dep = registry.getDependencyByConstructor(param);
      if (!dep) return null;
      if (!dep.instance) dep.buildInstance(registry);
      return dep.instance;
    });
    const instance = new this.target(...builtParams);
    this._instance = instance;
    return instance;
  }

  buildManual(...params: Array<any>) {
    this._instance = new this.target(...params);
    return this;
  }
}

export class DependencyManifest implements DependencyManifest {
  private manifest: Array<PreparedDependency> = [];

  forEach(fn: (dep: PreparedDependency) => void) {
    this.manifest.forEach(fn);
  }

  private checkForDupe(target: PreparedDependency) {
    const list = this.manifest.map((dep) => dep.id);
    return list.includes(target.id);
  }

  init() {
    this.manifest.forEach((dep) => {
      dep.buildInstance(this);
    });
  }

  addDependency(target: PreparedDependency) {
    if (this.checkForDupe(target)) return;
    this.manifest.push(target);
  }

  getDependencyById(id: string) {
    return this.manifest.find((dep) => dep.id === id);
  }

  getDependencyByConstructor(constructor: Constructor) {
    return this.manifest.find((dep) => dep.target === constructor);
  }
}
