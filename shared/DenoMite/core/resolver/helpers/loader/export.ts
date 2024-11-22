
type Constructor<T> = new (...args: any[]) => T;

export function $<T>(cls: Constructor<T>): T {
    return new cls();
}
