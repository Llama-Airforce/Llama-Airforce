<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type LiqLosses } from "@CM/Services/Liquidations";

const { losses } = defineProps<{
  losses: LiqLosses[];
}>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const { chart, series } = useLightweightChart({
  createChartOptions: (chartRef) =>
    computed(() => createChartStyles(chartRef, theme.value)),
  series: {
    type: "Area",
    name: "losses" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (x: number): string =>
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

  const newSerie: LineData[] = losses
    .map((x) => ({
      time: x.timestamp as UTCTimestamp,
      value:
        x.numTotalUsers > 0
          ? (100 * x.numUsersWithLosses) / x.numTotalUsers
          : 0,
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
  <Card title="Proportion of Loans with Losses">
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
