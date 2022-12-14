export type DataPoint<T> = {
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
