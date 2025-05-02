import { createChart } from "lightweight-charts";
import type {
  DeepPartial,
  ChartOptions,
  SeriesType as SeriesTypeOriginal,
  ISeriesApi,
  SeriesPartialOptionsMap as SeriesPartialOptionsMapOriginal,
  SeriesDefinition as SeriesDefinitionOriginal,
} from "lightweight-charts";

// We extend the original types with our own custom series types.
type SeriesTypeCustom = "StackedArea" | "StackedBars";
type SeriesType = SeriesTypeOriginal | SeriesTypeCustom;

/** The default options map extended with our own custom types */
type SeriesPartialOptionsMap = SeriesPartialOptionsMapOriginal & {
  StackedArea: StackedAreaSeriesPartialOptions;
  StackedBars: StackedBarsSeriesPartialOptions;
};

type SeriesDefinition<T extends SeriesType> = T extends SeriesTypeOriginal
  ? SeriesDefinitionOriginal<T>
  : SeriesDefinitionOriginal<"Custom">;

/**
 * Defines a series for the chart
 * @template T - The type of series (e.g., LineSeries, CandlestickSeries, AreaSeries, 'StackedArea')
 * @property {string} name - Unique identifier for the series
 * @property {T} type - The type of series (can be a SeriesDefinition or a custom series type)
 * @property {ComputedRef<SeriesPartialOptionsMap[T]>} options - Reactive options for the series
 *
 * @example
 * const lineSeries: Serie<'Line'> = {
 *   name: 'price',
 *   type: LineSeries,
 *   options: computed(() => ({ color: 'blue' }))
 * };
 */
type Serie<T extends SeriesType> = {
  name: string;
  type: SeriesDefinition<T> | SeriesTypeCustom;
  options: ComputedRef<SeriesPartialOptionsMap[T]>;
};

/** Represents a single series or an array of series for the chart */
type Series = MaybeArray<Serie<SeriesType>>;

type ExtractSeriesType<T> = T extends SeriesTypeCustom
  ? "Custom"
  : T extends { type: infer U }
  ? U extends SeriesTypeOriginal
    ? U
    : "Custom"
  : "Custom";

/**
 * Maps series names to their API instances
 * @template T - Series type (single series or array of series)
 *
 * Provides type-safe access to series instances after chart creation.
 * Each series is mapped by its name to the corresponding ISeriesApi instance.
 * Custom series types are mapped to 'Custom' API type.
 *
 * @example
 * // Define series with const assertions for type safety
 * const series = [
 *   {
 *     name: 'price' as const,
 *     type: LineSeries,
 *     options: computed(() => ({ color: theme.value.colors.green }))
 *   },
 *   {
 *     name: 'stacked' as const,
 *     type: 'StackedArea',
 *     options: computed(() => ({ colors: [{ line: 'red', area: 'rgba(255,0,0,0.2)' }] }))
 *   }
 * ];
 *
 * // The resulting SeriesMap type will be:
 * // {
 * //   price: ISeriesApi<'Line'> | undefined;
 * //   stacked: ISeriesApi<'Custom'> | undefined;
 * // }
 */
type SeriesMap<T extends Series> = {
  [K in Flatten<T>["name"]]:
    | ISeriesApi<ExtractSeriesType<Flatten<T>["type"]>>
    | undefined;
};

/**
 * Options for the useLightweightChart composable
 * @template T - Series or array of Series
 */
type Options<T extends Series> = {
  /** Function to create reactive chart options */
  createChartOptions: (chartRef: HTMLElement) => Ref<DeepPartial<ChartOptions>>;
  /** Single series definition or array of series definitions */
  series: T;
  /** Optional reference to the chart container element. Must be provided via useTemplateRef */
  chartRef?: ReturnType<typeof useTemplateRef<HTMLElement | null>>;
};

/**
 * Vue composable that creates and manages a lightweight chart using the 'lightweight-charts' library.
 * The chart will automatically resize if its parent element resizes, thanks to a ResizeObserver.
 *
 * @template T - Series type (single or array)
 * @param options - Chart configuration object
 * @returns Object with:
 *   - chart: Ref to chart instance
 *   - chartRef: Ref to chart container element
 *   - series: Object mapping series names to API instances
 *
 * @example
 * const { chart, series } = useLightweightChart({
 *   createChartOptions: createChartOptions(),
 *   series: [
 *     {
 *       name: 'price' as const,
 *       type: LineSeries,
 *       options: computed(() => ({
 *         color: theme.value.colors.green,
 *         lineWidth: 2,
 *         priceFormat: {
 *           type: 'custom',
 *           formatter: (x: number) => `$${x.toFixed(2)}`,
 *         },
 *       })),
 *     },
 *     {
 *       name: 'volume' as const,
 *       type: AreaSeries,
 *       options: computed(() => ({
 *         lineColor: theme.value.colors.blue,
 *         topColor: 'rgba(32, 129, 240, 0.2)',
 *         bottomColor: 'rgba(32, 129, 240, 0)',
 *       })),
 *     },
 *     {
 *       name: 'stacked' as const,
 *       type: 'StackedArea',
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
  const {
    createChartOptions,
    series: serieDefs,
    chartRef = useTemplateRef("chartRef"),
  } = options;

  const series = {} as SeriesMap<T>;
  const seriesArray: Serie<SeriesType>[] = Array.isArray(serieDefs)
    ? serieDefs
    : [serieDefs];

  const chart = shallowRef<IChartApi | undefined>(undefined);

  // Create a new lightweight chart instance the moment the div is mounted
  whenever(chartRef, (newChartRef, _, onCleanup) => {
    const chartOptions = createChartOptions(newChartRef);
    chart.value = createChart(newChartRef, chartOptions.value);

    // Create series
    for (const serieDef of seriesArray) {
      const serie =
        serieDef.type === "StackedArea" || serieDef.type === "StackedBars"
          ? chart.value.addCustomSeries(
              serieDef.type === "StackedArea"
                ? new StackedAreaSeries()
                : new StackedBarsSeries(),
              serieDef.options.value
            )
          : chart.value.addSeries(serieDef.type, serieDef.options.value);

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      (serie as any)?.applyOptions(newOptions);
    });
  }

  return { chart, chartRef, series };
}
