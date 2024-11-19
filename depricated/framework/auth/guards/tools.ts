import type { RouterContext } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { Resolver } from "@core";

const {resolver} = Resolver.resolveWithCurrentInstance__Danger__();

export abstract class BaseAuth {
  abstract canActivate(ctx: RouterContext<any,any,any>): Boolean;
  abstract respondToUnauthorized(ctx: RouterContext<any,any,any>): void;
}

export function Auth(target: string, data: any = {}): any {
  return resolver.add(target, data);
}
