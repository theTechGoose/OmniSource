import { assertEquals } from "../../deps.ts";
import { Dependency } from "../../catalog/decorator/mod.ts";
import { λ } from "./mod.ts";

Deno.test("λ - resolve dependency instance", () => {
  @Dependency
  class TestClass {
    method() {
      return "test";
    }
  }

  const instance = λ(TestClass);
  assertEquals(instance instanceof TestClass, true);
  assertEquals(instance.method(), "test");
});

Deno.test("λ - resolve dependency with parameters", () => {
  @Dependency
  class Dep1 {
    value = "dep1";
  }

  @Dependency
  class Dep2 {
    constructor(public dep1: Dep1) {}
    getValue() {
      return this.dep1.value;
    }
  }

  const instance = λ(Dep2);
  assertEquals(instance instanceof Dep2, true);
  assertEquals(instance.getValue(), "dep1");
});

Deno.test("λ - throw error for unknown dependency", () => {
  class UnknownClass {}
  try {
    λ(UnknownClass);
    throw new Error("Should have thrown dependency not found error");
  } catch (error: unknown) {
    if (error instanceof Error) {
      assertEquals(error.message.includes("Dependency not found"), true);
    }
  }
});
