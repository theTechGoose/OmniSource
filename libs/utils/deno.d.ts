/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="dom" />

declare namespace Deno {
  export interface Command {
    new(command: string, options?: { args?: string[]; cwd?: string }): Command;
    spawn(): ChildProcess;
  }

  export interface ChildProcess {
    pid: number;
    killed: boolean;
    status: Promise<ProcessStatus>;
    kill(signal?: string): void;
    output(): Promise<Uint8Array>;
    stderrOutput(): Promise<Uint8Array>;
    stdin: null | Writer;
    stdout: null | Reader;
    stderr: null | Reader;
    ref(): void;
    unref(): void;
    close(): void;
  }

  export interface ProcessStatus {
    success: boolean;
    code: number;
  }

  export interface Writer {
    write(p: Uint8Array): Promise<number>;
  }

  export interface Reader {
    read(p: Uint8Array): Promise<number | null>;
  }

  export const Command: {
    new(command: string, options?: { args?: string[]; cwd?: string }): Command;
  };

  export function test(name: string, fn: (t: TestContext) => void | Promise<void>): void;

  export interface TestContext {
    name: string;
    step(name: string, fn: () => void | Promise<void>): Promise<void>;
    beforeEach(fn: () => void | Promise<void>): void;
    afterEach(fn: () => void | Promise<void>): void;
  }

  export function addSignalListener(signal: string, handler: () => void): void;
}

declare interface Window {
  runCommand: (root: string, cmd: string[]) => Deno.ChildProcess;
}

declare const runCommand: (root: string, cmd: string[]) => Deno.ChildProcess;
