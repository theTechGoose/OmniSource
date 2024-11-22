import { assertEquals, assertThrows } from "@std/assert";
import { Resolver } from "./~mod.ts";
import { ResolverCache } from "./helpers/cache/~mod.ts"; // Adjust the import path as necessary
import { Reflect } from "@reflect"; // Ensure Reflect is available

let resolver: Resolver;
//let cache: ResolverCache;

const setup = () => {
  //cache = new ResolverCache();
  resolver = new Resolver();
  resolver.register(TestClass1);
  resolver.register(TestClass2);
  resolver.register(TestClass3);
  resolver.register(CircularA);
  resolver.register(CircularB);
  resolver.register(NoDepsClass);
};

// Test classes
class TestClass1 {}
class TestClass2 {}
  class NoDepsClass {}
class TestClass3 {
  constructor(public dep1: TestClass1, public dep2: TestClass2) {}
}

class CircularA {
  constructor(public b: CircularB) {}
}
class CircularB {
  constructor(public a: CircularA) {}
}

// Define metadata for dependency injection
Reflect.defineMetadata("design:paramtypes", [], TestClass1);
Reflect.defineMetadata("design:paramtypes", [], TestClass2);
Reflect.defineMetadata(
  "design:paramtypes",
  [TestClass1, TestClass2],
  TestClass3,
);
//['-A - env-file=.env.local -unstable-kv -config shared/denomite/deno.json --filter ''/"it should have an empty registry$/''']

Deno.test("it should have an empty registry", () => {
  const cache = new ResolverCache();
  resolver = new Resolver()
  const registry = resolver["registry"];
  assertEquals(registry.length, 0);
});

Deno.test("it should register a class", () => {
  setup();
  const registry = resolver["registry"];
  const isIncluded = registry.includes(TestClass1)
  assertEquals(isIncluded, true);
  assertEquals(registry[0] === TestClass1, true);
  assertEquals(registry.length, 6);
});

Deno.test("it should resolve a class instance", () => {
  setup();
  const instance = resolver.resolve(TestClass1);
  assertEquals(instance instanceof TestClass1, true);
});

Deno.test("it should cache resolved instances", () => {
  setup();
  const instance1 = resolver.resolve(TestClass1);
  const instance2 = resolver.resolve(TestClass1);
  assertEquals(instance1, instance2);
});

Deno.test("it should replace a class instance with another", () => {
  setup();
  const instance1 = resolver.resolve(TestClass1);
  const instance2 = resolver.resolve(TestClass2);
  const newInstance = new TestClass2();
  resolver.replace(TestClass1, newInstance);
  assertEquals(newInstance instanceof TestClass2, true);
  assertEquals(instance2, newInstance);
});

Deno.test("it should not replace a non-registered class", () => {
  setup();
  const instance1 = resolver.resolve(TestClass1);
  const newInstance = new TestClass2();
  resolver.replace(TestClass2, newInstance);
  const instance2 = resolver.resolve(TestClass1);
  assertEquals(instance2, instance1);
});

Deno.test("it should resolve dependencies", () => {
  setup();
  const instance = resolver.resolve(TestClass3);
  assertEquals(instance instanceof TestClass3, true);
  assertEquals(instance.dep1 instanceof TestClass1, true);
  assertEquals(instance.dep2 instanceof TestClass2, true);
});

Deno.test("it should not create multiple instances of singleton dependencies", () => {
  setup();
  const instance1 = resolver.resolve(TestClass3);
  const instance2 = resolver.resolve(TestClass3);
  assertEquals(instance1.dep1, instance2.dep1);
  assertEquals(instance1.dep2, instance2.dep2);
});

Deno.test("it should handle circular dependencies gracefully", () => {
  setup();

  Reflect.defineMetadata("design:paramtypes", [CircularB], CircularA);
  Reflect.defineMetadata("design:paramtypes", [CircularA], CircularB);

  assertThrows(
    () => resolver.resolve(CircularA),
    Error,
    "Maximum call stack size exceeded",
  );
});

Deno.test("it should retrieve constructor parameter types", () => {
  setup();
  const params = resolver.getParams(TestClass3);
  assertEquals(params.length, 2);
  assertEquals(params[0] instanceof TestClass1, true);
  assertEquals(params[1] instanceof TestClass2, true);
});


Deno.test("it should handle classes without constructor parameters", () => {
  setup();
  Reflect.defineMetadata("design:paramtypes", [], NoDepsClass);

  const instance = resolver.resolve(NoDepsClass);
  assertEquals(instance instanceof NoDepsClass, true);
});

Deno.test("it should respect the cache when resolving dependencies", () => {
  setup();
  const instance1 = resolver.resolve(TestClass1);
  const instance2 = resolver.resolve(TestClass1);
  assertEquals(instance1, instance2);
});

Deno.test("it should replace instances in the cache when using replace", () => {
  setup();
  resolver.resolve(TestClass1);
  const newInstance = new TestClass1();
  resolver.replace(TestClass1, newInstance);
  const instance = resolver.resolve(TestClass1);
  assertEquals(instance, newInstance);
});

Deno.test("it should correctly identify if a class is not in the registry", () => {
  setup();
  class UnregisteredClass {}
  const result = resolver["isNotInRegistry"](UnregisteredClass);
  assertEquals(result, false);
});

Deno.test("it should return true if class is in the registry", () => {
  setup();
  resolver.register(new TestClass1());
  const result = resolver["isNotInRegistry"](TestClass1);
  assertEquals(result, true);
});
