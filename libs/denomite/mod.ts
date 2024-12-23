import {
  Application,
  Context,
  Router,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";
import {getArg} from '@libs/utils';
import type { ResponseBody } from "https://deno.land/x/oak@v12.6.1/response.ts";
import { withTryCatch } from "@libs/utils";
import { scriptModeLogic } from "./catalog/build/mod.ts";
export { scriptModeLogic } from "./catalog/build/mod.ts";

export interface Endpoint {
  route: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  auth: (ctx: Context) => boolean | Promise<boolean>;
  handler: (ctx: Context) => Promise<ResponseBody> | ResponseBody;
}

export class Server {
  private app: Application;
  private router: Router;
  private controller: AbortController;

  constructor(private registry: any[]) {
    this.app = new Application();
    this.router = new Router();
    this.controller = new AbortController();
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }


  private addEndpoint(endpoint: Endpoint): void {
    const {route} = endpoint;
    const scrubbedRoute = route.charAt(0) !== '/' ? `/${route}` : route;
    this.router[endpoint.method](scrubbedRoute, async (ctx: Context) => {
      const { auth, handler } = endpoint;
      const [success, error] = await withTryCatch(async () => await auth(ctx));
      if (!success || error) {
        ctx.response.status = 401;
        ctx.response.body = { message: "Unauthorized" };
        return;
      }

      const [res, resErr] = await withTryCatch(async () => await handler(ctx));

      if (resErr) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Internal Server Error" };
        return;
      }

      if (res) {
        ctx.response.body = res;
        return;
      }
    });
  }

  async start(port: number): Promise<void> {
    this.setup404();
    const buildable = getArg("build");
    const serve = getArg("serve");
    if(buildable) await scriptModeLogic();
    this.registry.forEach((endpoint) => this.addEndpoint(endpoint));
    this.listRoutes();
    if(serve) await this._start(port);
    if(!buildable && !serve) await this._start(port);
  }

  setup404() {
    this.app.use((ctx: Context) => {
      ctx.response.status = 404;
      ctx.response.body = { message: "Not Found" };
    })
  }

  private listRoutes() {
    const routes:any = [];
    for(const route of this.router) {
      routes.push(route)
    }
    console.log(routes);

    const printableRoutes = routes.map((route: any) => {
      return route.methods.map((method: string) => {
        return `[${method}] ${route.path}`
      })
    }).flat(1);

    printableRoutes.forEach((r: string) => console.log(r))
    return printableRoutes;
  }

  async _start(port: number): Promise<void> {
    await withTryCatch(async () => {
      console.log(`Server listening on port ${port}`);
      await this.app.listen({ port, signal: this.controller.signal });
    });
    try {
      await this.app.listen({ port, signal: this.controller.signal });
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== "AbortError") {
        throw error;
      }
    }
  }

  stop(): void {
    this.controller.abort();
  }
}
