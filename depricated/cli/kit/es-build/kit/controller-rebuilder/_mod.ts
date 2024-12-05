import { ParsedController } from "../controller-parser/_mod.ts";

export function rebuildController(c: ParsedController) {
  const {authName, controllerName, originalImports, flattened} = c;
  let classFile = ''
  if(originalImports) {
    classFile += originalImports.join('\n');
  }
  classFile += `\n`
  const imports = flattened.map(({impx}) => impx);
  classFile += imports.join('\n');
  classFile += `\n\n`
  classFile += `@Controller\n`
  classFile += `export class ${controllerName} extends ${authName} {\n`
  flattened.forEach(({ props}) => {
    classFile += `  ${props[0]} = ${props[1]};\n`
  })
  classFile += `}\n`
  return classFile;
}
