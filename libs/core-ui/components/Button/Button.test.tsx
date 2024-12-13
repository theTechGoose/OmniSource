import { h } from "preact";
import { Button } from "./mod.tsx";
import { assertEquals } from "$std/assert/mod.ts";
import { render } from "@testing-library/preact";

Deno.test("Button component", async (t) => {
  await t.step("renders with default props", () => {
    const { container } = render(<Button>Click me</Button>);
    const button = container.querySelector("button");
    assertEquals(button?.textContent, "Click me");
    assertEquals(button?.className.includes("bg-blue-600"), true); // primary variant
    assertEquals(button?.className.includes("px-4 py-2"), true); // medium size
  });

  await t.step("renders with custom variant and size", () => {
    const { container } = render(
      <Button variant="secondary" size="large">Large Button</Button>
    );
    const button = container.querySelector("button");
    assertEquals(button?.className.includes("bg-gray-200"), true); // secondary variant
    assertEquals(button?.className.includes("px-6 py-3"), true); // large size
  });

  await t.step("handles disabled state", () => {
    const { container } = render(<Button disabled>Disabled</Button>);
    const button = container.querySelector("button");
    assertEquals(button?.disabled, true);
    assertEquals(button?.className.includes("opacity-50"), true);
    assertEquals(button?.className.includes("cursor-not-allowed"), true);
  });
});
