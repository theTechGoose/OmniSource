
export interface RouteHandler {
   handle(...args: Array<any>): string | object | undefined | Promise<string | object | undefined>;
}
