import { getGitRoot } from "@shared/utils";


const CONTROLLER_FILE_PATTERN = 'config.ts'

export const SEARCH_PATTERN = (projectName: string | boolean) => {
  return `./backends/${projectName}/controllers/*/${CONTROLLER_FILE_PATTERN}`
}

export const REGISTRY_PATH = (projectName: string | boolean) => {
  const cwd = getGitRoot()
  return `${cwd}/backends/${projectName}/registry.ts`
}

