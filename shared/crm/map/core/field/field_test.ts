import { assertEquals } from "jsr:@std/assert/equals";
import {Field} from './field.ts';
import json from './sample.json' with {type: "json"};

Deno.test("It should serialize a field", () => {
  const field = new Field(json);
  assertEquals(typeof field.serialize(), 'string');
  assertEquals(field.writeable, false);
})


Deno.test("It should make a field writeable", () => {

})


