import { glob } from "npm:glob";
import json from '../../deno.json' with { type: 'json' };

const controllerFilePattern = 'config.ts'


const isDry = Deno.args.includes("--dry");
const isQuiet = Deno.args.includes("--quiet");
const projectName = Deno.args.find(a => a.startsWith("--project="))?.split("=")[1] ?? "err";
const allProjects = json.workspace.map((p: string) => p.split('/')[1]).filter(Boolean);
if(projectName === "err") throw new Error("No project name provided");
if(!allProjects.includes(projectName)) throw new Error(`Project ${projectName} not found`);
const registryPath = `./backends/${projectName}/registry.ts`;


type PathPayload = { payload: string; shortPath: string };

// Define paths
const searchPattern = `./backends/${projectName}/controllers/*/${controllerFilePattern}`; // Where to search for files

async function writeFile(filePath: string, content: PathPayload) {

  if (!isQuiet) {
    console.log(`--- Writing to ${content.shortPath} ---`);
    console.log(content.payload.trim());
    console.log("            --- End of file ---");
  }

  if (isDry) return;
  const fs = await import("node:fs");
  fs.writeFileSync(filePath, content.payload);
}

const files = await glob(searchPattern, { absolute: true });

function getPathFromRegistry(path: string) {
  const parts = path.split("/");
  const idx = parts.findIndex((p) => p === "backends") + 2;
  const relative = parts.slice(idx, parts.length - 1).join("/");
  const registryParts = registryPath.split("/");
  const shortPathParts = registryParts.slice(idx - 2, registryPath.length - 1);
  const shortPath = shortPathParts.join("/");
  return {
    relative: "./" + relative,
    registryPath,
    shortPath,
  };
}

const ToWrite = files.map(getPathFromRegistry);

const filesToWrite = ToWrite.reduce((_acc, path) => {
  const acc = _acc as Record<string, PathPayload>;
  if (!acc[registryPath]) {
    acc[registryPath] = { payload: "", shortPath: path.shortPath };
  }
  acc[registryPath].payload += `export * from "${path.relative}/${controllerFilePattern}";` +
    "\n";
  return acc;
}, {} as Record<string, PathPayload>);

if(Object.keys(filesToWrite).length === 0) writeFile(registryPath, { payload: '', shortPath: '' });
for (const [path, content] of Object.entries(filesToWrite)) {
  
  await writeFile(path, content);
}
