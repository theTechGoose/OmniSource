export type operationType = "read" | "write" | "list";

// paths
export type collapsedPathFragment = string | number
export type pathFragment<T = unknown> = collapsedPathFragment | pathFunction<T>;
export type pathFunction<T> = (t: T | null) => unknown;
