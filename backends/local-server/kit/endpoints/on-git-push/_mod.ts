import { Context } from "#oak";
import {GithubPushHook} from "./models.ts";
import {parse} from "node:querystring";
import { logger } from "../../../core/logger_init.ts";
const TAG = 'git-push'


export async function onGitPush(ctx: Context) {
  const body = parseGitBody(await ctx.request.body.text())
  logger.log(TAG, body.ref)

  
}

export function parseGitBody(body: string):GithubPushHook  {
const [_, payloadEncoded] = body.match(/payload=([^ ]+)/) ?? [];
const payloadDecoded = decodeURIComponent(payloadEncoded);
const payloadObject = JSON.parse(payloadDecoded);
return payloadObject;
}
