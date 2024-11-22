import _ from "npm:lodash@4.17.21";

import { getStackTrace, camelToKebabCase } from "@utils";
import {withTryCatch} from '@utils';
import chalk from "jsr:@nothing628/chalk@1.0.1"

import { Endpoint } from "../../endpoint/~mod.ts";
import { addToPrebuildEndpoints } from "../../server/~mod.ts";

//@Controller("name")
//class AiConfirmations extends NoAuth {
//  version = "1.0.0";
//  "POST /api" = "path/to/handler";
//  "GET /api" = "path/to/handler";
//  "GET /api/:id" = "path/to/handler";
//  "PUT /api/:id" = "path/to/handler";
//  "DELETE /api/:id" = "path/to/handler";
//}

export function Controller(target: any) {
  let { name } = target;
  name = camelToKebabCase(name);
  const trace = getStackTrace();
  const filePath = trace.urlToPath(trace.first);
  const template = new target();
  const version = template.version
  const endpoints = Object.entries(template);
  const parsed = endpoints.map(([key, value]) => {
    if(key === "version") return [false] as any;
    const [method, path] = key.split(" ");
    return [method, path, value];
  }).filter(i => i.every(Boolean)) as [string, string, string][];

  parsed.forEach(([method, path, value]) => {
    const fullDir = filePath.split("/").slice(0, -1).join("/");
    const scrubbedPath = value.charAt(0) === '.' ? value.slice(1) : value;
    const fullPath = `${fullDir}${scrubbedPath}`

    const handler$ = import(fullPath).then((mod) =>
      mod.default
    );

    const scrubbedFilePath = trace.scrubPath(filePath)

    const e = new Promise(async (r, j) => {
      const [handler, error] = await withTryCatch(() => handler$);
      const useName = handler ? scrubbedFilePath : '<noop>';
      const handlerPath = `${name}/V${version}${path}`;
      const endpoint = new Endpoint(useName, method, handlerPath, handler , template)
      const cb = handler ? r : j;
      cb({endpoint, error});
    }).catch(({endpoint, error}) => {
      //@ts-ignore: chalk does have this property
      const label = chalk.redBright('[ERROR]');
      console.log(`${label}::Could not load ${path} in ${scrubbedFilePath}\nMsg: ${error.message}`);
      return endpoint
    }) as any;
    addToPrebuildEndpoints(e)
  });
}
