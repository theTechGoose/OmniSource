import * as fs from "node:fs";

export interface ControllerType {
  constructorReference: any;
  path: string;
  source: string;
}

export async function getController(path: string): Promise<ControllerType> {
  const source = await fs.promises.readFile(path, "utf8");
  const mod = await import(path);
  const [constructorReference] = Object.values(mod)
  return {
    constructorReference,
    path,
    source
  } 
}
