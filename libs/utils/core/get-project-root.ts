import { dirname, join } from "#path";

export async function getProjectRoot(_dir: string): Promise<string> {
  let dir = _dir;
  if(dir.includes('.ts') ) dir = dirname(_dir);
  while (true) {
    for (const name of ["deno.json", "deno.jsonc"]) {
      const path = join(dir, name);
      console.log({path})
      try {
        const stats = await Deno.stat(path)
        const isFile = stats.isFile;
        console.log({isFile, path})
        if (isFile) return dirname(path);
      } catch(e: any) {
        console.log(e.message)
        // Ignore file not found errors
      }
    }

    const parent = dirname(dir);
    if (parent === dir) break; // Reached the root
    dir = parent;
  }
  throw new Error("Project root not found");

}
