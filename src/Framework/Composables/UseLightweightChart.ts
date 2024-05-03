import { ref, onMounted, watch, type Ref } from "vue";
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

  onMounted(() => {
    if (!chartRef.value) return;

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
