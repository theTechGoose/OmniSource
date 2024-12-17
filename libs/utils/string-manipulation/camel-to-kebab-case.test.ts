import { assertEquals } from "#std/assert";
import { camelToKebabCase } from "./camel-to-kebab-case.ts";

Deno.test("camelToKebabCase", async (t) => {
  await t.step("should convert simple camelCase to kebab-case", () => {
    assertEquals(camelToKebabCase("camelCase"), "camel-case");
    assertEquals(camelToKebabCase("thisIsATest"), "this-is-a-test");
  });

  await t.step("should handle consecutive uppercase letters", () => {
    assertEquals(camelToKebabCase("XMLHttpRequest"), "xml-http-request");
    assertEquals(camelToKebabCase("ASimpleURL"), "a-simple-url");
  });

  await t.step("should handle numbers", () => {
    assertEquals(camelToKebabCase("component123Test"), "component123-test");
    assertEquals(camelToKebabCase("test123"), "test123");
  });

  await t.step("should handle edge cases", () => {
    assertEquals(camelToKebabCase(""), "");
    assertEquals(camelToKebabCase("alreadykebabcase"), "alreadykebabcase");
    assertEquals(camelToKebabCase("ALLCAPS"), "allcaps");
  });
});
