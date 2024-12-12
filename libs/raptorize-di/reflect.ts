import "#reflect";

declare global {
  interface Constructor<T = any> {
    new (...args: any[]): T;
    id?: string;
    name: string;
  }

  interface Window {
    Reflect: {
      getMetadata(metadataKey: string, target: object): any;
      defineMetadata(metadataKey: string, metadataValue: any, target: object): void;
    };
  }
}

export type { Constructor };
