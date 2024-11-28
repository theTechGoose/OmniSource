import { runCommand, withTryCatch } from "@shared/utils";

export class ProcessManager {
  processes = [] as Array<Deno.ChildProcess>;
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
    const cmd = _cmd.split(" ");
    const p = runCommand(this.root, cmd);
    this.processes.push(p);
    return p;
  }

  handleChange(cmds: string[], comment?: string) {
    if (comment) console.log(comment);
    this.killAll();
    for (const _cmd of cmds) {
      this.spawn(_cmd);
    }
  }
}
