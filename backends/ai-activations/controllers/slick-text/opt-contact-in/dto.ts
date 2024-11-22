import Denomite from "@denomite";
import { Ctx } from "@denomite/builtins/~index.ts";

@Denomite.Dependency
export class OptContactInDto {
  firstName!: string;
  dob!: string;
  phoneNumber!: string;
  lastName!: string;
  email!: string;
  city!: string;
  state!: string;
  zip!: string;

  constructor(ctx: Ctx) {
    Object.assign(this, ctx.body);
  }
}
