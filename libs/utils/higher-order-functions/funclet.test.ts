import { assertEquals, assertExists } from "#std/assert";
import { createFunclet } from "./funclet.ts";

Deno.test("createFunclet", async (t) => {
  await t.step("should create a funclet with a vault", () => {
    const vault = { data: "test" };
    const fn = (x: number) => x * 2;
    const funclet = createFunclet(vault, fn);

    assertEquals(funclet(2), 4);
    assertEquals(funclet.vault, vault);
  });

  await t.step("should preserve function behavior", () => {
    const vault = { counter: 0 };
    const fn = function(this: unknown, x: number) {
      return x + (this === globalThis ? 1 : 0);
    };
    const funclet = createFunclet(vault, fn);

    assertEquals(funclet(5), 6);
    assertExists(funclet.vault);
  });

  await t.step("should handle complex vault objects", () => {
    const vault = {
      nested: { value: 42 },
      array: [1, 2, 3],
      method: () => "test"
    };
    const fn = () => vault.nested.value;
    const funclet = createFunclet(vault, fn);

    assertEquals(funclet(), 42);
    assertEquals(funclet.vault.array, [1, 2, 3]);
    assertEquals(funclet.vault.method(), "test");
  });
});
