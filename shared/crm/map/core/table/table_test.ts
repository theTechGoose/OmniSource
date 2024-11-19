import { CrmTable } from "./table.ts";
import json from "./sample.json" with { type: "json" };
import { stub } from "https://deno.land/x/mock@0.15.2/mod.ts";
import { assertGreater } from "jsr:@std/assert/greater";
import { assertNotEquals } from "https://deno.land/std@0.130.0/testing/asserts.ts";

// use this to generate new samples
//Deno.test("It should sample a table", async () => {
//       const table = new CrmTable("table", "bpb28qsnn");
//       await table.createSample(import.meta.url, 'load')
//
//      })
//
//
//
 
async function createTestTable() {
  const table = new CrmTable("table", "bpb28qsnn");
  stub(table, "DO_NOT_USE_requestMap", () => {
    return Promise.resolve({ data: json });
  });
  return await table.load()
}

Deno.test("It should load a table", async () => {
  const table = await createTestTable()
  const fieldsAsIds = table.fieldsAsIds()
  assertGreater(fieldsAsIds.length, 100)
});

Deno.test("It should get writeable fields", async () => {
  const table = await createTestTable()
  const writeable = table.asWriteable()
  assertNotEquals(writeable.length, table.fields.length)
})

