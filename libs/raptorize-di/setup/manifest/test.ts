import { assertEquals } from "../../deps.ts";
import { DependencyManifest, PreparedDependency } from "./mod.ts";

Deno.test("DependencyManifest - addDependency", () => {
  class TestClass {}
  const manifest = new DependencyManifest();
  const dep = new PreparedDependency(TestClass as any, []);

  manifest.addDependency(dep);
  const found = manifest.getDependencyById(dep.id);

  assertEquals(found, dep);
});

Deno.test("DependencyManifest - prevent duplicate dependencies", () => {
  class TestClass {}
  const manifest = new DependencyManifest();
  const dep = new PreparedDependency(TestClass as any, []);

  manifest.addDependency(dep);
  manifest.addDependency(dep); // Try to add same dependency twice

  let count = 0;
  manifest.forEach(() => count++);

  assertEquals(count, 1);
});

Deno.test("PreparedDependency - buildInstance with dependencies", () => {
  class Dep1 {}
  class Dep2 {
    constructor(public dep1: Dep1) {}
  }


  const manifest = new DependencyManifest();
  const dep1 = new PreparedDependency(Dep1 as any, []);
  const dep2 = new PreparedDependency(Dep2 as any, [Dep1 as any]);

  manifest.addDependency(dep1);
  manifest.addDependency(dep2);

  const instance = dep2.buildInstance(manifest);

  assertEquals(instance instanceof Dep2, true);
  assertEquals((instance as Dep2).dep1 instanceof Dep1, true);
});
