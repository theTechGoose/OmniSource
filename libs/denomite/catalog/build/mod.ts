import { readdir } from "node:fs/promises";
import {dirname} from '#std';
import { camelToKebabCase, getArg, toCamelCaseVariableName } from "@libs/utils";
import { join, relative, resolve } from "node:path";
import { glob } from "#glob";
import { customAlphabet } from "#nanoid";
import V from "@globals/magic-values";
import { writeFile } from "node:fs/promises";
import {exec} from 'node:child_process';
import { promisify } from 'node:util';
const execAsync = promisify(exec);

const nanoid = customAlphabet(V("denomite.variableNamingAlphabet"), 25);

export async function getAllControllers(cwd: string) {
  const out = await glob(V("denomite.controllerPattern"), {
    cwd,
    absolute: true,
  });
  return out;
}

interface EndpointConfig {
  method: string;
  fullRoute: string;
  fullPath: string;
  controllerName: string;
  controllerPath: string;
}

export class ControllerParser {
  controllerPaths: Array<string>;
  constructor(...controllerPaths: Array<string>) {
    this.controllerPaths = controllerPaths;
  }

  async parse() {
    const endpointConfigs: EndpointConfig[] = [];

    for (const controllerPath of this.controllerPaths) {
      const configs = await this._parse(controllerPath);
      endpointConfigs.push(...configs);
    }

    return endpointConfigs;
  }

  private async _parse(controllerPath: string): Promise<EndpointConfig[]> {
    const controllerExports = await import(controllerPath);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const ControllerClass = Object.values(controllerExports)[0] as any;
    const controllerInstance = new ControllerClass();
    const controllerName =  controllerInstance.constructor.name

    const endpointConfigs: EndpointConfig[] = [];

    for (const [key, value] of Object.entries(controllerInstance)) {
      const [method, route] = key.split(" ");
      const endpointPath = resolve(
        controllerPath.replace(/\/[^/]+$/, ""),
        value as string,
      );

      const endpointFiles = await readdir(endpointPath);

      for (const file of endpointFiles) {
        const version = this.extractVersion(file);
        const localConfig = this.buildEndpointConfig(
          method,
          route,
          controllerName,
          version,
          endpointPath,
          file,
          controllerPath,
        );
        endpointConfigs.push(localConfig);
      }
    }

    return endpointConfigs;
  }

  private extractVersion(endpointPath: string): string {
    const parts = endpointPath.split("/");
    const lastSegment = parts.pop() ?? V("denomite.defaultVersionName");
    const [version] = lastSegment.split(".");
    return version.toUpperCase();
  }

  private buildEndpointConfig(
    method: string,
    route: string,
    controllerName: string,
    version: string,
    endpointPath: string,
    file: string,
    controllerPath: string,
  ): EndpointConfig {
    const controllerRoute = camelToKebabCase(controllerName.split('Controller').join(''))
    const fullPath = join(endpointPath, file);
    const fullRoute = `${controllerRoute}${route}/${version}`;

    return {
      method,
      fullRoute,
      fullPath,
      controllerName,
      controllerPath: controllerPath,
    };
  }
}

const controllerImports = {} as any;
export function buildEndpointOutput(
  { fullPath, controllerPath, fullRoute, method, controllerName }:
    EndpointConfig,
  registryPath: string,
) {
  
  const endpointRelativeImportPath = relative(dirname(registryPath), fullPath);
  const controllerRelativeImportPath = relative(dirname(registryPath), controllerPath);
  const endpointId = toCamelCaseVariableName(fullRoute)
  controllerImports[controllerName] = `import {${controllerName}} from './${controllerRelativeImportPath}';\n`
  const imprt = `import ${endpointId} from './${endpointRelativeImportPath}';`;
  const content =
    `{\nmethod: '${method.toLowerCase()}',\nroute: '${fullRoute}',\nhandler: ${endpointId},\nauth: new ${controllerName}().canActivate,\n}`;
  return {
    imprt,
    content,
  };
}

export async function buildRegistry(endpoints: Array<EndpointConfig>, registryPath: string) {
  const elements = endpoints.map((e) => buildEndpointOutput(e, registryPath))
  const imports = elements.map(e => e.imprt).join('\n')
  const object = elements.map(e => e.content).join(',')
  const classImports = Object.values(controllerImports).join('')
  const built = `${classImports}\n${imports}\n\nexport const registry = [\n${object}\n]`
  await writeFile(registryPath, built)
  await execAsync(`deno fmt ${registryPath}`)
  return built
}

export async function scriptModeLogic() {
  const cwd = Deno.cwd()
  console.log(`building ${cwd}`)
  const controllers = await getAllControllers(cwd)
  const allConfigs = await new ControllerParser(...controllers).parse()
  await buildRegistry(allConfigs, join(cwd, 'registry.ts'))
}
