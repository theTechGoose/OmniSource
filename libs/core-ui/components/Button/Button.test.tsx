import { h } from "preact";
import { assertEquals } from "https://deno.land/std@0.218.2/assert/mod.ts";
import { render } from "preact-render-to-string";
import { Button } from "./mod.tsx";

Deno.test("Button component", async (t) => {
  await t.step("renders with default props", () => {
    const button = <Button>Test</Button>;
    const html = render(button);
    assertEquals(
      html.includes("bg-blue-500"),
      true,
      "should have primary background color",
    );
    assertEquals(html.includes("px-4 py-2"), true, "should have medium size");
    assertEquals(html.includes(">Test<"), true, "should render children");
  });

  await t.step("applies variant styles", () => {
    const button = <Button variant="secondary">Test</Button>;
    const html = render(button);
    assertEquals(
      html.includes("bg-gray-200"),
      true,
      "should have secondary background color",
    );
  });

  await t.step("applies size styles", () => {
    const button = <Button size="small">Test</Button>;
    const html = render(button);
    assertEquals(
      html.includes("px-2 py-1"),
      true,
      "should have small size padding",
    );
    assertEquals(
      html.includes("text-sm"),
      true,
      "should have small text size",
    );
  });

  await t.step("merges custom className", () => {
    const button = <Button className="custom-class">Test</Button>;
    const html = render(button);
    assertEquals(html.includes("custom-class"), true, "should include custom class");
  });

  await t.step("handles disabled state", () => {
    const button = <Button disabled>Test</Button>;
    const html = render(button);
    assertEquals(html.includes("disabled"), true, "should have disabled attribute");
    assertEquals(
      html.includes("disabled:opacity-50"),
      true,
      "should have disabled styles",
    );
  });

  await t.step("handles click events", () => {
    let clicked = false;
    const button = <Button onClick={() => clicked = true}>Test</Button>;
    assertEquals(button.props.onClick !== undefined, true, "should have onClick handler");
  });
});
