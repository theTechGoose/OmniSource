import {NoAuth, Controller} from "@shared/denomite";

@Controller
export class BooksiActText extends NoAuth {
  "POST /opt-in" = "./opt-contact-in/V001.ts";
  //"POST /create-bland-transfer" = './'
}
