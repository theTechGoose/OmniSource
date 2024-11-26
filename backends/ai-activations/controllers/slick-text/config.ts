import {NoAuth, Controller} from "@shared/denomite";

@Controller
export class SlickTextV001 extends NoAuth {
  "POST /opt-in" = "./opt-contact-in/V001.ts";
}

