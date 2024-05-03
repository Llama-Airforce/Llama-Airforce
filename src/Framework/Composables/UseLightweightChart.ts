import { ref, onMounted, watch, type Ref, nextTick } from "vue";
import {
  createChart as createChartFunc,
  type IChartApi,
  type DeepPartial,
  type ChartOptions,
} from "lightweight-charts";

export function useLightweightChart(
  theme: Ref<string>,
  createChartOptions: (
    chartRef: HTMLElement,
    theme: string
  ) => DeepPartial<ChartOptions>,
  onChartCreated?: (chart: IChartApi) => void
) {
  const chartRef = ref<HTMLElement | null>(null);
  const chart = ref<IChartApi | null>(null);

  onMounted(async () => {
    if (!chartRef.value) return;

    /*
     * There were some cases in the past where graphs
     * wouldn't load until a next tick happened
     * for some reason. Added just to be sure.
     */
    await nextTick();

    chart.value = createChartFunc(
      chartRef.value,
      createChartOptions(chartRef.value, theme.value)
    );

    if (onChartCreated && chart.value) {
      onChartCreated(chart.value);
    }
  });

  watch(theme, (newTheme) => {
    if (chartRef.value && chart.value) {
      chart.value.applyOptions(createChartOptions(chartRef.value, newTheme));
    }
  });

  return { chartRef, chart };
}
