export type DataPoint<T> = {
  series: T[][];
  seriesIndex: number;
  dataPointIndex: number;
  w: {
    config: {
      series: unknown[];
    };
    globals: {
      initialSeries: T[];
      stackedSeriesTotals: number[];
    };
  };
};
