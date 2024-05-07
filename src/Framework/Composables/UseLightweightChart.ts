import { ref, watch, type Ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  createChart,
  type IChartApi,
  type DeepPartial,
  type ChartOptions,
} from "lightweight-charts";

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
