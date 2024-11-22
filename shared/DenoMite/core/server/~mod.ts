import type { Resolver } from "../resolver/~mod.ts";
import { getStackTrace, push } from "@utils";
import { Adapter } from "./adapter/base.ts";
import { Endpoint } from "../endpoint/~mod.ts";


export const servers = [] as Server<any>[];
export const prebuildEndpoints$ = [] as unknown as Promise<Endpoint<any>>[];
export const addToPrebuildEndpoints = (e: Promise<Endpoint<any>>) =>
  push(e, prebuildEndpoints$);
export const dependencies = [] as unknown as Array<Constructor>;
export const addDependency = (d: Constructor) => push(d, dependencies);
export class Server<T> {
  private currentFile: string;
  private endPts: Endpoint<T>[] = [];
  private middleware: Function[] = [];
  addEndpoint = (endpoint: Endpoint<T>) => push(endpoint, this.endPts);
  addMiddleware = (m: Function) => push(m, this.middleware);

  constructor(private adapter: Adapter, private resolver: Resolver) {
    const stack = getStackTrace();
    this.currentFile = stack.scrubPath(stack.urlToPath(stack.first));
    servers.push(this);
  }

  private async claimEndpoints() {
    const _prebuildEndpoints = await Promise.all(prebuildEndpoints$);
    const prebuildEndpoints = _prebuildEndpoints.map((e: any) => e.endpoint).filter(Boolean);
    const unclaimedEndpoints = prebuildEndpoints.filter((e) => !e.claimedBy);
    const serverPaths = servers.map((s) => s.currentFile).filter((s) => s);

    unclaimedEndpoints.forEach((e) => e.labelByServer(serverPaths));

    this.endPts = prebuildEndpoints.filter((e) =>
      e.claimedBy === this.currentFile
    );
  }

  registerDependencies() {
    dependencies.forEach((d) => {
      this.resolver.register(d);
    });
  }

  private prepareEndpoints() {
    this.endPts.forEach((e) => {
      this.adapter.register(e, this.resolver);
    });
  }

  checkDependenciesForDupes() {
    const deps = dependencies.map((d) => d.name);
    const dupes = deps.filter((d) => deps.indexOf(d) !== deps.lastIndexOf(d));
    if (!dupes.length) return;
    const err = `Dependencies with duplicate names found: ${dupes.join(", ")}`;
    throw new Error(err);
  }

  async start() {
    this.checkDependenciesForDupes();
    this.registerDependencies();
    await this.claimEndpoints();
    this.middleware.forEach((m) => this.adapter.addMiddleware(m));
    this.adapter.setup();
    this.prepareEndpoints();

    return await this.adapter.finalize();
  }
}

//export class Server extends _Server {
//  constructor() {
//    super(new Resolver());
//  }
//}
