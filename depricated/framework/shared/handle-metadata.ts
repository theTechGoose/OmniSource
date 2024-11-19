import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { Resolver } from "@core";

export function handleMetadata(
  mode: "get" | "set",
  target: Object,
  propertyKey: string,
  parameterIndex: number,
  data?: any,
) {
  const metadataKey = `param:${propertyKey}:${parameterIndex}`;

  if (mode === "set") {
    // Set metadata with provided data
    if (data === undefined) {
      throw new Error("Data must be provided for setting metadata.");
    }
    Reflect.defineMetadata(metadataKey, data, target, propertyKey);
    return { metadataKey };
  } else if (mode === "get") {
    // Retrieve metadata
    const dat = Reflect.getMetadata(metadataKey, target, propertyKey);
    return { metadataKey, dat };
  }
}

export function resolveWithDependencies(constructor: any, data: any) {

  return () => {
    const paramTypes = Reflect.getMetadata("design:paramtypes", constructor) ||
      [];

    const idx = data && Object.keys(data).length ? 1 : 0;

  
    const deps = paramTypes.slice(idx).map((dep: any) => {
      const t = dep.label ?? dep;
      const {resolver} = Resolver.resolveWithCurrentInstance__Danger__();
      return resolver.resolve(t)
    });

    if(!data || Object.keys(data).length === 0) return new constructor(...deps);


    const output =  new constructor(data, ...deps);

    return output;
  };
}


