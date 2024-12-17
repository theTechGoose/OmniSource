import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";

export abstract class GenericAuth {
  canActivate(ctx: RouterContext<any>) {
    return true;
  }
}
