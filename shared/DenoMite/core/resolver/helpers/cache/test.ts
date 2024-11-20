import { assertEquals, assertThrows } from "@std/assert";
import { Reflect } from "@reflect";
import { ResolverCache } from "./~mod.ts";
import { metadataKeys } from "@constants";

let resolver: ResolverCache;
function setup() {
  resolver = new ResolverCache();
}

class Test1 {}
class Test2 {}

Deno.test("it should have an empty cache", () => {
  setup();
  const cache = resolver["cache"];
  assertEquals(cache, []);
});

Deno.test("it should not allow for adding to the cache twice", () => {
  setup();

  assertThrows(
    () => {
      resolver.add(new Test1());
      resolver.add(new Test1());
    },
    Error, // Expected error type
  );
});

Deno.test("it should add to the cache", () => {
  setup();
  resolver.add(new Test1());
  const cache = resolver["cache"];
  assertEquals(cache, [resolver.constructToken(new Test1())]);
});

Deno.test("it should replace a class with another", () => {
  setup();
  resolver.add(new Test1());
  resolver.replace(Test1, new Test2());
  const cache = resolver["cache"];
  const compareToken =resolver.constructToken(new Test2(), Test1)
  assertEquals(cache, [compareToken]);
});

Deno.test("it should not replace a class with another", () => {
  setup();
  resolver.add(new Test1());
  resolver.replace(Test2, new Test2());
  const cache = resolver["cache"];
  assertEquals(cache, [resolver.constructToken(new Test1())]);
});

Deno.test("it should get a class", () => {
  setup();
  resolver.add(new Test1());
  const cache = resolver.get(Test1);
  assertEquals(cache, new Test1());
});

Deno.test("it should determine if a class is not cacheable", () => {
  setup();
  const { isNotCacheable } = metadataKeys;
  Reflect.defineMetadata(isNotCacheable, true, Test1);
  const result = resolver.isNotCacheable(Test1);
  assertEquals(result, true);
  Reflect.defineMetadata(isNotCacheable, false, Test1);
  const result2 = resolver.isNotCacheable(Test1);
  assertEquals(result2, false);
});
