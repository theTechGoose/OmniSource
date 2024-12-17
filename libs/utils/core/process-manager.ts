import { debounce } from "@std/async";
import { runCommand } from "./run-cmd.ts";

export class ProcessManager {
  processes = [] as Array<Deno.ChildProcess>;
  debouncer = {} as any;
  constructor(private root: string) {
    Deno.addSignalListener("SIGTERM", () => {
      this.killAll();
    });
  }

  killAll() {
    for (const p of this.processes) {
      try {
        p.kill("SIGTERM");
      } catch (e) {
        console.error('Error killing process:', e);
      }
    }
  }

  spawn(_cmd: string) {
    this.debounce(_cmd);
  }

  // Changed from private to protected for testing
  protected _spawn(_cmd: string) {
    const cmd = _cmd.split(" ");
    const p = runCommand(this.root, cmd);
    this.processes.push(p);
    return p;
  }

  private debounce(cmd: string) {
    const debouncer = this.debouncer[cmd];
    if(debouncer) debouncer();
    const newDebouncer = debounce(() => {
      this._spawn(cmd);
    }, 3000);
    this.debouncer[cmd] = newDebouncer;
    newDebouncer();
  }

  handleChange(cmds: string[], comment?: string) {
    if (comment) console.log(comment);
    this.killAll();
    for (const _cmd of cmds) {
      this.spawn(_cmd);
    }
  }
}
