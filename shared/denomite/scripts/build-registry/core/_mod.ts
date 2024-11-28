import {getArg, getGitRoot, lookupWorkspace} from "@shared/utils";
import {REGISTRY_PATH, SEARCH_PATTERN} from "../settings.ts";
import {glob} from "#glob";
import { getFileWritePayload } from "@root/scripts/build-registry/kit/get-file-write-payload.ts";
import { determineType } from "@root/scripts/build-registry/kit/write-file.ts";
import { writeFile } from '../kit/write-file.ts';

const isQuiet = getArg('quiet')
const isDry = getArg('dry')
const type = determineType(isQuiet, isDry)
const workspace = lookupWorkspace('backends/')
const projectName = getArg('project',...workspace)
const searchPattern = SEARCH_PATTERN(projectName)
const registryPath = REGISTRY_PATH(projectName) 

const files = await glob(searchPattern, { absolute: true, cwd: getGitRoot() });

const payloads = getFileWritePayload(files, registryPath)

for (const payload of payloads) {
  await writeFile(registryPath, payload, type)
}

