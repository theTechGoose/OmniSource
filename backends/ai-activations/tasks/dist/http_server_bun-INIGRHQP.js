import {
  createPromiseWithResolvers
} from "./chunk-N3PSYYFW.js";

// https://jsr.io/@oak/oak/16.1.0/http_server_bun.ts
function isServeTlsOptions(value) {
  return !!("cert" in value && "key" in value);
}
var BunRequest = class {
  #hostname;
  // deno-lint-ignore no-explicit-any
  #reject;
  #request;
  #resolve;
  #resolved = false;
  #promise;
  get body() {
    return this.#request.body;
  }
  get headers() {
    return this.#request.headers;
  }
  get method() {
    return this.#request.method;
  }
  get remoteAddr() {
    return this.#hostname;
  }
  get request() {
    return this.#request;
  }
  get response() {
    return this.#promise;
  }
  get url() {
    try {
      const url = new URL(this.#request.url);
      return this.#request.url.replace(url.origin, "");
    } catch {
    }
    return this.#request.url;
  }
  get rawUrl() {
    return this.#request.url;
  }
  constructor(request, server) {
    this.#request = request;
    this.#hostname = server.requestIP(request)?.address;
    const { resolve, reject, promise } = createPromiseWithResolvers();
    this.#resolve = resolve;
    this.#reject = reject;
    this.#promise = promise;
  }
  // deno-lint-ignore no-explicit-any
  error(reason) {
    if (this.#resolved) {
      throw new Error("Request already responded to.");
    }
    this.#resolved = true;
    this.#reject(reason);
  }
  getBody() {
    return this.#request.body;
  }
  respond(response) {
    if (this.#resolved) {
      throw new Error("Request already responded to.");
    }
    this.#resolved = true;
    this.#resolve(response);
  }
};
var Server = class {
  #options;
  #server;
  #stream;
  constructor(_app, options) {
    this.#options = options;
  }
  close() {
    if (this.#server) {
      this.#server.stop();
    }
  }
  listen() {
    if (this.#server) {
      throw new Error("Server already listening.");
    }
    const { onListen, hostname, port, signal } = this.#options;
    const tls = isServeTlsOptions(this.#options) ? { key: this.#options.key, cert: this.#options.cert } : void 0;
    const { promise, resolve } = createPromiseWithResolvers();
    this.#stream = new ReadableStream({
      start: (controller) => {
        this.#server = Bun.serve({
          fetch(req, server) {
            const request = new BunRequest(req, server);
            controller.enqueue(request);
            return request.response;
          },
          hostname,
          port,
          tls
        });
        signal?.addEventListener("abort", () => {
          controller.close();
          this.close();
        }, { once: true });
        {
          const { hostname: hostname2, port: port2 } = this.#server;
          if (onListen) {
            onListen({ hostname: hostname2, port: port2 });
          }
          resolve({ addr: { hostname: hostname2, port: port2 } });
        }
      }
    });
    return promise;
  }
  [Symbol.asyncIterator]() {
    if (!this.#stream) {
      throw new TypeError("Server hasn't started listening.");
    }
    return this.#stream[Symbol.asyncIterator]();
  }
  static type = "bun";
};
export {
  Server
};
