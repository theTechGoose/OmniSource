import Denomite from "@denomite";

@Denomite.Controller
export class NightlyReport extends Denomite.NoAuth {
  version = "001";
  "GET /hello-world" = "./bland-input/endpoint-test.ts";
}
