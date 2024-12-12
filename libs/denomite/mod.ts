// import {Application, Router, RouterContext} from '#oak';


// TODO: Fix these linting errors
// interface Endpoint {
  // route: string;
  // method: string;
  // auth: (ctx: RouterContext<any>) => boolean;
  // handler: (ctx: RouterContext<any>) => any;
// }

// class Server {
  // private app = new Application();
  // private router = new Router();
  // private setupCallbacks: Array<(registry: Array<Endpoint>) => void> = [];
  //constructor(registry: Array<Endpoint>) {}
  // private addEndpoint(endpoint: Endpoint): any -- registers an endpoint in the router, when the handler returns something it sets it as the response.body
  // if the handler returns nothing it sets the body as an empty object, before calling the handler it should check if the auth function returns true
  // if it does not set the response status to 401 and return an object with a message property set to "Unauthorized"
  // if the handler throws an error set the response status to 500 and return an object with a message property set to the error message


  //figure this out
  // addMiddleware(fn: (ctx: RouterContext<any>) => any): void {
  //   this.app.use(fn);
  // }

  // start(port: number): Promise<void> // runs all setup callbacks, calls register endpoint on each endpoint, then calls app.listen
// }
