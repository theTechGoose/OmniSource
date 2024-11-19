export {}

declare global {
  interface RafaLogger {
   info(message: string, structuredData?: object): void;
   debug(message: string, structuredData?: object): void;
   warn(message: string, structuredData?: object): void;
   error(message: string, structuredData?: object): void;
   critical(message: string, structuredData?: object): void;
  }
}
