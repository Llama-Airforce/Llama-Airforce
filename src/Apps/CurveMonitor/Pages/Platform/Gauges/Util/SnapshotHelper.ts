export type DataPoint = {
  timeStamp: number;
  value: number;
};

export function aggregateDataPoints(datapoints: DataPoint[]): DataPoint[] {
  const aggregatedValues = datapoints.reduce(
    (acc, { timeStamp, value }) =>
      acc.set(timeStamp, (acc.get(timeStamp) ?? 0) + value),
    new Map<number, number>()
  );

  return Array.from(aggregatedValues).map((aggregatedValue) => {
    return { timeStamp: aggregatedValue[0], value: aggregatedValue[1] };
  });
}
