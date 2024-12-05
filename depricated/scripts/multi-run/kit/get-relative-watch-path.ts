import {relative, resolve} from "node:path";





export const getRelativeWatchPath = (here: string, root: string, path?: string,) => {
  const relativePath = resolve(here, root);
  if(!path) return relativePath;
  return relative(relativePath, path);
}
