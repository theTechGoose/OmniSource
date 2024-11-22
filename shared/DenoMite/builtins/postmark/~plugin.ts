import "@global_models"
import { Dependency } from "@decorators/dependencies/~mod.ts";
import { InboundEmail } from "./lib/inbound-email.ts";
export * from "./lib/inbound-email.ts"

@Dependency
export class Postmark {
  parseEmail(email: InboundPostmarkEmail) {
    return new InboundEmail(email);
  }
}



