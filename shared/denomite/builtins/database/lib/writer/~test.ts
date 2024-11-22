import { assertEquals } from "@std/assert/equals";
import { Writer } from "./~lib.ts";

Deno.test("Should write a piece of data", () => {
const testData = [{ a: "a", b: "b" }]
const testPath = [[1, 2, "a"]]
  const writer = new Writer(testData, testPath);
  const payload = writer.exec()
  assertEquals(payload, [{ path: testPath[0], value: testData[0] }]);
});
