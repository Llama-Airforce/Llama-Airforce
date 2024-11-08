export type Tail<T extends unknown[]> = T extends [unknown, ...infer Tail]
  ? Tail
  : never;

export type Flatten<T> = T extends Array<infer U> ? U : T;

export type MaybeArray<T> = T | T[];

/** This exists because useTemplateRef<HTMLElement>("foo") lacks ref type checking. */
export type TemplateRef = ReturnType<typeof useTemplateRef<HTMLElement>>;
