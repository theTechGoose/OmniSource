import { assertEquals } from "#std/assert";
import { push } from "./push-and-return.ts";

Deno.test("push", async (t) => {
  await t.step("should push element and return it", () => {
    const arr: number[] = [];
    const result = push(42, arr);
    assertEquals(result, 42);
    assertEquals(arr, [42]);
  });

  await t.step("should work with arrays containing elements", () => {
    const arr = [1, 2, 3];
    const result = push(4, arr);
    assertEquals(result, 4);
    assertEquals(arr, [1, 2, 3, 4]);
  });

  await t.step("should work with different types", () => {
    const strings: string[] = [];
    const result = push("test", strings);
    assertEquals(result, "test");
    assertEquals(strings, ["test"]);

    const objects: Array<{id: number}> = [];
    const obj = { id: 1 };
    const objResult = push(obj, objects);
    assertEquals(objResult, obj);
    assertEquals(objects, [{ id: 1 }]);
  });
});
