<script setup lang="ts">
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type LlammaOHLC } from "@CM/Services/Llamma";

const { t } = useI18n();

// Props
interface Props {
  ohlc: LlammaOHLC[];
}

const { ohlc } = defineProps<Props>();

// Chart
const { theme } = storeToRefs(useSettingsStore());

const invert = ref(false);
const oracle = ref(false);
let max = 1;
let min = 0;

const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      localization: {
        priceFormatter: (price: number) => formatter(price),
      },
    }),
  series: [
    {
      type: "Candlestick",
      name: "ohlc" as const,
      options: computed((): CandlestickSeriesPartialOptions => {
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
      type: "Line",
      name: "oracle" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
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
        })
      ),
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

  // Price Oracle
  const newOracleSerie: LineData[] = ohlc
    .map((x) => ({
      time: x.time as UTCTimestamp,
      value: Math.pow(x.oracle_price, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newOracleSerie.length > 0) {
    series.oracle.setData(newOracleSerie);
  }

  // Hide or show the oracle series based on the newOracle value
  series.oracle.applyOptions({
    visible: oracle.value,
  });

  chart.value.timeScale().fitContent();
}

const formatter = (x: number): string => {
  // Count number of leading zeroes after the decimal.
  const delta = max - min;
  const y = delta > 1 ? delta - Math.floor(delta) : delta;
  const m = -Math.floor(Math.log10(y) + 1) + 2;

  return `${round(x, m, "dollar")}${unit(x, "dollar")}`;
};
</script>

<template>
  <Card
    class="chart-container"
    :title="t('title')"
  >
    <template #actions>
      <div class="controls">
        <ButtonToggle
          value="Oracle Price"
          :model-value="oracle"
          @click="oracle = !oracle"
        >
        </ButtonToggle>

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

.chart-container {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
  }
}

.controls {
  display: flex;
  gap: 1rem;
}
</style>

<i18n lang="yaml" locale="en">
title: Price
</i18n>
