import { readFileSync } from "node:fs";
import { getGitRoot } from "./get-git-root.ts";

export function lookupWorkspace(...strip: string[]) {
  const root = getGitRoot();
  const target = `${root}/deno.json`;
  const workspace = readFileSync(target, "utf-8");
  const json = JSON.parse(workspace);
  return json.workspace.map((w: string) => {
    return strip.reduce((acc, s) => acc.replace(s, ''), w);
  });
}
