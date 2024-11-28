import { getArg, lookupWorkspace } from "@shared/utils";
import {ENV_FILE_BASE} from "../settings.ts";

const type = getArg('type', 'prod', 'dev')
const envFile = `${ENV_FILE_BASE}.${type}`
const workspace = lookupWorkspace('backends/')
const project = getArg('project', ...workspace)
const port = getArg('port')

