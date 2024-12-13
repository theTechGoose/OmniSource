import {
  Application,
  Context,
  Router,
} from "https://deno.land/x/oak@v12.6.1/mod.ts";
import type { ResponseBody } from "https://deno.land/x/oak@v12.6.1/response.ts";
import { withTryCatch } from "@libs/utils";

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

  constructor(private registry: Endpoint[]) {
    this.app = new Application();
    this.router = new Router();
    this.controller = new AbortController();
    this.registry.forEach((endpoint) => this.addEndpoint(endpoint));
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }

  private addEndpoint(endpoint: Endpoint): void {
    this.router[endpoint.method](endpoint.route, async (ctx: Context) => {
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
    await withTryCatch(async () => {
      await this.app.listen({ port, signal: this.controller.signal })
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
