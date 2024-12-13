/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.window" />

import { JSX as PreactJSX } from "preact";
import { ComponentChildren } from "preact";

declare module "preact" {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare global {
  const React: {
    createElement: typeof h;
  };
}
