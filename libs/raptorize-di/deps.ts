// Re-export dependencies for consistent versioning
export { nanoid } from "#nanoid";
export { assertEquals, assertThrows } from "#std/assert";
import "reflect-metadata";
export const { Reflect } = globalThis;
export type { Constructor } from "./mod.ts";
