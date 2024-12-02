import { createFunclet, camelToKebabCase } from "@shared/utils";
import {resolve} from "node:path";
import { IParsedEndpoint } from "../../models.ts";
import { Constructor } from "@root/models.ts";

interface LocalVaultType {
  endpoints: IParsedEndpoint[];
}

const vault: LocalVaultType = {
  endpoints: [],
};

function resolvePath(path: unknown, controllerName: string) {
  if(typeof path !== "string") throw new Error("Path must be a string");
  return (_root: string) => {
    const root = `${_root}/controllers/${controllerName}`;
    const output = resolve(root, path);
    return output
  }
}

function buildRoute(controller: string, version: string, route: string) {
  return `/${controller}/${version}${route}`;
}


export const Controller = createFunclet(vault, (target: Constructor) => {
  const instance = new target();
  const sample = Object.values(instance)[0];
  if(typeof sample === 'string') return localStrategy(target);
  else return deployStrategy(target);
});


function deployStrategy(target: Constructor) {
  const instance = new target();
  const entries = Object.entries(instance);
  const endpoints = entries.map(([key, value]) => {
    const versionRegex = /V\d\d\d/;
    const controller = camelToKebabCase(target.name.replace(versionRegex, ""));
    const [verb, _route] = key.split(" ");
    const route = `${controller}${_route}`
    const auth = instance.canActivate;
    if(!auth) throw new Error("Controller");
    const callbackPath = value
    return {type: 'deploy', controller, verb, route, auth, callbackPath } as any;
  });

  endpoints.forEach((endpoint) => {
    Controller.vault.endpoints.push(endpoint);
  });
}


function localStrategy(target: Constructor) {
  const instance = new target();
  const entries = Object.entries(instance);
  const endpoints = entries.map(([key, value]) => {
    const versionRegex = /V\d\d\d/;
    const controller = camelToKebabCase(target.name.replace(versionRegex, ""));
    let [version] = target.name.match(versionRegex) || ["VDF1"]
    version = version.toUpperCase();
    const [verb, _route] = key.split(" ");
    const route = buildRoute(controller, version, _route);
    const auth = instance.canActivate;
    if(!auth) throw new Error("Controller");
    const callbackPath = resolvePath(value, controller);
    return {type: 'local', controller, version, verb, route, auth, callbackPath };
  });

  endpoints.forEach((endpoint) => {
    Controller.vault.endpoints.push(endpoint);
  });
}



