import { Application, Router, Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";

export interface Endpoint {
  route: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  auth: (ctx: Context) => boolean;
  handler: (ctx: Context) => Promise<unknown>;
}

export class Server {
  private app: Application;
  private router: Router;

  constructor(private registry: Endpoint[]) {
    this.app = new Application();
    this.router = new Router();
  }

  private addEndpoint(endpoint: Endpoint): void {
    const method = endpoint.method;
    this.router[method](endpoint.route, async (ctx) => {
      try {
        if (!endpoint.auth(ctx)) {
          ctx.response.status = 401;
          ctx.response.body = { message: "Unauthorized" };
          return;
        }
        const result = await endpoint.handler(ctx);
        ctx.response.body = result || {};
      } catch (err) {
        ctx.response.status = 500;
        ctx.response.body = {
          message: err instanceof Error ? err.message : "Internal Server Error"
        };
      }
    });
  }

  addMiddleware(fn: (ctx: Context) => Promise<void>): void {
    this.app.use(fn);
  }

  async start(port: number): Promise<void> {
    this.registry.forEach(endpoint => this.addEndpoint(endpoint));
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
    await this.app.listen({ port });
  }
}
