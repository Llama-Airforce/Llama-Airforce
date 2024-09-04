<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartOptions from "@CM/Util/ChartStyles";
import { type LiqLosses } from "@CM/Services/Liquidations";

const { losses } = defineProps<{
  losses: LiqLosses[];
}>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Area",
    name: "losses" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number) =>
          `${round(x, 0, "percentage")}${unit(x, "percentage")}`,
        minMove: 0.1,
      },
      lineWidth: 2,
      lineType: LineType.WithSteps,
      lineColor: theme.value.colors.blue,
      topColor: "rgb(32, 129, 240, 0.2)",
      bottomColor: "rgba(32, 129, 240, 0)",
      lastValueVisible: false,
      priceLineVisible: false,
    })),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.losses) {
    return;
  }

  const newSerie = losses
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value: x.pctLossMedian,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.losses.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card title="Median Loss % Among Loans with Losses">
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
