/// <reference lib="es2015" />
/// <reference lib="es2015.promise" />

declare namespace Deno {
  interface TestContext {
    name: string;
    step(name: string, fn: (t: TestContext) => void | Promise<void>): Promise<void>;
  }

  interface TestDefinition {
    (name: string, fn: (t: TestContext) => void | Promise<void>): void;
    only(name: string, fn: (t: TestContext) => void | Promise<void>): void;
    ignore(name: string, fn: (t: TestContext) => void | Promise<void>): void;
  }

  const test: TestDefinition;
}

declare module "#std/assert" {
  export function assertEquals<T>(actual: T, expected: T, msg?: string): void;
  export function assertExists<T>(actual: T, msg?: string): void;
  export function assertInstanceOf<T>(actual: unknown, expectedType: new (...args: any[]) => T, msg?: string): void;
}

declare interface Error {
  message: string;
  name: string;
  stack?: string;
}
