var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// https://jsr.io/@oak/oak/16.1.0/utils/create_promise_with_resolvers.ts
var hasPromiseWithResolvers = "withResolvers" in Promise;
function createPromiseWithResolvers() {
  if (hasPromiseWithResolvers) {
    return Promise.withResolvers();
  }
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

export {
  __export,
  createPromiseWithResolvers
};
