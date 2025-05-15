<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import type { LlammaOHLC } from "@curvefi/prices-api/llamma";

const { ohlc } = defineProps<{
  ohlc: LlammaOHLC[];
}>();

// Chart
const theme = useTheme();

const invert = ref(false);
const oracle = ref(false);
let max = 1;
let min = 0;

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  }),
  series: [
    {
      type: CandlestickSeries,
      name: "ohlc" as const,
      options: computed<CandlestickSeriesPartialOptions>(() => {
        const { colors } = theme.value;

        return {
          priceFormat: {
            type: "price",
            precision: 6,
            minMove: 0.000001,
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
    {
      type: LineSeries,
      name: "oracle" as const,
      options: computed<LineSeriesPartialOptions>(() => ({
        priceFormat: {
          type: "price",
          precision: 6,
          minMove: 0.000001,
        },
        lineWidth: 2,
        lineType: LineType.WithSteps,
        color: theme.value.colors.blue,
        lastValueVisible: false,
        priceLineVisible: false,
      })),
    },
  ],
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.ohlc || !series.oracle) {
    return;
  }

  // OHLC
  const invertMultiplier = invert.value ? -1 : 1;
  const newOHLCSerie = ohlc
    .filter(
      (x) =>
        x.open !== null && x.high !== null && x.low !== null && x.close !== null
    )
    .map((c) => ({
      time: c.time.getUTCTimestamp(),
      open: Math.pow(c.open!, invertMultiplier),
      high: Math.pow(c.high!, invertMultiplier),
      low: Math.pow(c.low!, invertMultiplier),
      close: Math.pow(c.close!, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newOHLCSerie.length > 0) {
    series.ohlc.setData(newOHLCSerie);
    min = Math.min(...newOHLCSerie.map((c) => c.low));
    max = Math.max(...newOHLCSerie.map((c) => c.high));
  }

  // Price Oracle
  const newOracleSerie = ohlc
    .filter((x) => x.oraclePrice !== null)
    .map((x) => ({
      time: x.time.getUTCTimestamp(),
      value: Math.pow(x.oraclePrice!, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  series.oracle.setData(newOracleSerie);

  // Hide or show the oracle series based on the newOracle value
  series.oracle.applyOptions({
    visible: oracle.value,
  });

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
          :model-value="oracle"
          @click="oracle = !oracle"
        >
          Oracle Price
        </ButtonToggle>

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
