<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type OHLC } from "@CM/Services/OHLC";

const { ohlc } = defineProps<{
  ohlc: OHLC[];
}>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const invert = ref(false);
let max = 1;
let min = 0;

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) => createChartStyles(chartRef, theme.value),
  series: {
    type: "Candlestick",
    name: "ohlc" as const,
    options: computed((): CandlestickSeriesPartialOptions => {
      const { colors } = theme.value;

      return {
        priceFormat: {
          type: "custom",
          formatter,
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
  const newOHLCSerie: CandlestickData[] = ohlc
    .map((c) => ({
      time: c.time as UTCTimestamp,
      open: Math.pow(c.open, invertMultiplier),
      high: Math.pow(c.high, invertMultiplier),
      low: Math.pow(c.low, invertMultiplier),
      close: Math.pow(c.close, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newOHLCSerie.length > 0) {
    series.ohlc.setData(newOHLCSerie);
    min = Math.min(...newOHLCSerie.map((c) => c.low));
    max = Math.max(...newOHLCSerie.map((c) => c.high));
  }

  chart.value.timeScale().fitContent();
}

// Methods
function formatter(x: number): string {
  // Count number of leading zeroes after the decimal.
  const delta = max - min;
  const y = delta > 1 ? delta - Math.floor(delta) : delta;
  const m = -Math.floor(Math.log10(y) + 1) + 2;

  return `${round(x, m, "dollar")}${unit(x, "dollar")}`;
}
</script>

<template>
  <Card title="Price">
    <template #actions>
      <div class="controls">
        <ButtonToggle
          value="Invert"
          :model-value="invert"
          @click="invert = !invert"
        >
        </ButtonToggle>
      </div>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.controls {
  display: flex;
  gap: 1rem;
}
</style>
