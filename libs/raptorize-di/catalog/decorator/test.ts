import { assertEquals } from "../../deps.ts";
import { Reflect } from "../../deps.ts";
import { Dependency } from "./mod.ts";
import { λ } from "../../setup/loader/mod.ts";
import type { ExtendedConstructor } from "../../mod.ts";

Deno.test("Dependency decorator should register class with manifest", () => {
  // Test class
  @Dependency
  class TestClass {}

  // Verify metadata
  Reflect.defineMetadata("design:paramtypes", [], TestClass);

  // Get registered dependency
  const dep = λ.vault.manifest.getDependencyById((TestClass as any).id);

  // Assert
  assertEquals(dep !== undefined, true);
  assertEquals(typeof (TestClass as any).id, "string");
});

Deno.test("Dependency decorator should handle constructor parameters", () => {
  // Test classes
  @Dependency
  class Dep1 {
    static id: string;
  }

  @Dependency
  class Dep2 {
    constructor(public dep1: Dep1) {}
  }

  // Setup metadata
  Reflect.defineMetadata("design:paramtypes", [], Dep1);
  Reflect.defineMetadata("design:paramtypes", [Dep1], Dep2);

  // Get registered dependencies
  const dep1 = λ.vault.manifest.getDependencyById((Dep1 as any).id);
  const dep2 = λ.vault.manifest.getDependencyById((Dep2 as any).id);

  // Assert
  assertEquals(dep1 !== undefined, true);
  assertEquals(dep2 !== undefined, true);
  assertEquals(dep2?.parameters.length, 1);
  assertEquals(dep2?.parameters[0], Dep1 as unknown as ExtendedConstructor);
});
