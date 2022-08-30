export type Tail<T extends unknown[]> = T extends [unknown, ...infer Tail]
  ? Tail
  : never;
