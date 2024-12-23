import { assert, assertEquals, assertStrictEquals } from "#assert";
import { PreparedDependency, DependencyManifest } from "./_mod.ts";

/**
 * Mock Classes and ExtendedConstructor Stubs
 * ------------------------------------------
 * We need classes that mimic what ExtendedConstructor might look like.
 * ExtendedConstructor in your code has .id, .name, and is a constructor function.
 * The examples below illustrate minimal mocks.
 */

class Bar {
  // Mimic that ExtendedConstructor can have .id, .name, etc.
  static id = "Bar";
  static name = "Bar";
  // A typical class might accept no parameters.
  constructor() {}
}

class Foo {
  // Also mimic .id, .name
  static id = "Foo";
  static name = "Foo";

  // Let’s say Foo depends on Bar
  constructor(public bar: Bar) {}
}

/**
 * Tests for PreparedDependency
 */
Deno.test("PreparedDependency should set id from target if available", () => {
  const dep = new PreparedDependency(Foo, [Bar]);
  // Since Foo has a static id = 'Foo', PreparedDependency should use that
  assertEquals(dep.id, "Foo");
});

Deno.test("PreparedDependency should generate a nanoid if target has no id", () => {
  class Qux {
    // no static id provided
    static name = "Qux";
    constructor() {}
  }
  const dep = new PreparedDependency(Qux, []);
  // We just ensure that it's not empty and not the class name:
  assert(dep.id !== "");
  assert(dep.id !== "Qux");
});

Deno.test("PreparedDependency should build an instance only once", () => {
  const dep = new PreparedDependency(Foo, [Bar]);
  const manifest = new DependencyManifest();
  manifest.addDependency(dep);

  const instance1 = dep.buildInstance(manifest);
  const instance2 = dep.buildInstance(manifest);

  // Should not rebuild the instance
  assertStrictEquals(instance1, instance2);
});

Deno.test("PreparedDependency should build correct instance with dependencies", () => {
  const barDep = new PreparedDependency(Bar, []);
  const fooDep = new PreparedDependency(Foo, [Bar]);
  const manifest = new DependencyManifest();
  manifest.addDependency(barDep);
  manifest.addDependency(fooDep);

  const fooInstance = fooDep.buildInstance(manifest);
  assert(fooInstance instanceof Foo);
  // Verify the bar instance was automatically built and injected
  assert(fooInstance.bar instanceof Bar);
});

Deno.test("PreparedDependency should build manual instance with buildManual", () => {
  // Example class with 2 parameters
  class MyTestClass {
    static id = "MyTestClass";
    static name = "MyTestClass";
    constructor(public arg1: string, public arg2: number) {}
  }

  const dep = new PreparedDependency(MyTestClass, []);
  dep.buildManual("Hello", 123);

  assert(dep.instance instanceof MyTestClass);
  const instance = dep.instance as MyTestClass;
  assertEquals(instance.arg1, "Hello");
  assertEquals(instance.arg2, 123);
});

/**
 * Tests for DependencyManifest
 */
Deno.test("DependencyManifest should add dependencies and skip duplicates", () => {
  const manifest = new DependencyManifest();
  const dep1 = new PreparedDependency(Foo, [Bar]);
  const dep2 = new PreparedDependency(Foo, [Bar]); // same ID = "Foo"

  manifest.addDependency(dep1);
  manifest.addDependency(dep2); // should be skipped due to duplicate ID

  let count = 0;
  manifest.forEach(() => count++);
  assertEquals(count, 1, "Should only have added one dependency");
});

Deno.test("DependencyManifest init() should build all instances", () => {
  const barDep = new PreparedDependency(Bar, []);
  const fooDep = new PreparedDependency(Foo, [Bar]);

  const manifest = new DependencyManifest();
  manifest.addDependency(barDep);
  manifest.addDependency(fooDep);

  // init() calls buildInstance on each dependency
  manifest.init();

  // Now both should have built instances
  assert(barDep.instance instanceof Bar);
  assert(fooDep.instance instanceof Foo);
  // Also ensure Foo got Bar injected
  const fooInstance = fooDep.instance as Foo;
  assert(fooInstance.bar instanceof Bar);
});

Deno.test("DependencyManifest getDependencyById() should return correct dependency", () => {
  const manifest = new DependencyManifest();
  const fooDep = new PreparedDependency(Foo, [Bar]);
  manifest.addDependency(fooDep);

  const lookedUp = manifest.getDependencyById("Foo");
  assertStrictEquals(lookedUp, fooDep);
});

Deno.test("DependencyManifest getDependencyByConstructor() should return correct dependency", () => {
  const manifest = new DependencyManifest();
  const barDep = new PreparedDependency(Bar, []);
  manifest.addDependency(barDep);

  // We use Bar (the constructor) to look it up
  const lookedUp = manifest.getDependencyByConstructor(Bar);
  assertStrictEquals(lookedUp, barDep);
});

