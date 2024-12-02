import {
  createPromiseWithResolvers
} from "./chunk-N3PSYYFW.js";

// https://jsr.io/@oak/oak/16.1.0/http_server_native_request.ts
var DomResponse = globalThis.Response ?? class MockResponse {
};
var maybeUpgradeWebSocket = "Deno" in globalThis && "upgradeWebSocket" in globalThis.Deno ? Deno.upgradeWebSocket.bind(Deno) : void 0;
function isNativeRequest(r) {
  return r instanceof NativeRequest;
}
var NativeRequest = class {
  #remoteAddr;
  // deno-lint-ignore no-explicit-any
  #reject;
  #request;
  #resolve;
  #resolved = false;
  #response;
  #upgradeWebSocket;
  constructor(request, info) {
    this.#remoteAddr = info.remoteAddr;
    this.#upgradeWebSocket = "upgradeWebSocket" in info ? info.upgradeWebSocket : maybeUpgradeWebSocket;
    this.#request = request;
    const { resolve, reject, promise } = createPromiseWithResolvers();
    this.#resolve = resolve;
    this.#reject = reject;
    this.#response = promise;
  }
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
    return this.#remoteAddr?.hostname;
  }
  get request() {
    return this.#request;
  }
  get response() {
    return this.#response;
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
  // deno-lint-ignore no-explicit-any
  error(reason) {
    if (this.#resolved) {
      throw new Error("Request already responded to.");
    }
    this.#reject(reason);
    this.#resolved = true;
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
  upgrade(options) {
    if (this.#resolved) {
      throw new Error("Request already responded to.");
    }
    if (!this.#upgradeWebSocket) {
      throw new TypeError("Upgrading web sockets not supported.");
    }
    const { response, socket } = this.#upgradeWebSocket(
      this.#request,
      options
    );
    this.#resolve(response);
    this.#resolved = true;
    return socket;
  }
};

export {
  DomResponse,
  isNativeRequest,
  NativeRequest
};
