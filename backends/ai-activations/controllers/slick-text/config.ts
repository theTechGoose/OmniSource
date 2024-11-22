import Denomite from "@denomite";

@Denomite.Controller
export class SlickText extends Denomite.NoAuth {
  version = "001";
  "GET /opt-in" = "./opt-contact-in/endpoint.ts";
}
