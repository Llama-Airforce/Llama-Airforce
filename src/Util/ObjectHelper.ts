export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result: T = { ...target };

  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      result[key] = deepMerge(
        result[key] as Record<string, unknown>,
        source[key] as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }

  return result;
}

export function mapKeys<
  T extends Record<string, unknown>,
  U extends string | number | symbol
>(
  obj: T,
  mapper: (value: T[keyof T], key: keyof T) => U
): Record<U, T[keyof T]> {
  return Object.entries(obj).reduce<Record<U, T[keyof T]>>(
    (acc, [key, value]) => ({
      ...acc,
      [mapper(value as T[keyof T], key as keyof T)]: value as T[keyof T],
    }),
    // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
    {} as Record<U, T[keyof T]>
  );
}
