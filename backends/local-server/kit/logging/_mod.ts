import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { format } from "#date-fns";
import { homedir } from "node:os";

const now = new Date();
const MMDDYYHHMM = format(now, "MM:dd:yy:hh:mm");
const logDirPath = `${homedir()}/.deno/logs`;
const logFilePath = `log${MMDDYYHHMM}.txt`;

export class Logger {
  mechanisam: LoggerMechanisam;

  log(flag: string, msg: string, structuredData?: any) {
    const formattedData = this.formatStructuredData(structuredData);
    const formattedFlag = this.formatFlag(flag);
    const fMsg = `${formattedFlag} ${msg}\n${formattedData}`
    this.mechanisam.current(fMsg);
    this.logSeparator();
  }

  private logSeparator() {
    this.mechanisam.current("\n\n");
  }

  private formatFlag(flag: string) {
    return `[${flag.toUpperCase()}]`;
  }

  private formatStructuredData(data?: any) {
    if (!data) return "";
    return JSON.stringify(data, null, 2)
  }

  constructor(envOverride?: string) {
    this.mechanisam = new LoggerMechanisam(envOverride);
  }
}

function prodMechanisam(msg: string) {
  console.log(msg);
  const fullPath = join(logDirPath, logFilePath);
  if (!existsSync(logDirPath)) {
    mkdirSync(logDirPath, { recursive: true });
  }

  if (!existsSync(fullPath)) {
    writeFileSync(fullPath, msg);
  } else {
    appendFileSync(fullPath, msg);
  }
}

class LoggerMechanisam {
  dev = console.log;
  prod = prodMechanisam;
  current: Function;
  constructor(envOverride?: string) {
    const _env = Deno.env.get("ENV_TYPE");
    const env = envOverride || _env;
    this.current = env === "dev" ? this.dev : this.prod;
  }
}
