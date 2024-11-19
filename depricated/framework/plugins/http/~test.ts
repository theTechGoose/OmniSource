import { assert } from "@std/assert";
import { Logger } from "@logger";
import {Resolver} from '@lib';
import { Http } from "./~plugin.ts";

Deno.test("it should make a request", async () => {
  const logger = Resolver.resolveWithCurrentInstance__Danger__(Logger).get();
  const axios = new Http(logger);
  const url = "https://jsonplaceholder.typicode.com/todos/1";
  const res = await axios.request({
    url,
    method: "GET",
  });
  assert(res);
});

Deno.test
