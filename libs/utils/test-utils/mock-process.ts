import { EventEmitter } from "@std/events";

export class MockChildProcess extends EventEmitter implements Deno.ChildProcess {
  private emitter = new EventEmitter();

  killed = false;
  pid = Math.floor(Math.random() * 1000);
  status = Promise.resolve({ success: true, code: 0 });
  stdout: ReadableStream<Uint8Array>;
  stderr: ReadableStream<Uint8Array>;
  stdin: WritableStream<Uint8Array>;

  constructor() {
    super();
    // Create mock streams
    this.stdout = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode("test output\n"));
        controller.close();
      }
    });
    this.stderr = new ReadableStream({
      start(controller) {
        controller.close();
      }
    });
    this.stdin = new WritableStream();
  }

  kill(_signo?: string): void {
    this.killed = true;
    this.emitter.emit('close');
  }

  ref(): void {}
  unref(): void {}
  close(): void {}

  emit(event: string, ...args: any[]): boolean {
    return this.emitter.emit(event, ...args);
  }

  on(event: string, listener: (...args: any[]) => void): this {
    this.emitter.on(event, listener);
    return this;
  }
}

export const createMockProcess = () => new MockChildProcess();
