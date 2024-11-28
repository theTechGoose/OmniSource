import {runCommand} from "@shared/utils";

export class ProcessManager {
  processes = [] as Array<Deno.ChildProcess>
  constructor(private root: string) {}
  killAll() {
    for(const p of this.processes) {
      p.kill()
    }
  }

  spawn(_cmd: string) {
    const cmd = _cmd.split(' ')
    const p = runCommand(this.root, cmd)
    this.processes.push(p)
  }
  

   handleChange(cmds: string[], comment?: string) {
    if(comment) console.log(comment)
    this.killAll()
    for(const _cmd of cmds) {
      this.spawn(_cmd)
    }
  }
}
