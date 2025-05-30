<script setup lang="ts">
import createChartStyles from "@/Styles/ChartStylesLW";
import type { OHLC } from "@curvefi/prices-api/ohlc";

const { ohlc, minMove = undefined } = defineProps<{
  ohlc: OHLC[];
  minMove?: number | undefined;
}>();

// Chart
const theme = useTheme();

const invert = ref(false);
let max = 1;
let min = 0;

const { chart, series } = useLightweightChart({
  createChartOptions: createChartStyles(),
  series: {
    type: CandlestickSeries,
    name: "ohlc" as const,
    options: computed<CandlestickSeriesPartialOptions>(() => {
      const { colors } = theme.value;

      return {
        priceFormat: {
          type: "custom",
          formatter,
          minMove,
        },
        upColor: colors.green,
        borderUpColor: colors.green,
        wickUpColor: colors.green,
        downColor: colors.red,
        borderDownColor: colors.red,
        wickDownColor: colors.red,
      };
    }),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.ohlc) {
    return;
  }

  // OHLC
  const invertMultiplier = invert.value ? -1 : 1;
  const data = ohlc
    .map((c) => ({
      time: c.time.getUTCTimestamp(),
      open: Math.pow(c.open, invertMultiplier),
      high: Math.pow(c.high, invertMultiplier),
      low: Math.pow(c.low, invertMultiplier),
      close: Math.pow(c.close, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.ohlc.setData(data);
  min = Math.min(...data.map((c) => c.low));
  max = Math.max(...data.map((c) => c.high));

  chart.value.timeScale().fitContent();
}

function formatter(x: number) {
  // Count number of leading zeroes after the decimal.
  const delta = max - min;
  const y = delta > 1 ? delta - Math.floor(delta) : delta;
  const m = -Math.floor(Math.log10(y) + 1) + 2;

  return `${round(x, m, "dollar")}${unit(x)}`;
}
</script>

<template>
  <Card title="Price">
    <template #actions>
      <div class="controls">
        <ButtonToggle
          :model-value="invert"
          @click="invert = !invert"
        >
          Invert
        </ButtonToggle>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<style scoped>
.controls {
  display: flex;
  gap: 1rem;
}
</style>
