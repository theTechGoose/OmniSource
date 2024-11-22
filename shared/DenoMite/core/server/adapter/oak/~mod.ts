import {
  Application,
  Router,
} from "jsr:@oak/oak@17.1.3";
import type { Endpoint } from "../../../endpoint/~mod.ts";
import type {Resolver} from '../../../resolver/~mod.ts';


  export class OakAdapter {
    router = new Router();
    app = new Application();
    constructor(private prefix: string, private port: number) {}

    setup() {

    this.app.use(this.router.prefix(this.prefix).routes());
    this.app.use(this.router.allowedMethods());

    }

    addMiddleware(m: any) {
      this.app.use(m);
    }

    async finalize() {
    const server = this.app.listen({ port: this.port });
    console.log(`Server running on port ${this.port}`);
    return await server;
    }

    register<T>(e: Endpoint<T>, resolver: Resolver) {
      const {route, method} = e;
      const METHOD = method.toLowerCase().trim();
      if(!e.auth.canActivate) throw new Error(`Controller ${e.route} must have auth`);
      //const log = `Registering ${method.toUpperCase()} ${route}`;
      console.log(route)
      //@ts-ignore
      this.router[METHOD]('/' +route, async (ctx: any) => {
      const injector = resolver.captureCtx(ctx);
      const canActivate = await e.auth.canActivate(ctx)
      if(!canActivate) {
        ctx.response.status = 401;
        ctx.response.body = 'Unauthorized';
        return;
      }
      const cb = await e.callback$;
      const builtCb =  injector(cb);
      return await builtCb(ctx);
      })

      //console.log(log);
    }
    
  }
