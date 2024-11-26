
// INTERFACE MUST BE STATIC
// T MUST BE PASSED AS "TYPEOF"
export type I<T extends {interface: Constructor}> = InstanceType<T['interface']>;

export interface ICtx<T> {
  [key: string]: any;
  body: any;
  root: T
}

export type Middleware<T = any> = (context: T) => void;

export interface AdapterInstance {
  createEndpoint(method: string, route: string, callback: Function, auth: Function): void;
  addMiddleware(m: Middleware): void;
  finalize(): Promise<void>;
}

export interface Auth {
  canActivate(ctx: any): boolean;
}

export interface IPreparedDependency {
  readonly id: string;
  readonly target: Constructor;
  readonly parameters: Array<Constructor>;
  readonly instance: unknown | null;
  buildManual(...params: Array<any>): IPreparedDependency;
}

export interface IDependencyManifest {
  forEach(fn: (dep: IPreparedDependency) => void): void;
  init(): void;
  addDependency(target: IPreparedDependency): void;
  getDependencyById(id: string): IPreparedDependency | undefined;
  getDependencyByConstructor(constructor: Constructor): IPreparedDependency | undefined;
}

export interface LoaderFn<T> {
  (cl: Constructor<T>): T; 
  vault: {
    manifest: IDependencyManifest;
  }
}

type Constructor<T = any> = new (...args: any[]) => T;
export type ExtendedConstructor = Constructor & {id: string};

