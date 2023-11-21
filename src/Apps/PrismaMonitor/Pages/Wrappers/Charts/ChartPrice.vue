<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
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
  type UTCTimestamp,
  type CandlestickSeriesPartialOptions,
  type CandlestickData,
} from "lightweight-charts";
import { Card, useObservable } from "@/Framework";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/PM";
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import { type Contract } from "@PM/Services";
import { CurvePriceService, type OHLC } from "@/Services";

const { t } = useI18n();

let chart: IChartApi;
let serie: ISeriesApi<"Candlestick">;

// Props
interface Props {
  contract: Contract;
}

const { contract } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);

// Data
const getPriceSettings = () => {
  const end = Math.floor(new Date().getTime() / 1000);
  const interval = 14400;
  const start = end - interval * 299; // Max 300 points, one less for safety.

  if (contract === "convex") {
    return {
      pool: "0x3b21C2868B6028CfB38Ff86127eF22E68d16d53B",
      chain: "ethereum",
      main_token: "0xdA47862a83dac0c112BA89c6abC2159b95afd71C",
      reference_token: "0x34635280737b5BFe6c7DC2FC3065D60d66e78185",
      interval,
      start,
      end,
    };
  } else if (contract === "yearn") {
    return {
      pool: "0x69833361991ed76f9e8DBBcdf9ea1520fEbFb4a7",
      chain: "ethereum",
      main_token: "0xdA47862a83dac0c112BA89c6abC2159b95afd71C",
      reference_token: "0xe3668873D944E4A949DA05fc8bDE419eFF543882",
      interval,
      start,
      end,
    };
  }

  throw new Error("Unknown contract");
};
const socket = useSocketStore().getSocket("prices");
const priceService = new CurvePriceService(
  socket,
  "ethereum",
  getPriceSettings()
);
const data = useObservable(priceService.ohlc$, []);
const loading = computed(() => data.value.length === 0);

let max = 1;
let min = 0;

// Hooks
onMounted(async () => {
  if (!chartRef.value) return;
  await nextTick();

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );

  serie = chart.addCandlestickSeries(createOptionsSerie(storeSettings.theme));

  createSeries(data.value);
});

// Watches
watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      serie.applyOptions(createOptionsSerie(newTheme));
    }
  }
);

watch(data, (newData) => {
  createSeries(newData);
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

const createOptionsSerie = (theme: Theme): CandlestickSeriesPartialOptions => {
  const colors = getColors(theme);

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.01,
    },

    upColor: colors.green,
    borderUpColor: colors.green,
    wickUpColor: colors.green,
    downColor: colors.red,
    borderDownColor: colors.red,
    wickDownColor: colors.red,

    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const createSeries = (newData: OHLC[]): void => {
  if (!chart || !serie) {
    return;
  }

  const invertMultiplier = 1;

  const newSerie: CandlestickData[] = chain(newData)
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

  if (newSerie.length > 0) {
    serie.setData(newSerie);
    chart.timeScale().fitContent();

    min = Math.min(...newSerie.map((c) => c.low));
    max = Math.max(...newSerie.map((c) => c.high));
  }

  chart.timeScale().fitContent();
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
title: Price
</i18n>
