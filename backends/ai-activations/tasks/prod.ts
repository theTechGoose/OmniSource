import {getGitRoot, ProcessManager} from "@shared/utils";


const root = getGitRoot();
const ENV_FILE = `${root}/.env.prod`

const serveCmd = `deno -A --env-file=${ENV_FILE} ./backends/ai-activations/main.ts --port=8000`
const tunnelCmd = 'ngrok http --domain=ai-act.ngrok.io 8000'

const processManager = new ProcessManager(root);
processManager.spawn(serveCmd)
processManager.spawn(tunnelCmd)

