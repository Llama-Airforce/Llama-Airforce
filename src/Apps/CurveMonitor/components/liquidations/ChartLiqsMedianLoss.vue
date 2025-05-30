<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import type { LiqLosses } from "@curvefi/prices-api/liquidations";

const { losses } = defineProps<{
  losses: LiqLosses[];
}>();

// Chart
const theme = useTheme();

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "losses" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (x: number) => `${round(x, 0, "percentage")}%`,
    minMove: 0.01,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.losses) {
    return;
  }

  const newSerie = losses
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
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
