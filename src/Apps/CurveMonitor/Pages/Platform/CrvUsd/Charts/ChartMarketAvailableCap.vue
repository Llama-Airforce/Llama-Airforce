<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import { useQuerySnapshots } from "@CM/queries/crvusd";

const { market } = defineProps<{
  market: Parameters<typeof useQuerySnapshots>[0]["value"];
}>();

// Data
const { isFetching: loading, data: snapshots } = useQuerySnapshots(
  toRef(() => market)
);

// Chart
const theme = useTheme();

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "available" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (y: number) => `$${round(y, 0, "dollar")}${unit(y)}`,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.available) {
    return;
  }

  const newAvailSerie = snapshots.value
    .map((x) => ({
      time: x.timestamp.getUTCTimestamp(),
      value: x.borrowable,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .dropWhile((x) => x.value === 0);

  if (newAvailSerie.length > 0) {
    series.available.setData(newAvailSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    title="Borrowable & Debt Ceiling"
    :loading
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
