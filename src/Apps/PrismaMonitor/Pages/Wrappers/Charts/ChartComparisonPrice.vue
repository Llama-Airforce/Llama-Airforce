<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items="['cvxPRISMA', 'yPRISMA']"
          :colors="[theme.colors.blue, theme.colors.yellow]"
        ></Legend>
      </div>
    </template>
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import { CurvePriceService, type OHLC } from "@/Services";
import { getPriceSettings } from "@PM/Pages/Wrappers/Settings";
import { type Contract } from "@PM/Services";

const { t } = useI18n();

// Refs
let serieConvex: ISeriesApi<"Line">;
let serieYearn: ISeriesApi<"Line">;

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    serieConvex = chart.addLineSeries(createOptionsSerie("convex"));
    serieYearn = chart.addLineSeries(createOptionsSerie("yearn"));
  }
);

// Data
const socket = useSocketStore().getSocket("prices");
const priceServiceConvex = new CurvePriceService(
  socket,
  "ethereum",
  getPriceSettings("convex")
);
const priceServiceYearn = new CurvePriceService(
  socket,
  "ethereum",
  getPriceSettings("yearn")
);
const dataConvex = useObservable(priceServiceConvex.ohlc$, []);
const dataYearn = useObservable(priceServiceYearn.ohlc$, []);
const loading = computed(
  () => dataConvex.value.length + dataYearn.value.length === 0
);

let max = 1.1;
let min = 0;

// Watches
watch(theme, () => {
  serieConvex.applyOptions(createOptionsSerie("convex"));
  serieYearn.applyOptions(createOptionsSerie("yearn"));
});

watch(dataConvex, (newData) => createSeries(newData, "convex"));
watch(dataYearn, (newData) => createSeries(newData, "yearn"));

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    height: 300,
    leftPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatterPrice(price),
    },
  });
}

function createOptionsSerie(contract: Contract): LineSeriesPartialOptions {
  const color =
    contract === "convex" ? theme.value.colors.blue : theme.value.colors.yellow;

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color,
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function createSeries(newData: OHLC[], contract: Contract): void {
  if (!chart.value || !serieConvex || !serieYearn) {
    return;
  }

  const newSerie: LineData[] = chain(newData)
    .map((x) => ({
      time: x.time as UTCTimestamp,
      value: x.close,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    if (contract === "convex") {
      serieConvex.setData(newSerie);
    } else if (contract === "yearn") {
      serieYearn.setData(newSerie);
    }

    const allValues = [
      ...dataConvex.value.map((x) => x.close),
      ...dataYearn.value.map((x) => x.close),
    ];
    min = Math.min(...allValues);
    max = Math.max(...allValues);

    chart.value.timeScale().fitContent();
  }
}

const formatterPrice = (x: number): string => {
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
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Price (peg)
</i18n>
