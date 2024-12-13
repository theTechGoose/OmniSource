declare global {
  interface Constructor<T = any> {
    new (...args: any[]): T;
    id?: string;
    name: string;
    constructor: { name: string };
  }

  /** @deprecated Use Constructor instead */
  interface ExtendedConstructor<T = any> extends Constructor<T> {
    id: string;
  }

  namespace JSX {
    interface Element {
      type: any;
      props: any;
      key: string | null;
    }
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
