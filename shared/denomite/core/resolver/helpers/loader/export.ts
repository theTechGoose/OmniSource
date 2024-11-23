
type Constructor<T> = new (...args: any[]) => T;

export function λ<T>(cls: Constructor<T>): T {
    return new cls();
}
