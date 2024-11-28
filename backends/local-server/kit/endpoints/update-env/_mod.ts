import { Context } from "#oak";
import {writeFileSync} from "node:fs";
import {getGitRoot} from "@shared/utils";

export function formatFile(json: any) {
  return Object.entries(json).map(([key, value]) => `${key}=${value}`).join('\n')
}

export function updateEnvFile(ctx: Context) {
  const envFile = `${getGitRoot()}/.env.prod`
  const file = ctx.request.body.json()
  const formatted = formatFile(file)
  writeFileSync(envFile, formatted)
}

