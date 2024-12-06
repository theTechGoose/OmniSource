import { Application, Context, Router } from "#oak";
import {
  Middleware,
} from "@root/models.ts";

import {Adapter} from "./_base.ts";
type ExtendedRouter = Router & {
  [key: string]: (route: string, cb: (ctx: Context) => Object | string) => void;
};

export class OakAdapter extends Adapter {
  static Ctx = class Ctx {
    body!: ReturnType<Context["request"]["body"]["json"]>;
    constructor(public root: Context) {
      if(!root.request.hasBody) return;
      this.body = root.request.body.json();
    }
  };
  protected builtRouter!: ExtendedRouter;
  protected app = new Application();

  init() {
    if(this.builtRouter) return;
    const payload = {} as any
    if(this.prefix) payload.prefix = this.prefix
    const output = new Router(payload) as ExtendedRouter
    this.builtRouter = output
  }

  addMiddleware(m: Middleware<Context>) {
    this.app.use(m);
  }

  async finalize() {
    if(!this.builtRouter) throw new Error('Adapter must have atleast one endpoint')
    this.builtRouter.allowedMethods()
    this.app.use(this.builtRouter.routes());
    this.app.use(this.builtRouter.allowedMethods());
    this.app.use(async (ctx, next) => {
      next()
    });

    //for(const route of this.builtRouter) {
    //  console.log(route)
    //}

    const server = this.app.listen({ port: this.port });
    console.log(`Server running on port ${this.port}`);
    return await server;
  }

  createEndpoint(
    method: string,
    route: string,
    callback: Function,
    auth: Function,
  ) {
    this.init();
    console.log(`Initalizing [${method.toUpperCase()}]::${route}`);
    this.builtRouter[method](route, async (ctx) => {
      console.log(route)
      const dep = this.manifest.getDependencyById('r4LDIFMpxsLu3xjDvicHI')
      dep?.buildManual(ctx)
      this.manifest.init();
      const isAuthorized = auth(ctx);
      if (!isAuthorized) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Unauthorized" };
        return;
      }
      const data = await callback();
      ctx.response.body = data;
      ctx.response.status = 200;
    });
  }
}
