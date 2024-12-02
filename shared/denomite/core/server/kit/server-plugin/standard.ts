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
      let handler = () => {};
      if (endpoint.type === "local") {
        handler = (await import(endpoint.resolvedCallbackPath)).default;
      } else handler = endpoint.callbackPath as any;
      console.log("Building Endpoint");
      this.adapter.createEndpoint(
        method,
        endpoint.route,
        handler,
        endpoint.auth,
      );
    });
    await Promise.all($);
    return;
  }
}
