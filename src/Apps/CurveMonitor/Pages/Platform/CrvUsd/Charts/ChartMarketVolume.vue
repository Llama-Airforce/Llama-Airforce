<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import { useQueryOHLC } from "@CM/queries/llamma";
import type { Chain } from "@curvefi/prices-api";
import type { Market } from "@curvefi/prices-api/crvusd";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

// Data
const { isFetching: loading, data: ohlc } = useQueryOHLC(
  "crvusd",
  computed(() => market?.llamma),
  toRef(() => chain)
);

// Chart
const theme = useTheme();

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: createAreaSerie({
    name: "volume" as const,
    color: computed(() => theme.value.colors.blue),
    formatter: (y: number) => `$${round(y, 0, "dollar")}${unit(y)}`,
  }),
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.volume) {
    return;
  }

  const newSerie = (ohlc.value ?? [])
    .map((x) => ({
      time: x.time.getUTCTimestamp(),
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
  <Card
    title="Volume"
    :loading
  >
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>
