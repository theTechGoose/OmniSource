import "./registry.ts";
import Denomite from "@denomite";
const { Controller, Dependency } = Denomite;
export { Controller, Dependency };

const oak = new Denomite.OakAdapter("/ai-act", 8000);

const resolver = new Denomite.Resolver();


const server = new Denomite.Server(oak, resolver);
server.addMiddleware(async (ctx: any, next: any) => {
  const url = ctx.request.url;
  console.log(url);
  next();
});

await server.start();
