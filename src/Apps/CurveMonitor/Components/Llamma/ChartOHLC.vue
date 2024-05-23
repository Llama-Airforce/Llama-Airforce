<template>
  <Card
    class="chart-container"
    :title="t('title')"
  >
    <template #actions>
      <ButtonToggle
        value="Invert"
        :model-value="invert"
        @click="invert = !invert"
      >
      </ButtonToggle>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain as chain_ } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import { type LlammaOHLC } from "@CM/Services/Llamma";

const { t } = useI18n();

// Props
interface Props {
  ohlc: LlammaOHLC[];
}

const { ohlc } = defineProps<Props>();

// Refs
let ohlcSerie: ISeriesApi<"Candlestick">;

const { theme } = storeToRefs(useSettingsStore());

const invert = ref(false);
let max = 1;
let min = 0;

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    ohlcSerie = chart.addCandlestickSeries(createPriceOptionsSerie());
  }
);

// Watches
watch([toRef(() => ohlc), chart, invert], createSeries);
watch(theme, () => ohlcSerie?.applyOptions(createPriceOptionsSerie()));

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 400,
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatter(price),
    },
  });
}

function createPriceOptionsSerie(): CandlestickSeriesPartialOptions {
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
}

function createSeries([newOHLC, chart, newInvert]: [
  LlammaOHLC[]?,
  IChartApi?,
  boolean?
]): void {
  if (!chart || !ohlcSerie) {
    return;
  }

  const invertMultiplier = newInvert ? -1 : 1;

  const newOHLCSerie: CandlestickData[] = chain_(newOHLC)
    .map((c) => ({
      time: c.time as UTCTimestamp,
      open: Math.pow(c.open, invertMultiplier),
      high: Math.pow(c.high, invertMultiplier),
      low: Math.pow(c.low, invertMultiplier),
      close: Math.pow(c.close, invertMultiplier),
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newOHLCSerie.length > 0) {
    ohlcSerie.setData(newOHLCSerie);
    min = Math.min(...newOHLCSerie.map((c) => c.low));
    max = Math.max(...newOHLCSerie.map((c) => c.high));
  }

  chart.timeScale().fitContent();
}

// Methods
const formatter = (x: number): string => {
  // Count number of leading zeroes after the decimal.
  const delta = max - min;
  const y = delta > 1 ? delta - Math.floor(delta) : delta;
  const m = -Math.floor(Math.log10(y) + 1) + 2;

  return `${round(x, m, "dollar")}${unit(x, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.chart-container {
  ::v-deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Price
</i18n>
