import { assertEquals } from "#std/assert";
import { withClosure } from "./with-closure.ts";

Deno.test("withClosure", async (t) => {
  await t.step("should pass arguments in correct order", () => {
    const fn = (a: number, b: number, c: number) => a + b + c;
    const wrapped = withClosure(fn, 3);

    assertEquals(wrapped(1, 2), 6);
  });

  await t.step("should handle no additional arguments", () => {
    const fn = (a: number, b: number) => a + b;
    const wrapped = withClosure(fn);

    assertEquals(wrapped(1, 2), 3);
  });

  await t.step("should handle multiple closure arguments", () => {
    const fn = (msg: string, prefix: string, suffix: string) => `${prefix}${msg}${suffix}`;
    const wrapped = withClosure(fn, "<<", ">>");

    assertEquals(wrapped("test"), "<<test>>");
  });

  await t.step("should preserve this context", () => {
    const obj = {
      value: 42,
      method: function(a: number) { return this.value + a; }
    };
    const wrapped = withClosure(obj.method.bind(obj), 8);

    assertEquals(wrapped(), 50);
  });
});
