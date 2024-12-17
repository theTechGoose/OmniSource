export async function getGitRoot(path?: string) {
  try {
    const cmd = new Deno.Command("git", {
      args: ["rev-parse", "--show-toplevel"],
      cwd: path,
    });
    const { stdout } = await cmd.output();
    const decoder = new TextDecoder();
    const gitRoot = decoder.decode(stdout).trim();
    return gitRoot || null;
  } catch {
    return null;
  }
}
