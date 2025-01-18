<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import type { Chain } from "@/Types/Chain";
import type { Market } from "@CM/Services/crvusd";
import type { Endpoint } from "@CM/Services/llamma";
import { useQueryOHLC } from "@CM/Services/llamma/queries";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

// Data
const { isFetching: loading, data: ohlc } = useQueryOHLC(
  toRef<Endpoint>("crvusd"),
  computed(() => market?.llamma),
  toRef(() => chain)
);

// Chart
const theme = useTheme();

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: {
    type: "Area",
    name: "volume" as const,
    options: computed<AreaSeriesPartialOptions>(() => ({
      priceFormat: {
        type: "custom",
        formatter: (y: number) => `$${round(y, 0, "dollar")}${unit(y)}`,
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
  if (!chart.value || !series.volume) {
    return;
  }

  const newSerie = (ohlc.value ?? [])
    .map((x) => ({
      time: x.time as UTCTimestamp,
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
