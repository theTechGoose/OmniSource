import { ServerPlugin } from "./_base.ts";

export class StandardPlugin extends ServerPlugin {
  override keywords = [
    "get",
    "post",
    "put",
    "delete",
    "patch",
    "options",
    "head",
    "trace",
    "connect",
  ];
  async apply() {
    const $ = this.targets.map(async (endpoint) => {
      const method = endpoint.verb.toLowerCase();
      if (!endpoint.resolvedCallbackPath) {
        throw new Error("Callback path not resolved");
      }
      console.log(endpoint.resolvedCallbackPath);
      const hander = await import(endpoint.resolvedCallbackPath);
      console.log("Building Endpoint");
      this.adapter.createEndpoint(
        method,
        endpoint.route,
        hander.default,
        endpoint.auth,
      );
    });
    await Promise.all($);
    return
  }
}
