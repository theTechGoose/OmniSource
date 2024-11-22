import { relative } from "node:path";
import type { Auth } from "../auth/~mod.ts";
type Handler = (...args: any[]) => any;

export class Endpoint<T> {
  _claimedBy: string = "";
  static createFromEndpointObject(endpointObj: any) {
    const { path, method, route, callback$, auth } = endpointObj;

    return new Endpoint(path, method, route, callback$, auth);
  }
  get claimedBy() {
    return this._claimedBy;
  }
  private set claimedBy(value: string) {
    this._claimedBy = value;
  }

  constructor(
    public path: string,
    public method: string,
    public route: string,
    public callback$: Promise<Handler>,
    public auth: Auth,
  ) {
  }

  labelByServer(allServerPaths: Array<string>) {
    if (this.claimedBy) {
      throw new Error(
        `Endpoint ${this.path} already claimed by ${this.claimedBy}`,
      );
    }
    const withDistance = allServerPaths.map((serverPath) => {
      const relativePath = relative(serverPath, this.path);
      return {
        distance: relativePath.split("/").length,
        relativePath: relativePath,
        serverPath: serverPath,
      };
    });

    const sorted = withDistance.sort((a, b) => a.distance - b.distance);
    const closest = sorted[0];
    this.claim(closest);
  }

  private claim(endpointObj: { serverPath: string }) {
    const { serverPath } = endpointObj;
    this.claimedBy = serverPath;
  }
}
