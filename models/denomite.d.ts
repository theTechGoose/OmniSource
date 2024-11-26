type metadataKeys =
  | "design:type"
  | "design:paramtypes"
  | "design:returntype"
  | "design:custom"
  | "design:label"
  | "design:isNotCacheable";

type Constructor<T = any> = new (...args: any[]) => T;
type ExtendedConstructor = Constructor & {id: string, isCacheable?: boolean, factory?: Function};
type GenericFn<T extends any = any, Args extends Array<any> = Array<any>> = (...args: Args) => T
type FnOrCtr = GenericFn | Constructor;
type ConstructorInstance<T extends Constructor = Constructor> = {constructor: Function} & InstanceType<T>
type AssortedInstances<T extends Constructor = Constructor> = Array<ConstructorInstance<T>>;


