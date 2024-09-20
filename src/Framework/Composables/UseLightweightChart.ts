import { createChart } from "lightweight-charts";
import type {
  DeepPartial,
  ChartOptions,
  SeriesType as SeriesTypeOriginal,
  ISeriesApi,
  SeriesPartialOptionsMap,
  SeriesOptionsCommon,
} from "lightweight-charts";
import type { StackedAreaSeriesPartialOptions } from "../Series/StackedAreaSeries/Options";
import { StackedAreaSeries } from "../Series/StackedAreaSeries/StackedAreaSeries";

// Custom series are not supported to their ambiguity, but we support more specific ones
type SeriesTypeCustom = "StackedArea";
type SeriesType = Exclude<SeriesTypeOriginal, "Custom"> | SeriesTypeCustom;

/** Map any custom SeriesType extension to 'Custom' so it maps to a key of ISeriesApi */
type SeriesApiType<T extends SeriesType> = T extends SeriesTypeCustom
  ? "Custom"
  : T;

/** The defaalt options map extended with our own custom types */
type SeriesOptions = SeriesPartialOptionsMap & {
  StackedArea: StackedAreaSeriesPartialOptions;
};

/**
 * Defines a series for the chart
 * @template T - The type of series (e.g., 'Line', 'Candlestick', 'Area', 'StackedArea')
 * @property {string} name - Unique identifier for the series
 * @property {T} type - The type of series
 * @property {Ref<SeriesOptions[T]>} options - Reactive options for the series
 *
 * @example
 * const lineSeries: Serie<'Line'> = {
 *   name: 'price',
 *   type: 'Line',
 *   options: ref({ color: 'blue' })
 * };
 */
type Serie<T extends SeriesType> = {
  name: string;
  type: T;
  options: Ref<SeriesOptions[T]>;
};

/** Represents a single series or an array of series for the chart */
type Series = MaybeArray<Serie<SeriesType>>;

/**
 * Maps series names to their API instances
 * @template T - Series type (single series or array of series)
 *
 * Provides type-safe access to series instances after chart creation
 *
 * @example
 * const series = {
 *   price: { type: 'Line' as const, options: ref({}) },
 *   volume: { type: 'Area' as const, options: ref({}) }
 * };
 * type ChartSeries = SeriesMap<typeof series>;
 * // ChartSeries will be:
 * // {
 * //   price: ISeriesApi<'Line'> | undefined;
 * //   volume: ISeriesApi<'Area'> | undefined;
 * // }
 */
type SeriesMap<T extends Series> = {
  [K in Flatten<T>["name"]]:
    | ISeriesApi<SeriesApiType<Flatten<T>["type"]>>
    | undefined;
};

/**
 * Options for the useLightweightChart composable
 * @template T - SerieDef or SerieDefs
 */
type Options<T extends Series> = {
  /** Function to create reactive chart options */
  createChartOptions: (chartRef: HTMLElement) => Ref<DeepPartial<ChartOptions>>;
  /** Single series definition or array of series definitions */
  series: T;
};

/**
 * Vue composable that creates and manages a lightweight chart using the 'lightweight-charts' library.
 * The chart will automatically resize if its parent element resizes, thanks to a ResizeObserver.
 *
 * @template T - Series type (single or array)
 * @param options - Chart configuration object
 * @returns Object with:
 *   - chartRef: Ref to chart container element
 *   - chart: Ref to chart instance
 *   - series: Object mapping series names to API instances
 *
 * @example
 * const { chartRef, chart, series } = useLightweightChart({
 *   createChartOptions: (chartRef) => computed(() => ({
 *     height: chartRef.clientHeight,
 *   })),
 *   series: [
 *     {
 *       name: 'volume' as const,
 *       type: 'Area',
 *       options: computed(() => ({
 *         priceFormat: {
 *           type: 'custom',
 *           formatter: (y: number) => `$${y.toFixed(2)}`,
 *         },
 *         lineWidth: 2,
 *         lineColor: theme.value.colors.blue,
 *         topColor: 'rgba(32, 129, 240, 0.2)',
 *         bottomColor: 'rgba(32, 129, 240, 0)',
 *       })),
 *     },
 *     {
 *       name: 'price' as const,
 *       type: 'Line',
 *       options: computed(() => ({
 *         color: theme.value.colors.green,
 *       })),
 *     },
 *   ],
 * });
 *
 * // Accessing the created series
 * series.volume?.setData([
 *   { time: '2021-01-01', value: 1000 },
 *   { time: '2021-01-02', value: 1200 },
 * ]);
 * series.price?.setData([
 *   { time: '2021-01-01', value: 100 },
 *   { time: '2021-01-02', value: 110 },
 * ]);
 */
export function useLightweightChart<T extends Series>(options: Options<T>) {
  const { createChartOptions, series: serieDefs } = options;

  const series = {} as SeriesMap<T>;
  const seriesArray: Serie<SeriesType>[] = Array.isArray(serieDefs)
    ? serieDefs
    : [serieDefs];

  const chartRef = useTemplateRef<HTMLElement>("chartRef");
  const chart = shallowRef<IChartApi | undefined>(undefined);

  // Create a new lightweight chart instance the moment the div is mounted
  whenever(chartRef, (newChartRef, _, onCleanup) => {
    const chartOptions = createChartOptions(newChartRef);
    chart.value = createChart(newChartRef, chartOptions.value);

    // Create series
    for (const serieDef of seriesArray) {
      const serie = createSerie(chart.value, serieDef);
      series[serieDef.name as keyof typeof series] =
        serie as SeriesMap<T>[keyof SeriesMap<T>];
    }

    // Watch and apply new options coming in.
    const watchOptions = watch(chartOptions, (chartOptions) => {
      chart.value?.applyOptions(chartOptions);
    });

    // Cleanup inner watch and remove existing chart.
    onCleanup(() => {
      watchOptions();
      chart.value = undefined;
    });
  });

  // Make sure to resize the chart whenever the parent resizes as well.
  useResizeObserver(
    computed(() => chartRef.value?.parentElement),
    (observers) => {
      const parent = observers[0].target;

      chart.value?.applyOptions({
        width: parent.clientWidth,
        height: parent.clientHeight,
      });

      chart.value?.timeScale().fitContent();
    }
  );

  // Apply new options when serie options change
  for (const { name, options } of seriesArray) {
    watch(options, (newOptions) => {
      const serie = series[name as keyof SeriesMap<T>];

      // Cast options to the common denominator between custom and native series.
      serie?.applyOptions(newOptions as SeriesOptionsCommon);
    });
  }

  return { chart, chartRef, series };
}

/**
 * Creates a new series on the given chart.
 *
 * @param {IChartApi} chart - The chart instance to add the series to.
 * @param {Serie<SeriesType>} param1 - An object containing the type of series and its options.
 * @returns {ISeriesApi<SeriesType>} The created series instance.
 */
function createSerie(chart: IChartApi, { type, options }: Serie<SeriesType>) {
  const serieFactories: {
    [K in SeriesType]: (
      options: SeriesOptions[K]
    ) => ISeriesApi<SeriesApiType<K>>;
  } = {
    Area: chart.addAreaSeries.bind(chart),
    Bar: chart.addBarSeries.bind(chart),
    Baseline: chart.addBaselineSeries.bind(chart),
    Line: chart.addLineSeries.bind(chart),
    Candlestick: chart.addCandlestickSeries.bind(chart),
    Histogram: chart.addHistogramSeries.bind(chart),
    StackedArea: chart.addCustomSeries.bind(chart, new StackedAreaSeries()),
  };

  return serieFactories[type](options.value as SeriesOptionsCommon);
}
