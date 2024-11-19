import { Resolver } from "@shared/framework";
import { DataHandler } from "./service.ts";
import json from "../../test-data/data-handler/take_two.json" with { type: "json" };

Deno.test("it should handle data from a csv", async () => {
  const {get} = Resolver.resolveWithCurrentInstance__Danger__(DataHandler);
  const dh = get();
 await dh.saveCalls(json as any);
});

