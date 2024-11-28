import { relative } from "node:path";

export function getFileWritePayload(
  files: Array<string>,
  registryPath: string,
) {
  const registryDir = registryPath.split("/").slice(0, -1).join("/");
  return files.map((f) => {
    const relativePath = relative(registryDir, f);
    return `export * from './${relativePath}'`;
  });
}
