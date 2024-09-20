export type Tail<T extends unknown[]> = T extends [unknown, ...infer Tail]
  ? Tail
  : never;

export type Flatten<T> = T extends Array<infer U> ? U : T;

export type MaybeArray<T> = T | T[];
