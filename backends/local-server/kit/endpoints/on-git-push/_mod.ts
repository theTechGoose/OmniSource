import { Context } from "#oak";
import { execSync } from "node:child_process";
import { GithubPushHook } from "./models.ts";

export async function run(cmd: string, ...args: Array<string>) {
  const cwd = getGitRoot();
  const command = new Deno.Command(cmd, {
    args: args,
    stdout: "inherit",
    stderr: "inherit",
    cwd,
  });
  const childProcess = command.spawn();
  return childProcess;
}

export function pull(branch: string) {
  return run("git", "pull", "origin", branch);
}

class ProdRun {
  process: Promise<Deno.ChildProcess> | undefined;
  cmd = [] as Array<string>;
  constructor(...cmd: Array<string>) {
    this.cmd = cmd;
  }
  start() {
    this.process = run(this.cmd[0], ...this.cmd.slice(1));
  }

  stop() {
    this.process?.then((process) => {
      process.kill();
      this.process = undefined;
    });
  }
}

const prodRun = new ProdRun("deno", "task", "prod");
export async function onGitPush(ctx: Context) {
  const body = parseGitBody(await ctx.request.body.text());
  const branch = getBranch(body.ref);
  ctx.response.status = 200;
  ctx.response.body = { message: "ok" };
  console.log("branch", branch);
  if (branch !== "x-deploy") return;
  const process = await pull(branch);
  await process.status;
  prodRun.stop();
  prodRun.start();
}

export function getBranch(ref: string) {
  return ref.split("/").pop();
}

export function parseGitBody(body: string): GithubPushHook {
  const [_, payloadEncoded] = body.match(/payload=([^ ]+)/) ?? [];
  const payloadDecoded = decodeURIComponent(payloadEncoded);
  const payloadObject = JSON.parse(payloadDecoded);
  return payloadObject;
}

function getGitRoot() {
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
