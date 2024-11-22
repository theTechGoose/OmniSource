import {
  Application,
  Context,
  Router,
  type RouterContext,
} from "https://deno.land/x/oak/mod.ts";
import { ContextCallback, handleMetadata, RouteHandler } from "@shared";
import { Subject } from "https://deno.land/x/rxjs@v1.0.1/mod.ts";
import { debounceTime } from "https://deno.land/x/rxjs@v1.0.1/mod.ts";
import { Reflect } from "https://deno.land/x/reflect_metadata@v0.1.12/mod.ts";
import { Logger } from "@logger";
import { Resolver } from "@core";
import { withTryCatch } from "@shared/utils";
import { GateKeeper } from "./gate-keeper.ts";

const rebuildSubject = new Subject<void>();

export const ROUTES: {
  method: string;
  path: string;
  constructor: () => RouteHandler;
}[] = [];

export class RouteTracker {
  private _router!: Router;
  private _app!: Application;
  private listener!: AbortController;
  private logger: Logger;

  constructor(
    private Router: new () => Router,
    private App: new () => Application,
  ) {
    rebuildSubject.pipe(
      debounceTime(150), // Adjust debounce time as needed (300ms here)
    ).subscribe(() => this.triggerRebuild());
    rebuildSubject.next();
    this.logger = Resolver.resolveWithCurrentInstance__Danger__(Logger).get();
  }

  static add(
    route: { method: string; path: string; constructor: () => RouteHandler },
  ) {
    ROUTES.push(route);
    rebuildSubject.next();
  }

  async start(_prefix: string, ms = 0): Promise<void> {
    const prefix = _prefix.charAt(0) === "/" ? _prefix : `/${_prefix}`;
    await new Promise((resolve) => setTimeout(resolve, ms));
    if (!this._app || !this._router) return await this.start(prefix, 50);
    this._app.use(new GateKeeper().middleware);
    this._app.use(this._router.prefix(prefix).routes());
    this._app.use(this._router.allowedMethods());
    this._app.use((ctx) => {
      ctx.response.status = 404;

      const all = [] as string[];
      this._router.forEach((route) => {
        all.push(`[${route.methods}] ${route.path}`);
      });

      console.log(`Registered routes: ${all.join("\n")}`);

      this.logger.error(
        `404 - Not Found: ${ctx.request.method} ${ctx.request.url.pathname}`,
      );
      ctx.response.body = { error: "Not Found" };
    });
    const controller = new AbortController();
    const { signal } = controller;
    this.logger.info("Server running on http://localhost:8000");
    await this._app.listen({ port: 8000, signal });
    this.logger.info("Restarting server...");
    return this.start(_prefix, ms);
  }

  private triggerRebuild() {
    this._router = new this.Router();
    this._app = new this.App();

    const router = this._router as unknown as Record<
      string,
      (route: string, handler: (c: Context) => void) => void
    >;

    for (const route of ROUTES) {
      //this.logger.info(`Registered route: ${route.method.toUpperCase()} ${route.path}`);

      router[route.method](route.path, async (ctx: Context) => {
        this.logger.info(
          `Starting: ${route.method.toUpperCase()} ${route.path}`,
        );
        const resolver = new Resolver();
        // Step 1: Resolve the instance of the route handler
        console.log(route.constructor);
        const instance = resolver.resolve(route.constructor as any) as any;
        // Step 2: Retrieve the parameter types for the "handle" method
        const paramTypes =
          Reflect.getMetadata("design:paramtypes", instance, "handle") || [];
        // Step 3: Map each parameter index to the appropriate metadata or context
        const _args = paramTypes.map(async (_: any, index: number) => {
          // Using `handleMetadata` in "get" mode to retrieve the extractor
          const mData = handleMetadata(
            "get",
            instance,
            "handle",
            index,
          );

          if (!mData) return ctx;
          const { extractor, ifErrorMessage, type } = mData.dat as {
            extractor: ContextCallback;
            ifErrorMessage: string;
            type: string;
          };

          if (type === "obj") {
            return extractor(ctx);
          }

          // Step 4: If an extractor is defined, use it to extract data from the context; otherwise, use the full `ctx`
          const [value, error] = await withTryCatch(async () =>
            await extractor(ctx)
          );
          if (error) {
            this.logger.info(
              `Argument parsing error: ${mData.metadataKey} in ${route.path}`,
            );
            this.logger.info(ifErrorMessage);
            throw new Error(error.message);
          }
          return value;
        });

        const authResponse = this.runAuthorization(ctx as any, instance);
        if (authResponse.faulure) {
          ctx.response.status = 401;
          ctx.response.body = { error: authResponse.errors.join(" ") };
          return;
        }

        const args = _args.length ? await Promise.all(_args) : [ctx];
        const [value, error] = await withTryCatch(async () =>
          await instance.handle(...args)
        );
        ctx.response.body = value ?? {};
        if (error) {
          ctx.response.status = 500;
          ctx.response.body = { error: error.message };
        }
      });

      this._router.forEach((route) => {
        console.log(`Registered route: [${route.methods}] ${route.path}`);
      });
      if (this.listener) this.listener.abort();
    }
  }

  runAuthorization(ctx: RouterContext<any, any, any>, instance: any) {
    const { url, method } = ctx.request;
    const noMethodError = `No auth defined for ${method} ${url.pathname}`;
    const noMsgError =
      `No unauthorized message defined for ${method} ${url.pathname}`;
    if (!instance.canActivate) {
      this.logger.error(noMethodError);
      return {
        faulure: true,
        errors: [noMethodError],
      };
    }
    if (!instance.respondToUnauthorized) {
      this.logger.error(noMsgError);
      return {
        faulure: true,
        errors: [noMsgError],
      };
    }

    const authResponse = instance.canActivate(ctx);
    if (!authResponse) {
      const unauthorizedMsg = instance.respondToUnauthorized(ctx);
      this.logger.warn(unauthorizedMsg);
      return {
        faulure: true,
        errors: [unauthorizedMsg],
      };
    }
    return {
      faulure: false,
      errors: [],
    };
  }
}
