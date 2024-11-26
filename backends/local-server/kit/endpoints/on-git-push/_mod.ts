import { Context } from "#oak";
import {sleep, getGitRoot} from "@shared/utils";
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
    return this.process?.then((process) => {
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
  //
  ///
  if (branch !== "x-deploy") return;
  const process = await pull(branch);
  await process.status;
  await killOtherDenoProcesses()
  await sleep(1000)


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


async function killOtherDenoProcesses() {
  // Get the current process ID
  const currentPid = Deno.pid;

  // Use `Deno.Command` to list all processes
  const command = new Deno.Command("ps", {
    args: ["-eo", "pid,comm"],
    stdout: "piped", // Capture standard output
    stderr: "piped", // Capture standard error
  });

  // Run the command and capture its output
  const { stdout } = await command.output();

  // Decode the output to a string
  const decoder = new TextDecoder();
  const processList = decoder.decode(stdout);

  // Find all Deno processes
  const denoProcesses = processList
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.includes("deno"))
    .map((line) => {
      const [pid] = line.split(/\s+/); // Extract PID
      return parseInt(pid, 10);
    })
    .filter((pid) => pid !== currentPid); // Exclude the current process

  // Kill other Deno processes
  for (const pid of denoProcesses) {
    try {
      Deno.kill(pid, "SIGKILL"); // Terminate the process
      console.log(`Killed Deno process with PID: ${pid}`);
    } catch (err: any) {
      console.error(`Failed to kill PID ${pid}:`, err.message);
    }
  }
  return
}


