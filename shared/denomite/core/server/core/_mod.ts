import { AdapterInstance, Middleware } from "@root/models.ts";
import { ServerPlugin } from "@root/core/server/kit/server-plugin/_mod.ts";
import { Controller } from "../kit/controller-decorator/_mod.ts";
import { IParsedEndpoint } from "@root/core/server/models.ts";

export class Server<T> {
  private plugins: Array<Constructor<ServerPlugin>> = [];
  private resolvedEndpoints: Array<IParsedEndpoint> = [];
  constructor(private dir: string, private adapter: AdapterInstance) {
    
  }

  registerPlugin(plugin: Constructor<ServerPlugin>) {
    this.plugins.push(plugin);
    return this;
  }

  addMiddleware(middleware: Middleware<T>) {
    this.adapter.addMiddleware(middleware);
    return this;
  }

  resolveEndpoints() {
    const { endpoints } = Controller.vault;
    this.resolvedEndpoints = endpoints.map((endpoint) => {
      const resolvedCallbackPath = endpoint.callbackPath(this.dir);
      return {
        ...endpoint,
        resolvedCallbackPath,
      };
    });
  }

  async activatePlugins() {
    const $ = this.plugins.map(async (Plugin) => {
      const plugin = new Plugin(this.adapter, this.resolvedEndpoints);
      plugin.filter();
      return await plugin.apply();
    });
    await Promise.all($);
    return this;
  }

  async start() {
    this.resolveEndpoints();
    await this.activatePlugins()
    await this.adapter.finalize();
    return this;
  }
}
