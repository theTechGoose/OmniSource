import "@global_models"
import { Dependency } from "@decorators/dependencies/~mod.ts";
import { InboundEmail } from "./lib/inbound-email.ts";
import { Ctx } from "../~index.ts";
export * from "./lib/inbound-email.ts"


@Dependency
export class Postmark {
  constructor(private ctx: Ctx) {}
  getInboundEmail<T>() {
    const email = this.ctx.body;
    return new InboundEmail<T>(email);
  }
}



