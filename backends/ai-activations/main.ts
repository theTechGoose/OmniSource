import './registry.ts'
import {getArg} from "@shared/utils";
const port = getArg('port')
import {Server, Plugins, OakAdapter, λ} from "@shared/denomite";
const adapter = new OakAdapter('/ai-act', +port, λ.vault.manifest)
const __dirname = import.meta.dirname
if(!__dirname) throw new Error('dirname not found')
const server = new Server(__dirname, adapter)
server.registerPlugin(Plugins.StandardPlugin)
await server.start()

//import { Application, Router } from "#oak";
//
//const app = new Application();
//const router = new Router();
//
//router.get("/", (context) => {
//  context.response.body = "Hello, Oak!";
//});
//
//router.get("/greet/:name", (context) => {
//  const { name } = context.params;
//  context.response.body = `Hello, ${name}!`;
//});
//
//app.use(router.routes());
//app.use(router.allowedMethods());
//
//console.log("Server is running on http://localhost:8000");
//await app.listen({ port: 8000 });
//http://localhost:8000/ai-act/slick-text/V001/opt-in
//http://localhost:8000/ai-act/slick-text/V001/opt-in
