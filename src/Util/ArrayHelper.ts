export function toRecord<TArray, TKey extends string | number | symbol, TValue>(
  xs: TArray[],
  keySelector: (x: TArray) => TKey,
  valueSelector: (x: TArray) => TValue
) {
  return xs.reduce(
    (acc, x) => ({ ...acc, [keySelector(x)]: valueSelector(x) }),
    {} as Record<TKey, TValue>
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
