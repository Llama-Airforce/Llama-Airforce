import {
  createChart,
  type DeepPartial,
  type ChartOptions,
} from "lightweight-charts";

/**
 * Vue composable that creates and manages a lightweight chart using the 'lightweight-charts' library.
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

  onMounted(async () => {
    if (!chartRef.value) return;

    /*
     * There were some cases in the past where graphs
     * wouldn't load until a next tick happened
     * for some reason. Added just to be sure.
     */
    await nextTick();

    chart.value = createChart(
      chartRef.value,
      createChartOptions(chartRef.value)
    );

    if (onChartCreated && chart.value) {
      onChartCreated(chart.value);
    }
  });

  onUnmounted(() => {
    if (chart.value) {
      chart.value.remove();
      chart.value = undefined;
    }
  });

  watch(recreateChartTrigger, () => {
    if (chartRef.value && chart.value) {
      chart.value.applyOptions(createChartOptions(chartRef.value));
    }
  });

  return { chartRef, chart };
}
