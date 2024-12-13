import { execSync } from "node:child_process";

export function getGitRoot() {
  const gitRoot = execSync("git rev-parse --show-toplevel", {
    encoding: "utf8",
  }).trim();
  if (!gitRoot) {
    throw new Error(
      "Failed to locate Git root. Ensure you're in a Git repository.",
    );
  }
  return gitRoot;
}
