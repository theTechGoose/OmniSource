import "@global_models"
import { Dep } from "@core";
import { InboundEmail } from "./lib/inbound-email.ts";
export * from "./lib/inbound-email.ts"

@Dep
export class Postmark {
  parseEmail(email: InboundPostmarkEmail) {
    return new InboundEmail(email);
  }
}



