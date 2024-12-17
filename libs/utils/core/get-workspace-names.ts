import { getGitRoot } from "./get-git-root.ts";

export async function lookupWorkspace(...strip: string[]) {
  try {
    const root = await getGitRoot();
    if (!root) return [];

    const target = `${root}/deno.json`;
    const workspace = await Deno.readTextFile(target);
    const json = JSON.parse(workspace);
    return (json.workspace || []).map((w: string) => {
      return strip.reduce((acc, s) => acc.replace(s, ''), w);
    });
  } catch {
    return [];
  }
}
