import { DupeTestController } from "./dupe-test/config.ts";
import { TestController } from "./test/config.ts";

import dDpjRjvpDjwNrCshNFZfFlfnt from "./dupe-test/e1/v001.ts";
import JnLUUFmrRLNffkJQVfvpLfRzl from "./dupe-test/e1/v002.ts";
import YzhSrLdAxWniAjsaKVncKdUKS from "./dupe-test/e2/v001.ts";
import oKIxPoOlBqhESTztTDIGLMqug from "./dupe-test/e3/v001.ts";
import oBiUKkvnwZYSSlbNOaCacNniG from "./test/e1/v001.ts";
import AHBWFkJHkDmZqwiWiJeMOtuXi from "./test/e1/v002.ts";
import elHqnMfWXqgCFqERGmqqUNiZf from "./test/e2/v001.ts";
import QDtNNwkHzgHwtJSANFWRqBFcx from "./test/e3/v001.ts";

export const registry = [
  {
    method: "post",
    route: "dupe-test/run/V001",
    handler: dDpjRjvpDjwNrCshNFZfFlfnt,
    auth: new DupeTestController().canActivate,
  },
  {
    method: "post",
    route: "dupe-test/run/V002",
    handler: JnLUUFmrRLNffkJQVfvpLfRzl,
    auth: new DupeTestController().canActivate,
  },
  {
    method: "get",
    route: "dupe-test/list/V001",
    handler: YzhSrLdAxWniAjsaKVncKdUKS,
    auth: new DupeTestController().canActivate,
  },
  {
    method: "post",
    route: "dupe-test/exec/V001",
    handler: oKIxPoOlBqhESTztTDIGLMqug,
    auth: new DupeTestController().canActivate,
  },
  {
    method: "post",
    route: "test/run2/V001",
    handler: oBiUKkvnwZYSSlbNOaCacNniG,
    auth: new TestController().canActivate,
  },
  {
    method: "post",
    route: "test/run2/V002",
    handler: AHBWFkJHkDmZqwiWiJeMOtuXi,
    auth: new TestController().canActivate,
  },
  {
    method: "get",
    route: "test/list2/V001",
    handler: elHqnMfWXqgCFqERGmqqUNiZf,
    auth: new TestController().canActivate,
  },
  {
    method: "post",
    route: "test/exec2/V001",
    handler: QDtNNwkHzgHwtJSANFWRqBFcx,
    auth: new TestController().canActivate,
  },
];
