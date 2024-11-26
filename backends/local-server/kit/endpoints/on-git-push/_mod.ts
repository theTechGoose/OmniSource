import { Context } from "#oak";
import {parse} from "node:querystring";
import { logger } from "../../../core/logger_init.ts";
const TAG = 'git-push'


export async function onGitPush(ctx: Context) {
 const parsedBody = await ctx.request.body.formData()
 const body = Array.from(parsedBody).reduce((acc, [key, value]) => {
   // @ts-ignore
  acc[key] = value
  return acc
 }, {} as any)




 //testing again
logger.log(TAG,'git push data', body)
logger.log(TAG, body.zen)
}
