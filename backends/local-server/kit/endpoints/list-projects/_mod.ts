import {readdirSync} from "node:fs";
import {CONFIG_PATH} from "../configure-project/_mod.ts";
import { logger } from "../../../core/logger_init.ts";
import { Context } from "#oak";
const TAG = 'list-projects'


export function listProjects(ctx: Context) {
  const files = readdirSync(CONFIG_PATH);
  const projects = files.map((file) => file.replace('.json', ''));
  logger.log(TAG, `listing projects in ${CONFIG_PATH}` ,projects)
  ctx.response.body = {projects}
  ctx.response.status = 200

  return {
    projects
  }
}
