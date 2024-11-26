import {Auth} from "@root/models.ts";

export class NoAuth implements Auth {
  canActivate(ctx: Ctx): boolean {
    return true;
  }
}

