import { Context } from "#oak";
import {parse} from "node:querystring";
import { logger } from "../../../core/logger_init.ts";
const TAG = 'git-push'


export async function onGitPush(ctx: Context) {
  const body = await ctx.request.body
  logger.log(TAG, await body.text())
}
