import { Context } from "#oak";
import {sleep, getGitRoot, ProcessManager, runCommand} from "@shared/utils";
import { GithubPushHook } from "./models.ts";

export function pull(branch: string) {
  return runCommand('.', ['pull', 'origin', branch])
}

const processManager = new ProcessManager(getGitRoot());
export async function onGitPush(_ctx: any) {
  if(_ctx.cycle) return cycleProcess()
  const ctx = _ctx as Context
  const body = parseGitBody(await ctx.request.body.text());
  const branch = getBranch(body.ref);
  ctx.response.status = 200;
  ctx.response.body = { message: "ok" };
  console.log("branch", branch);
  if (branch !== "x-deploy") return;
  await pull(branch).status;
  await cycleProcess();
}

async function cycleProcess() {
  processManager.killAll()
  processManager.spawn(`deno task prod`)
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
