import {Application, Router} from "#oak";
import {logger} from './logger_init.ts'
import {setConfig} from "../kit/endpoints/configure-project/_mod.ts";
import {listProjects} from "../kit/endpoints/list-projects/_mod.ts";
const PORT = 8765;

function onGitPush() {}

const app = new Application();
const router = new Router();
router.post("/git-push", onGitPush);
router.post("/configure/:project", setConfig);
router.get("/list", listProjects);
app.use(router.routes());
app.use(router.allowedMethods());

logger.log('app', `listening on port ${PORT}`)
await app.listen({port: PORT});

