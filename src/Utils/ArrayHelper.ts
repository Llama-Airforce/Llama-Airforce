export function toRecord<TArray, TValue>(
  xs: TArray[],
  keySelector: (x: TArray) => PropertyKey,
  valueSelector: (x: TArray) => TValue
) {
  return xs.reduce<Record<PropertyKey, TValue>>(
    (acc, x) => ({ ...acc, [keySelector(x)]: valueSelector(x) }),
    {}
  );
}

export function chunk<T>(array: T[], chunkSize: number): T[][] {
  const chunks = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    chunks.push(chunk);
  }

  return chunks;
}

export function notEmpty<TValue>(
  value: TValue | null | undefined
): value is TValue {
  return value !== null && value !== undefined;
}
