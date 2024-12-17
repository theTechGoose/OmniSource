import { DupeTestController } from "./dupe-test/config.ts";
import { TestController } from "./test/config.ts";

import dupeTestRunV001 from "./dupe-test/e1/v001.ts";
import dupeTestRunV002 from "./dupe-test/e1/v002.ts";
import dupeTestListV001 from "./dupe-test/e2/v001.ts";
import dupeTestExecV001 from "./dupe-test/e3/v001.ts";
import testRun2V001 from "./test/e1/v001.ts";
import testRun2V002 from "./test/e1/v002.ts";
import testList2V001 from "./test/e2/v001.ts";
import testExec2V001 from "./test/e3/v001.ts";

export const registry = [
  {
    method: "post",
    route: "dupe-test/run/V001",
    handler: dupeTestRunV001,
    auth: new DupeTestController().canActivate,
  },
  {
    method: "post",
    route: "dupe-test/run/V002",
    handler: dupeTestRunV002,
    auth: new DupeTestController().canActivate,
  },
  {
    method: "get",
    route: "dupe-test/list/V001",
    handler: dupeTestListV001,
    auth: new DupeTestController().canActivate,
  },
  {
    method: "post",
    route: "dupe-test/exec/V001",
    handler: dupeTestExecV001,
    auth: new DupeTestController().canActivate,
  },
  {
    method: "post",
    route: "test/run2/V001",
    handler: testRun2V001,
    auth: new TestController().canActivate,
  },
  {
    method: "post",
    route: "test/run2/V002",
    handler: testRun2V002,
    auth: new TestController().canActivate,
  },
  {
    method: "get",
    route: "test/list2/V001",
    handler: testList2V001,
    auth: new TestController().canActivate,
  },
  {
    method: "post",
    route: "test/exec2/V001",
    handler: testExec2V001,
    auth: new TestController().canActivate,
  },
];
