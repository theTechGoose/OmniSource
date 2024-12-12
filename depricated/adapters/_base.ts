import { Context } from "#oak";
import {
  AdapterInstance,
  IDependencyManifest,
  Middleware,
} from "@root/models.ts";

type ExtendedRouter<T = any> = T & {
  [key: string]: (route: string, cb: (ctx: Context) => Object | string) => void;
};

export abstract class Adapter implements AdapterInstance {
  protected abstract builtRouter: ExtendedRouter;
  protected abstract app: any;

  constructor(
    protected prefix: string,
    protected port: number,
    protected manifest: IDependencyManifest,
  ) {}

  abstract init(): void;

  abstract addMiddleware(m: Middleware<Context>): void;

  abstract finalize(): Promise<void>;

  abstract createEndpoint(
    method: string,
    route: string,
    callback: Function,
    auth: Function,
  ): void;
}
