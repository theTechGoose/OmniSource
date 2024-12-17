import { assertEquals, assertInstanceOf } from "#std/assert";
import { withTryCatch } from "./with-try-catch.ts";

Deno.test("withTryCatch", async (t) => {
  await t.step("should handle successful synchronous execution", () => {
    const fn = () => 42;
    const result = withTryCatch(fn);
    if (result instanceof Promise) {
      throw new Error("Expected synchronous result");
    }
    assertEquals(result[0], 42);
    assertEquals(result[1], null);
  });

  await t.step("should handle synchronous errors", () => {
    const fn = () => {
      throw new Error("test error");
    };
    const result = withTryCatch(fn);
    if (result instanceof Promise) {
      throw new Error("Expected synchronous result");
    }
    const error = result[1] as Error;
    assertInstanceOf(error, Error);
    assertEquals(result[0], undefined);
    assertEquals(error.message, "test error");
  });

  await t.step("should handle successful async execution", async () => {
    const fn = async () => Promise.resolve(42);
    const result = await withTryCatch(fn);
    assertEquals(result[0], 42);
    assertEquals(result[1], null);
  });

  await t.step("should handle async errors", async () => {
    const fn = async () => {
      throw new Error("async error");
    };
    const result = await withTryCatch(fn);
    const error = result[1] as Error;
    assertInstanceOf(error, Error);
    assertEquals(result[0], undefined);
    assertEquals(error.message, "async error");
  });

  await t.step("should handle rejected promises", async () => {
    const fn = async () => Promise.reject(new Error("rejected"));
    const result = await withTryCatch(fn);
    const error = result[1] as Error;
    assertInstanceOf(error, Error);
    assertEquals(result[0], undefined);
    assertEquals(error.message, "rejected");
  });

  await t.step("should convert non-Error throws to Error objects", () => {
    const fn = () => {
      throw "string error";
    };
    const result = withTryCatch(fn);
    if (result instanceof Promise) {
      throw new Error("Expected synchronous result");
    }
    const error = result[1] as Error;
    assertInstanceOf(error, Error);
    assertEquals(result[0], undefined);
    assertEquals(error.message, "string error");
  });
});
