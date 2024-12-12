import { assertEquals } from "#std/assert";
import { Dependency } from "../decorator/mod.ts";
import { DependencyManifest } from "../manifest/mod.ts";
import { Resolver } from "./mod.ts";
import "#reflect";

Deno.test("Resolver - resolve single dependency", () => {
  @Dependency()
  class TestClass {
    method() {
      return "test";
    }
  }

  const manifest = new DependencyManifest();
  const resolver = new Resolver(manifest);
  const instance = resolver.resolve(TestClass) as TestClass;

  assertEquals(instance instanceof TestClass, true);
  assertEquals(instance.method(), "test");
});

Deno.test("Resolver - resolve multiple dependencies", () => {
  @Dependency()
  class Dep1 {
    value = "dep1";
  }

  @Dependency()
  class Dep2 {
    value = "dep2";
  }

  const manifest = new DependencyManifest();
  const resolver = new Resolver(manifest);
  const [instance1, instance2] = resolver.resolveAll([Dep1, Dep2]) as [Dep1, Dep2];

  assertEquals(instance1 instanceof Dep1, true);
  assertEquals(instance2 instanceof Dep2, true);
  assertEquals(instance1.value, "dep1");
  assertEquals(instance2.value, "dep2");
});
