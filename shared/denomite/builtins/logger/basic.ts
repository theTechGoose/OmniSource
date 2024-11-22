import { LoggerTemplate, type LoggerConfig } from "./template.ts";

export class BasicLogger extends LoggerTemplate {
  override config = {
 mechanisam: console.log
  } as unknown as LoggerConfig;
  debug(message: string, structuredData?: object) {
    this.log('debug', message, structuredData);
  }

  warn(message: string, structuredData?: object) {
    this.log('warn', message, structuredData);
  }

  error(message: string, structuredData?: object) {
    this.log('error', message, structuredData);
  }

  critical(message: string, structuredData?: object) {
    this.log('critical', message, structuredData);
  }

  info(message: string, structuredData?: object) {
    this.log('info', message, structuredData);
  }
}
