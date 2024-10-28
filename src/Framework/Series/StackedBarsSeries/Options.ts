import {
  type CustomSeriesOptions,
  type SeriesPartialOptions,
  customSeriesDefaultOptions,
} from "lightweight-charts";

export type StackedBarsSeriesOptions = CustomSeriesOptions & {
  colors: readonly string[];
};

export type StackedBarsSeriesPartialOptions =
  SeriesPartialOptions<StackedBarsSeriesOptions>;

export const defaultOptions: StackedBarsSeriesOptions = {
  ...customSeriesDefaultOptions,
  colors: [
    "#2962FF",
    "#E1575A",
    "#F28E2C",
    "rgb(164, 89, 209)",
    "rgb(27, 156, 133)",
  ],
} as const;
