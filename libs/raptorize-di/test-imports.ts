import { nanoid } from "#nanoid";
import { assertEquals } from "#std/assert";
import "#reflect";

// Test nanoid
const id = nanoid();
console.log("Generated ID:", id);

// Test assert
assertEquals(typeof id, "string");

// Test reflect-metadata
Reflect.defineMetadata("test", "value", {});
const value = Reflect.getMetadata("test", {});
assertEquals(value, "value");

console.log("All imports working correctly!");
