import {homedir} from "node:os";
import {writeFileSync, existsSync, mkdirSync} from "node:fs";
import { logger } from "../../../core/logger_init.ts";
import {z} from "#zod";
import { Context } from "#oak";
const TAG = 'config'

const schema = z.object({
  repo: z.string(),
  branch: z.string()
})


class Config {
  constructor(public repo: string, public branch: string) {}
}

const env = Deno.env.get("ENV_TYPE")
export const CONFIG_PATH = `${homedir()}/.local-server`

export function writeFile(configName: string, payload: any) {
  const path = `${CONFIG_PATH}/${configName}.json`
  if(env === 'ev') {
    logger.log(TAG, `writing to ${path}`, {payload})
  } else {
    if (!existsSync(CONFIG_PATH)) {
      mkdirSync(CONFIG_PATH, {recursive: true})
    }
    writeFileSync(path, JSON.stringify(payload, null, 2))
  }
}

export async function setConfig(ctx: Context) {
  const configName = ctx.request.url.pathname.split('/').pop()
  const body = await ctx.request.body.json()
  logger.log(TAG, `body`, body)
  schema.parse(body)
  if(!configName) throw new Error('no config name provided')
  writeFile(configName, body)
  ctx.response.body = {message: 'config set'}
  ctx.response.status = 200
  return {message: 'config set'}
}
