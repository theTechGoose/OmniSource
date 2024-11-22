import type { Ctx } from "../../builtins/~index.ts";

export abstract class Auth {
  constructor() {
  }
  abstract canActivate(ctx: Ctx): boolean
}
