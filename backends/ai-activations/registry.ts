import { DupeTestController } from "./dupe-test/config.ts";

import dupeTestRunV001 from "./dupe-test/e1/v001.ts";

export const registry = [
  {
    method: "post",
    route: "dupe-test/run/V001",
    handler: dupeTestRunV001,
    auth: new DupeTestController().canActivate,
  },
];
