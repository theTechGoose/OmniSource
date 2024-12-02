import { relative, resolve } from "node:path";
import { ControllerType } from "../controller-getter/_mod.ts";
import * as fs from "node:fs";
import { customAlphabet } from "#nanoid";

export interface ParsedController {
  flattened: {
    impx: string;
    props: string[];
  }[];
  originalImports: string[] | null;
  controllerName: string;
  authName: string;
}

export function parseController(c: ControllerType) {
  const source = c.source;
  const originalImports = source.match(/import\s\{(.*)\}\sfrom\s"(.*)"/g)
  const ref = new c.constructorReference();
  const keys = Object.entries(ref);
  const controllerName = ref.constructor.name;
  const authName = Object.getPrototypeOf(ref).constructor.name;
  const dirname = resolve(c.path, "..");
  const expandedEndpoints = keys.map(([key, value]) => {
    const [verb, endpoint] = key.split(" ");
    const pathToHandlers = resolve(dirname, `.${endpoint}`);
    const allHandlerPath = fs.readdirSync(pathToHandlers).filter((v) =>
      v.charAt(0) === "V"
    ).map((h) => {
      return resolve(pathToHandlers, h);
    });

    const identifiedHandlerPaths = allHandlerPath.map((handler) => {
      const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 40);
      const id = nanoid();
      return {
        id,
        handler,
      };
    });
    const payload = identifiedHandlerPaths.map(({ id, handler }) => {
      const relativePath = relative(dirname, handler);
      const version = handler.split("/").reverse()[0].split(".")[0];
      const impx = `import  ${id} from "./${relativePath}"`;
      const props = [`${verb} ${version}${endpoint}`, id];
      return {
        impx,
        props,
      };
    });
    return payload;
  });
  const flattened = expandedEndpoints.flat(1);
  return {
    flattened,
    originalImports,
    controllerName,
    authName,
  }
}
