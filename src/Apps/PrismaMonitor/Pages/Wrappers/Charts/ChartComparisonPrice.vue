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
          :colors="getColorsArray(storeSettings.theme)"
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
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  createChart as createChartFunc,
  type IChartApi,
  type ISeriesApi,
  type LineData,
  type LineSeriesPartialOptions,
  LineType,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card, useObservable } from "@/Framework";
import { Legend } from "@/Framework/Monitor";
import { round, unit } from "@/Util";
import { getColors, getColorsArray } from "@/Styles/Themes/PM";
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import { CurvePriceService, type OHLC } from "@/Services";
import { getPriceSettings } from "@PM/Pages/Wrappers/Settings";
import { type Contract } from "@PM/Services";

const { t } = useI18n();

let chart: IChartApi;
let serieConvex: ISeriesApi<"Line">;
let serieYearn: ISeriesApi<"Line">;

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);

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

// Hooks
onMounted(async () => {
  if (!chartRef.value) return;
  await nextTick();

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );

  serieConvex = chart.addLineSeries(
    createOptionsSerie(storeSettings.theme, "convex")
  );
  serieYearn = chart.addLineSeries(
    createOptionsSerie(storeSettings.theme, "yearn")
  );

  createSeries(dataConvex.value, "convex");
  createSeries(dataYearn.value, "yearn");
});

// Watches
watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      serieConvex.applyOptions(createOptionsSerie(newTheme, "convex"));
      serieYearn.applyOptions(createOptionsSerie(newTheme, "yearn"));
    }
  }
);

watch(dataConvex, (newData) => {
  createSeries(newData, "convex");
});

watch(dataYearn, (newData) => {
  createSeries(newData, "yearn");
});

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, {
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
};

const createOptionsSerie = (
  theme: Theme,
  contract: Contract
): LineSeriesPartialOptions => {
  const colors = getColors(theme);
  const color = contract === "convex" ? colors.blue : colors.yellow;

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
};

const createSeries = (newData: OHLC[], contract: Contract): void => {
  if (!chart || !serieConvex || !serieYearn) {
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

    chart.timeScale().fitContent();
  }
};

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
    gap: 1rem;

    .chart {
      height: 300px;
      z-index: 0;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Price (peg)
</i18n>
