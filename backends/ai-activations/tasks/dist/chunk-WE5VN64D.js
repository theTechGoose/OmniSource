import {
  NativeRequest
} from "./chunk-XIJTLRFA.js";
import {
  createPromiseWithResolvers
} from "./chunk-N3PSYYFW.js";

// https://jsr.io/@oak/oak/16.1.0/http_server_native.ts
var serve = "Deno" in globalThis && "serve" in globalThis.Deno ? globalThis.Deno.serve.bind(globalThis.Deno) : void 0;
var Server = class {
  #app;
  #closed = false;
  #httpServer;
  #options;
  #stream;
  constructor(app, options) {
    if (!serve) {
      throw new Error(
        "The native bindings for serving HTTP are not available."
      );
    }
    this.#app = app;
    this.#options = options;
  }
  get app() {
    return this.#app;
  }
  get closed() {
    return this.#closed;
  }
  async close() {
    if (this.#closed) {
      return;
    }
    if (this.#httpServer) {
      this.#httpServer.unref();
      await this.#httpServer.shutdown();
      this.#httpServer = void 0;
    }
    this.#closed = true;
  }
  listen() {
    if (this.#httpServer) {
      throw new Error("Server already listening.");
    }
    const { signal } = this.#options;
    const { onListen, ...options } = this.#options;
    const { promise, resolve } = createPromiseWithResolvers();
    this.#stream = new ReadableStream({
      start: (controller) => {
        this.#httpServer = serve?.({
          handler: (req, info) => {
            const nativeRequest = new NativeRequest(req, info);
            controller.enqueue(nativeRequest);
            return nativeRequest.response;
          },
          onListen({ hostname, port }) {
            if (onListen) {
              onListen({ hostname, port });
            }
            resolve({ addr: { hostname, port } });
          },
          signal,
          ...options
        });
      }
    });
    signal?.addEventListener("abort", () => this.close(), { once: true });
    return promise;
  }
  [Symbol.asyncIterator]() {
    if (!this.#stream) {
      throw new TypeError("Server hasn't started listening.");
    }
    return this.#stream[Symbol.asyncIterator]();
  }
  static type = "native";
};

export {
  Server
};
