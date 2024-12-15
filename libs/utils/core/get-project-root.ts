import { dirname, join } from "#std";

export async function getProjectRoot(dir: string): Promise<string> {
  while (true) {
    for (const name of ["deno.json", "deno.jsonc"]) {
      const path = join(dir, name);
      try {
        if ((await Deno.stat(path)).isFile) return dirname(path);
      } catch {
        // Ignore file not found errors
      }
    }

    const parent = dirname(dir);
    if (parent === dir) break; // Reached the root
    dir = parent;
  }
  throw new Error("Project root not found");

}
