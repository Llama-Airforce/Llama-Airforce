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
  type HistogramSeriesPartialOptions,
  type HistogramData,
} from "lightweight-charts";
import { Card, useObservable } from "@/Framework";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/PM";
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import { type Contract } from "@PM/Services";
import {
  CurvePriceService,
  CurveVolumeService,
  type OHLC,
  type Volume,
} from "@/Services";
import {
  getPriceSettings,
  getVolumeSettings,
} from "@PM/Pages/Wrappers/Settings";

const { t } = useI18n();

let chart: IChartApi;
let seriePrice: ISeriesApi<"Candlestick">;
let serieVolume: ISeriesApi<"Histogram">;
let max = 1;
let min = 0;

// Props
interface Props {
  contract: Contract;
}

const { contract } = defineProps<Props>();

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);

// Data
const priceSettings = getPriceSettings(contract);
const volumeSettings = getVolumeSettings(contract);
const socket = useSocketStore().getSocket("prices");
const priceService = new CurvePriceService(socket, "ethereum", priceSettings);
const volumeService = new CurveVolumeService(
  socket,
  "ethereum",
  volumeSettings
);

const dataPrice = useObservable(priceService.ohlc$, []);
const dataVolume = useObservable(volumeService.volume$, []);
const loading = computed(
  () => dataPrice.value.length + dataVolume.value.length === 0
);

// Hooks
onMounted(async () => {
  if (!chartRef.value) return;
  await nextTick();

  chart = createChartFunc(
    chartRef.value,
    createOptionsChart(chartRef.value, storeSettings.theme)
  );

  seriePrice = chart.addCandlestickSeries(
    createOptionsSeriePrice(storeSettings.theme)
  );
  serieVolume = chart.addHistogramSeries(
    createOptionsSerieVolume(storeSettings.theme)
  );

  createSeriesPrice(dataPrice.value);
  createSeriesVolume(dataVolume.value);
});

// Watches
watch(
  () => storeSettings.theme,
  (newTheme) => {
    if (chartRef.value) {
      chart.applyOptions(createOptionsChart(chartRef.value, newTheme));
      seriePrice.applyOptions(createOptionsSeriePrice(newTheme));
      serieVolume.applyOptions(createOptionsSerieVolume(newTheme));
    }
  }
);

watch(dataPrice, (newPrices) => {
  createSeriesPrice(newPrices);
});

watch(dataVolume, (newVolumes) => {
  createSeriesVolume(newVolumes);
});

// Methods
const createOptionsChart = (chartRef: HTMLElement, theme: Theme) => {
  return createChartStyles(chartRef, theme, storeSettings.flavor, {
    leftPriceScale: {
      scaleMargins: {
        top: 0.75,
        bottom: 0,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatterPrice(price),
    },
  });
};

const createOptionsSeriePrice = (
  theme: Theme
): CandlestickSeriesPartialOptions => {
  const colors = getColors(theme, storeSettings.flavor);

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

const createOptionsSerieVolume = (
  theme: Theme
): HistogramSeriesPartialOptions => {
  const colors = getColors(theme, storeSettings.flavor);

  return {
    color: storeSettings.flavor === "lsd" ? colors.blue : colors.purple,
    lastValueVisible: false,
    priceFormat: {
      type: "volume",
    },
    priceScaleId: "left",
    priceLineVisible: false,
  };
};

const createSeriesPrice = (newData: OHLC[]): void => {
  if (!chart || !seriePrice) {
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
    seriePrice.setData(newSerie);
    chart.timeScale().fitContent();

    min = Math.min(...newSerie.map((c) => c.low));
    max = Math.max(...newSerie.map((c) => c.high));
  }

  chart.timeScale().fitContent();
};

const createSeriesVolume = (newVolumes: Volume[]): void => {
  if (!chart || !serieVolume) {
    return;
  }

  const newVolumeSeries: HistogramData[] = chain(newVolumes)
    .map((v) => ({
      time: v.timestamp as UTCTimestamp,
      value: v.volume,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newVolumeSeries.length > 0) {
    serieVolume.setData(newVolumeSeries);
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
