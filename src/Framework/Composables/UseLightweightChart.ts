import {
  createChart,
  type DeepPartial,
  type ChartOptions,
} from "lightweight-charts";

/**
 * Vue composable that creates and manages a lightweight chart using the 'lightweight-charts' library.
 * The chart will automatically resize if its parent element resizes, thanks to a ResizeObserver.
 *
 * @param recreateChartTrigger - A ref that triggers the recreation of the chart when its value changes.
 * @param createChartOptions - A function that takes the chart's HTML element and returns the chart options.
 * @param onChartCreated - (Optional) A callback function that is invoked when the chart is created, receiving the chart instance as a parameter.
 * @returns An object containing:
 *   - chartRef: A ref to the HTML element that will contain the chart.
 *   - chart: A ref to the created chart instance.
 */
export function useLightweightChart(
  recreateChartTrigger: Ref<unknown>,
  createChartOptions: (chartRef: HTMLElement) => DeepPartial<ChartOptions>,
  onChartCreated?: (chart: IChartApi) => void
) {
  const chartRef = ref<HTMLElement | undefined>(undefined);
  const chart = ref<IChartApi | undefined>(undefined) as Ref<
    IChartApi | undefined
  >;

  let resizeObserver: ResizeObserver | null = null;

  // Setup.
  onMounted(async () => {
    if (!chartRef.value) return;

    /*
     * There were some cases in the past where graphs
     * wouldn't load until a next tick happened
     * for some reason. Added just to be sure.
     */
    await nextTick();

    // Create chart and invoke creation event.
    const newChart = createChart(
      chartRef.value,
      createChartOptions(chartRef.value)
    );
    chart.value = newChart;
    onChartCreated?.(newChart);

    // Create a ResizeObserver to observe the chart's parent element
    resizeObserver = new ResizeObserver((observers) => {
      const parent = observers[0].target;

      if (chart.value && chartRef.value) {
        chart.value.applyOptions({
          width: parent.clientWidth,
          height: parent.clientHeight,
        });

        chart.value.timeScale().fitContent();
      }
    });

    // Start observing the chart's parent element
    if (chartRef.value.parentElement) {
      resizeObserver.observe(chartRef.value.parentElement);
    }
  });

  onUnmounted(() => {
    if (chart.value) {
      chart.value.remove();
      chart.value = undefined;
    }

    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
  });

  // Recreating trigger.
  watch(recreateChartTrigger, () => {
    if (chartRef.value && chart.value) {
      chart.value.applyOptions(createChartOptions(chartRef.value));
    }
  });

  return { chart, chartRef };
}
