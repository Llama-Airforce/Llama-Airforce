import { createChart } from "lightweight-charts";
import type {
  DeepPartial,
  ChartOptions,
  SeriesType as SeriesTypeAll,
  ISeriesApi,
  SeriesPartialOptionsMap,
} from "lightweight-charts";

// Custom series are excluded due to their complexity
type SeriesType = Exclude<SeriesTypeAll, "Custom">;

/**
 * Defines a series for the chart
 * @template T - The type of series (e.g., 'Line', 'Candlestick', 'Area')
 * @property {string} name - Unique identifier for the series
 * @property {T} type - The type of series
 * @property {Ref<SeriesPartialOptionsMap[T]>} options - Reactive options for the series
 *
 * @example
 * const lineSeries: SerieDef<'Line'> = {
 *   name: 'price',
 *   type: 'Line',
 *   options: ref({ color: 'blue' })
 * };
 */
type SerieDef<T extends SeriesType> = {
  name: string;
  type: T;
  options: Ref<SeriesPartialOptionsMap[T]>;
};

/**
 * Array of SerieDef objects
 * @template T - The type of series
 */
type SerieDefs<T extends SeriesType> = SerieDef<T>[];

/**
 * Extracts the SerieDef type from either a single SerieDef or an array of SerieDefs
 * @template T - SerieDef or SerieDefs
 */
type ExtractSerieDef<T extends SerieDef<SeriesType> | SerieDefs<SeriesType>> =
  T extends SerieDefs<SeriesType> ? T[number] : T;

/**
 * Maps series names to their API instances
 * @template T - SerieDef or SerieDefs
 *
 * Allows accessing series by name after chart creation
 *
 * @example
 * const serieDefs = [
 *   { name: 'price', type: 'Line' as const, options: ref({}) },
 *   { name: 'volume', type: 'Area' as const, options: ref({}) }
 * ];
 * type ChartSeries = Series<typeof serieDefs>;
 * // ChartSeries will be:
 * // {
 * //   price: ISeriesApi<'Line'> | undefined;
 * //   volume: ISeriesApi<'Area'> | undefined;
 * // }
 */
type Series<T extends SerieDef<SeriesType> | SerieDefs<SeriesType>> = {
  [K in ExtractSerieDef<T>["name"]]:
    | ISeriesApi<ExtractSerieDef<T>["type"]>
    | undefined;
};

/**
 * Options for the useLightweightChart composable
 * @template T - SerieDef or SerieDefs
 */
type Options<T extends SerieDef<SeriesType> | SerieDefs<SeriesType>> = {
  /** Function to create reactive chart options */
  createChartOptions: (chartRef: HTMLElement) => Ref<DeepPartial<ChartOptions>>;
  /** Single series definition or array of series definitions */
  series: T;
};

/**
 * Vue composable that creates and manages a lightweight chart using the 'lightweight-charts' library.
 * The chart will automatically resize if its parent element resizes, thanks to a ResizeObserver.
 *
 * @template T - SerieDef or SerieDefs
 * @param options - An object containing chart configuration
 * @returns An object containing:
 *   - chartRef: A ref to the HTML element that will contain the chart.
 *   - chart: A ref to the created chart instance.
 *   - series: An object mapping series names to their API instances.
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
export function useLightweightChart<
  T extends SerieDef<SeriesType> | SerieDefs<SeriesType>
>(options: Options<T>) {
  const { createChartOptions, series: serieDefs } = options;

  const series = {} as Series<T>;
  const serieDefsArray: SerieDefs<SeriesType> = Array.isArray(serieDefs)
    ? serieDefs
    : [serieDefs];

  const chartRef = useTemplateRef<HTMLElement>("chartRef");
  const chart = shallowRef<IChartApi | undefined>(undefined);

  // Create a new lightweight chart instance the moment the div is mounted
  whenever(chartRef, (newChartRef, _, onCleanup) => {
    const chartOptions = createChartOptions(newChartRef);
    chart.value = createChart(newChartRef, chartOptions.value);

    // Create series
    for (const serieDef of serieDefsArray) {
      const serie = createSerie(chart.value, serieDef);
      series[serieDef.name as keyof typeof series] =
        serie as Series<T>[keyof Series<T>];
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
  for (const { name, options } of serieDefsArray) {
    watch(options, (newOptions) => {
      const serie = series[name as keyof Series<T>];
      serie?.applyOptions(newOptions);
    });
  }

  return { chart, chartRef, series };
}

/**
 * Creates a new series on the given chart.
 *
 * @param {IChartApi} chart - The chart instance to add the series to.
 * @param {SerieDef<SeriesType>} param1 - An object containing the type of series and its options.
 * @returns {ISeriesApi<SeriesType>} The created series instance.
 */
function createSerie(
  chart: IChartApi,
  { type, options }: SerieDef<SeriesType>
) {
  const serieFactories: {
    [K in SeriesType]: (options: SeriesPartialOptionsMap[K]) => ISeriesApi<K>;
  } = {
    Area: chart.addAreaSeries.bind(chart),
    Bar: chart.addBarSeries.bind(chart),
    Baseline: chart.addBaselineSeries.bind(chart),
    Line: chart.addLineSeries.bind(chart),
    Candlestick: chart.addCandlestickSeries.bind(chart),
    Histogram: chart.addHistogramSeries.bind(chart),
  };

  return serieFactories[type](options.value);
}
