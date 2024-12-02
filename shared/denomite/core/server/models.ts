export interface IParsedEndpoint {
  controller: string;
  type: string;
  version?: string;
  verb: string;
  route: string;
  auth: Function;
  resolvedCallbackPath?: string;
  callbackPath: (root: string) => string;
}
