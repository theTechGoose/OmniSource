import { Application, Context, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import type { ResponseBody } from "https://deno.land/x/oak@v12.6.1/response.ts";

export interface Endpoint {
  route: string;
  method: "get" | "post" | "put" | "delete" | "patch";
  auth: (ctx: Context) => boolean;
  handler: (ctx: Context) => Promise<ResponseBody>;
}

export class Server {
  private app: Application;
  private router: Router;
  private controller: AbortController;

  constructor(private registry: Endpoint[]) {
    this.app = new Application();
    this.router = new Router();
    this.controller = new AbortController();
    this.registry.forEach(endpoint => this.addEndpoint(endpoint));
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  private addEndpoint(endpoint: Endpoint): void {
    this.router[endpoint.method](endpoint.route, async (ctx: Context) => {
      try {
        if (!endpoint.auth(ctx)) {
          ctx.response.status = 401;
          ctx.response.body = { message: "Unauthorized" };
          return;
        }
        ctx.response.body = await endpoint.handler(ctx);
      } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Internal Server Error" };
      }
    });
  }

  async start(port: number): Promise<void> {
    try {
      await this.app.listen({ port, signal: this.controller.signal });
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        throw error;
      }
    }
  }

  async stop(): Promise<void> {
    this.controller.abort();
  }
}
