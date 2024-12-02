import {
  createPromiseWithResolvers
} from "./chunk-N3PSYYFW.js";

// https://jsr.io/@oak/oak/16.1.0/http_server_node.ts
var NodeRequest = class {
  #request;
  #response;
  #responded = false;
  get remoteAddr() {
    const addr = this.#request.socket.address();
    return addr && addr?.address;
  }
  get headers() {
    return new Headers(this.#request.headers);
  }
  get method() {
    return this.#request.method ?? "GET";
  }
  get url() {
    return this.#request.url ?? "";
  }
  constructor(request, response) {
    this.#request = request;
    this.#response = response;
  }
  // deno-lint-ignore no-explicit-any
  error(reason) {
    if (this.#responded) {
      throw new Error("Request already responded to.");
    }
    let error;
    if (reason) {
      error = reason instanceof Error ? reason : new Error(String(reason));
    }
    this.#response.destroy(error);
    this.#responded = true;
  }
  getBody() {
    let body;
    if (this.method === "GET" || this.method === "HEAD") {
      body = null;
    } else {
      body = new ReadableStream({
        start: (controller) => {
          this.#request.on("data", (chunk) => {
            controller.enqueue(chunk);
          });
          this.#request.on("error", (err) => {
            controller.error(err);
          });
          this.#request.on("end", () => {
            controller.close();
          });
        }
      });
    }
    return body;
  }
  async respond(response) {
    if (this.#responded) {
      throw new Error("Requested already responded to.");
    }
    for (const [key, value] of response.headers) {
      this.#response.setHeader(key, value);
    }
    this.#response.writeHead(response.status, response.statusText);
    if (response.body) {
      for await (const chunk of response.body) {
        const { promise: promise2, resolve: resolve2, reject } = createPromiseWithResolvers();
        this.#response.write(chunk, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve2();
          }
        });
        await promise2;
      }
    }
    const { promise, resolve } = createPromiseWithResolvers();
    this.#response.end(resolve);
    await promise;
    this.#responded = true;
  }
};
var Server = class {
  #abortController = new AbortController();
  #host;
  #port;
  #requestStream;
  constructor(_app, options) {
    this.#host = options.hostname ?? "127.0.0.1";
    this.#port = options.port ?? 80;
    options.signal?.addEventListener("abort", () => {
      this.close();
    }, { once: true });
  }
  close() {
    this.#abortController.abort();
  }
  async listen() {
    const { createServer } = await import("node:http");
    let server;
    this.#requestStream = new ReadableStream({
      start: (controller) => {
        server = createServer((req, res) => {
          controller.enqueue(new NodeRequest(req, res));
        });
        this.#abortController.signal.addEventListener(
          "abort",
          () => controller.close(),
          { once: true }
        );
      }
    });
    server.listen({
      port: this.#port,
      host: this.#host,
      signal: this.#abortController.signal
    });
    return {
      addr: {
        port: this.#port,
        hostname: this.#host
      }
    };
  }
  [Symbol.asyncIterator]() {
    if (!this.#requestStream) {
      throw new TypeError("stream not properly initialized");
    }
    return this.#requestStream[Symbol.asyncIterator]();
  }
  static type = "node";
};
export {
  NodeRequest,
  Server
};
