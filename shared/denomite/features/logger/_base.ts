import { withTryCatch } from "@shared/utils";

type LoggerLevels = "info" | "debug" | "warn" | "error" | "critical";

export interface LoggerConfig {
  mechanisam: (message: string) => void;
}

class LoggerHistoricalEntry {
  constructor(
    public level: LoggerLevels,
    public message: string,
    public structuredData?: object,
  ) {}
}

export abstract class LoggerTemplate {
  private history: Array<LoggerHistoricalEntry> = [];
  constructor(protected config: LoggerConfig) {}

  abstract info(message: string, structuredData?: object): void;
  abstract debug(message: string, structuredData?: object): void;
  abstract warn(message: string, structuredData?: object): void;
  abstract error(message: string, structuredData?: object): void;
  abstract critical(message: string, structuredData?: object): void;

  protected wrappedMechanisam(message: string) {
    const [_, error] = withTryCatch(() => this.config.mechanisam(message));
    if (error) throw new Error(error.message);
  }

  protected log(level: LoggerLevels, message: string, structuredData?: object) {
    this.history.push(
      new LoggerHistoricalEntry(level, message, structuredData),
    );
    const _structuredData = this.parseStructuredData(structuredData);
    this.wrappedMechanisam(`[${level.toUpperCase()}]::${message}`);
    if (_structuredData) this.wrappedMechanisam(_structuredData);
  }

  protected parseStructuredData(data?: object) {
    if (!data) return "";
    const [result] = withTryCatch(() => JSON.stringify(data, null, 2));
    if (result) return result;
    return "Error parsing structured data";
  }
}
