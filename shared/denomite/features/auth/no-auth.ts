import {Auth} from "@root/models.ts";
import {OakCtx} from "../ctx/_mod.ts";

export class NoAuth implements Auth {
  canActivate(ctx: OakCtx): boolean {
    return true;
  }
}

