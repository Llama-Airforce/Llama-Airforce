<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";

type Volume = {
  timestamp: number;
  volume: number;
};

// Props
interface Props {
  volume: Volume[];
}

const { volume } = defineProps<Props>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) => createChartStyles(chartRef, theme.value),
  series: {
    type: "Area",
    name: "volume" as const,
    options: computed(
      (): AreaSeriesPartialOptions => ({
        priceFormat: {
          type: "custom",
          formatter: (y: number): string =>
            `$${round(y, 1, "dollar")}${unit(y, "dollar")}`,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        lineColor: theme.value.colors.blue,
        topColor: "rgb(32, 129, 240, 0.2)",
        bottomColor: "rgba(32, 129, 240, 0)",
        lastValueVisible: false,
        priceLineVisible: false,
      })
    ),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.volume) {
    return;
  }

  const newSerie: LineData[] = volume
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.volume,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.volume.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card title="Volume">
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
