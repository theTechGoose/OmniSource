import { getGitRoot } from "@shared/utils";

const gitRoot = getGitRoot()
export const ENV_FILE_BASE = `${gitRoot}/.env`
