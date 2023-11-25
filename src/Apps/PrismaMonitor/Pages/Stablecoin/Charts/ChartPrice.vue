<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <Tooltip placement="left">
        <div>Price is in USDC from Curve mkUSD/FRAX/USDC pool</div>
      </Tooltip>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { Tooltip } from "@/Framework";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  createChart as createChartFunc,
  type IChartApi,
  type ISeriesApi,
  type CandlestickSeriesPartialOptions,
  type CandlestickData,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card, useObservable } from "@/Framework";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/PM";
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import { CurvePriceService, type OHLC } from "@/Services";

const { t } = useI18n();

let chart: IChartApi;
let serie: ISeriesApi<"Candlestick">;

// Refs
const storeSettings = useSettingsStore();

const chartRef = ref<HTMLElement | null>(null);

// Data
const getPriceSettings = () => {
  const end = Math.floor(new Date().getTime() / 1000);
  const interval = 14400;
  // Max is 300, but using less for thicker candles, also looks to be exactly 1 month.
  const start = end - interval * 200;

  return {
    pool: "0x0CFe5C777A7438C9Dd8Add53ed671cEc7A5FAeE5",
    chain: "ethereum",
    main_token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    reference_token: "0x4591DBfF62656E7859Afe5e45f6f47D3669fBB28",
    interval,
    start,
    end,
  };
};
const socket = useSocketStore().getSocket("prices");
const priceService = new CurvePriceService(
  socket,
  "ethereum",
  getPriceSettings()
);
const data = useObservable(priceService.ohlc$, []);
const loading = computed(() => data.value.length === 0);

// Hooks
onMounted(() => {
  if (!chartRef.value) return;

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
      priceFormatter: (price: number) => formatter(price),
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

  const newSerie: CandlestickData[] = chain(newData)
    .map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc")
    .value();

  if (newSerie.length > 0) {
    serie.setData(newSerie);
  }

  chart.timeScale().fitContent();
};

const formatter = (y: number): string => {
  return `$${round(y, 4, "dollar")}${unit(y, "dollar")}`;
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
title: mkUSD price (last 30 days)
</i18n>
