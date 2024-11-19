import {  injectable } from "npm:tsyringe";
import { RouteTracker, Resolver } from "@core";

const {resolver} = Resolver.resolveWithCurrentInstance__Danger__();


const tracker: Array<{method: string, path: string}>  = []
function createRouteDecorator(method?: string, path?: string) {
  const found = tracker.find((t) => t.method === method && t.path === path);
  return function(constructor: any) {
    const condition = (method && path ) &&found
    if(condition) return;
    if(method && path) tracker.push({method, path})
    console.log({target:constructor, method, path})
    resolver.add(constructor);
    if (!method || !path) return;
    console.log({method, path, constructor})
    RouteTracker.add({ method, path, constructor });
  };
}

export function Inject<T extends new (...args: Array<any>) => InstanceType<T>>(cl: T): InstanceType<T> {
  return resolver.resolve(cl);
}


export function controllerFactory(controller: string) {
  return {
    Get: decoratorFactory("get", controller),
    Post: decoratorFactory("post", controller),
  }
}

function decoratorFactory(method: string, _controller: string) {
  const controller = _controller.charAt(0) !== '/' ? `/${_controller}` : _controller;

  return (...path: string[]) => createRouteDecorator(method, `${controller}/${path.join("/")}`);
}

export function Get(...path: string[]) {
  return createRouteDecorator("get", `/${path.join("/")}`);
}

export function Post(...path: string[]) {
  return createRouteDecorator("post", `/${path.join("/")}`);
}

export function Dep(target: any, data: any = null): any {
  console.log({target})
  return resolver.add(target, data);
}

