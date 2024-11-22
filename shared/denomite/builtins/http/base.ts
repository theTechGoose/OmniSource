
type HttpVerbs =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

export abstract class Request<T extends HttpVerbs = any, P = any> {
  abstract type: T;
  abstract headers: Record<string, string>;
  abstract payload: T extends 'POST' ? never : P;
  protected abstract baseUrl: string;
  protected abstract route?: string;
  get requestUrl() {
    if(!this.route) return this.baseUrl;
    return `${this.baseUrl}${this.route}`;
  }
}
