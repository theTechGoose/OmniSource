import { Context } from "#oak";
import {
  getGitRoot,
  killAllDenoProcessesExceptCurrent,
  killNgrokTunnel,
  listNgrokTunnels,
  sleep,
  runCommand,
  withTryCatch
} from "@shared/utils";
import { GithubPushHook } from "./models.ts";

export async function onGitPush(_ctx: any) {
  if (_ctx.cycle) return cycleProcess();
  const ctx = _ctx as Context;
  const body = parseGitBody(await ctx.request.body.text());
  const branch = getBranch(body.ref);
  ctx.response.status = 200;
  ctx.response.body = { message: "ok" };
  if (branch !== "x-deploy") return;
  await runCommand('.',["git", "pull", "origin", branch]);
  await cycleProcess();
}

async function cycleProcess() {
  //const filters = ["sftp", 'vnc', 'llm', 'local-server']
  //await killAllDenoProcessesExceptCurrent();
  //const list = await listNgrokTunnels();
  //const filteredList = list.filter((t: any) => !filters.some(f => t.name.includes(f)));
  //for (const tunnel of filteredList) {
  //  await killNgrokTunnel(tunnel.name);
  //}
  withTryCatch(() => runCommand(getGitRoot(), ["deno", "task", "prod"]));
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
