export class DataPoint {
  timeStamp: number;
  value: number;
}

export function aggregateDataPoints(datapoints: DataPoint[]): DataPoint[] {
  const aggregatedValues = datapoints.reduce(
    (acc, { timeStamp, value }) =>
      acc.set(timeStamp, (acc.get(timeStamp) || 0) + value),
    new Map<number, number>()
  );

  return Array.from(aggregatedValues).map((aggregatedValue) => {
    const res = new DataPoint();
    res.timeStamp = aggregatedValue[0];
    res.value = aggregatedValue[1];
    return res;
  });
}
