import "@global_models"
import { Dependency } from "@root/core/resolution/_mod.ts";
import { InboundEmail } from "../kit/inbound-email.ts";
export * from "../kit/inbound-email.ts"
import {OakCtx} from "@root/features/ctx/_mod.ts";


@Dependency
export class Postmark {
  constructor(private ctx: OakCtx) {}
  async getInboundEmail<T>() {
    console.log({ctx: this.ctx})
    const email = await this.ctx.body
    return new InboundEmail<T>(email);
  }
}



