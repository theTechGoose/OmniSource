import { h } from "preact";
import { Button } from "../../components/Button/mod.tsx";

function CodePreview({ code }: { code: string }) {
  return (
    <pre class="bg-gray-100 p-4 rounded-lg overflow-x-auto">
      <code class="text-sm">{code}</code>
    </pre>
  );
}

export default function Stories() {
  return (
    <div class="space-y-8">
      <section class="space-y-4">
        <h2 class="text-xl font-bold">Default Button</h2>
        <div class="space-x-2">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
        </div>
        <CodePreview
          code={`<Button>Default</Button>
<Button disabled>Disabled</Button>`}
        />
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-bold">Button Variants</h2>
        <div class="space-x-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <CodePreview
          code={`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>`}
        />
      </section>

      <section class="space-y-4">
        <h2 class="text-xl font-bold">Button Sizes</h2>
        <div class="space-x-2">
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <CodePreview
          code={`<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>`}
        />
      </section>
    </div>
  );
}

export const description = (
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">Button Component</h1>
    <p>
      A versatile button component that supports different variants, sizes, and
      states. Built with Preact and styled using Tailwind CSS.
    </p>

    <h2 class="text-xl font-bold">Usage</h2>
    <CodePreview
      code={`import { Button } from "@core-ui/components/Button/mod.tsx";

// Default button
<Button>Click me</Button>

// Variant examples
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>

// Size examples
<Button size="small">Small</Button>
<Button size="medium">Medium</Button>
<Button size="large">Large</Button>

// Disabled state
<Button disabled>Disabled</Button>`}
    />
  </div>
);
