import {debounce} from "#async";
import { runCommand, withTryCatch } from "@libs/utils";

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
      withTryCatch(() => p.kill("SIGTERM"));
    }
  }

  spawn(_cmd: string) {
    this.debounce(_cmd);
  }


  private _spawn(_cmd: string) {
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
