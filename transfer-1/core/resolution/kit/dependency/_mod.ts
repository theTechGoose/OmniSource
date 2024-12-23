import { nanoid } from "#nanoid";
import {IPreparedDependency, IDependencyManifest, ExtendedConstructor, Constructor} from "@root/models.ts";

export class PreparedDependency implements IPreparedDependency {
  readonly id: string
  public _instance: unknown | null = null;
  get instance() {
    return this._instance;
  }
  constructor(
    public readonly target: ExtendedConstructor,
    public readonly parameters: Array<ExtendedConstructor>,
  ) {
    const _id = target.id
    const id = _id || nanoid();
    this.id = id;
  }

  buildInstance(registry: DependencyManifest) {
    if(this._instance) {
      console.log({message: 'skipping build', target: this.target.name})
      return this._instance;
    }
    const builtParams = this.parameters.map((param) => {
      const dep = registry.getDependencyById(param.id)
      if(!dep) return null;
      if(!dep.instance) dep.buildInstance(registry)
      return dep.instance;
    })
    console.log({target: this.target.name, builtParams}) 
    const instance = new this.target(...builtParams); 
    this._instance = instance;
    return instance;
  }

  buildManual(...params: Array<any>) {
    this._instance = new this.target(...params);
    return this
  }
}

export class DependencyManifest implements IDependencyManifest {
  private manifest: Array<PreparedDependency> = [];
  private ctx: any;
  constructor() {}

  forEach(fn: (dep: PreparedDependency) => void) {
    this.manifest.forEach(fn);
  }

  private checkForDupe(target: PreparedDependency) {
    const list = this.manifest.map((dep) => dep.id);
    const isDupe = list.includes(target.id);
    return isDupe
  }

  init() {
    this.manifest.forEach((dep) => {
      dep.buildInstance(this);
    })
  }

  addDependency(target: PreparedDependency) {
    if(this.checkForDupe(target)) return;
    this.manifest.push(target);
  }

  getDependencyById(id: string) {
    return this.manifest.find((dep) => dep.id === id);
  }

  getDependencyByConstructor(constructor: Constructor) {
    return this.manifest.find((dep) => dep.target === constructor);
  }
}
