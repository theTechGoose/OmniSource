import { Ctx } from "../../../builtins/~index.ts";
import {Auth} from '../~mod.ts';
import { Context } from "https://deno.land/x/oak/mod.ts";


export class NoAuth extends Auth {
  canActivate(ctx: Ctx): boolean {
    return true;
  }
}
