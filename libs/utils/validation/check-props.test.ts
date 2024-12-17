import { assertEquals, assertThrows } from "#std/assert";
import { chkProps } from "./check-props.ts";

Deno.test("chkProps", async (t) => {
  await t.step("should return true when all properties exist", () => {
    const obj = { name: "test", age: 25, active: true };
    assertEquals(chkProps(obj, "name", "age", "active"), true);
  });

  await t.step("should return false when property is missing", () => {
    const obj = { name: "test", active: true };
    assertEquals(chkProps(obj, "name", "age", "active"), false);
  });

  await t.step("should throw when target is not truthy", () => {
    assertThrows(
      () => chkProps(null, "prop"),
      Error,
      "Target must be truthy"
    );
    assertThrows(
      () => chkProps(undefined, "prop"),
      Error,
      "Target must be truthy"
    );
  });

  await t.step("should throw when target is not an object", () => {
    assertThrows(
      () => chkProps("not an object", "prop"),
      Error,
      "Target must be an object"
    );
    assertThrows(
      () => chkProps(42, "prop"),
      Error,
      "Target must be an object"
    );
  });

  await t.step("should work with empty property list", () => {
    const obj = { name: "test" };
    assertEquals(chkProps(obj), true);
  });

  await t.step("should handle inherited properties", () => {
    class TestClass {
      prop = "test";
    }
    const obj = new TestClass();
    assertEquals(chkProps(obj, "prop"), true);
  });
});
