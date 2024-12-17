import { EventEmitter } from '../deps.ts';

export class MockChildProcess extends EventEmitter implements Deno.ChildProcess {
  private emitter = new EventEmitter();

  killed = false;
  pid = Math.floor(Math.random() * 1000);
  status = Promise.resolve({ success: true, code: 0 });
  stdin: null | Deno.Writer = null;
  stdout: null | Deno.Reader = null;
  stderr: null | Deno.Reader = null;

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
