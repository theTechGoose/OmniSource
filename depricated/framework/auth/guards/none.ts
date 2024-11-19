import type { RouterContext } from "https://deno.land/x/oak@v17.1.3/router.ts";
import { Auth, BaseAuth } from "./tools.ts";



//@Auth
export class NoAuth extends BaseAuth {
  override respondToUnauthorized(ctx: RouterContext<any, any, any>): void { }

  override canActivate(ctx: RouterContext<any, any, any>): Boolean {
    return true;
  }
}
