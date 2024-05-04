<template>
  <Card
    class="chart-container"
    :title="t('title', { stable: stableSymbol(storeSettings.flavor) })"
    :loading="loading"
  >
    <template #actions>
      <Tooltip placement="left">
        <div>{{ tooltip }}</div>
      </Tooltip>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { Tooltip } from "@/Framework";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import {
  type ISeriesApi,
  type CandlestickSeriesPartialOptions,
  type CandlestickData,
  type UTCTimestamp,
} from "lightweight-charts";
import { Card, useObservable, useLightweightChart } from "@/Framework";
import { round, unit } from "@/Util";
import { getColors } from "@/Styles/Themes/PM";
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import type { Theme } from "@PM/Models/Theme";
import { CurvePriceService, type OHLC } from "@/Services";
import { stableSymbol } from "@PM/Models/Flavor";

const { t } = useI18n();

// Refs
let serie: ISeriesApi<"Candlestick">;

const storeSettings = useSettingsStore();
const theme = computed(() => storeSettings.theme);

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  (chart) => {
    serie = chart.addCandlestickSeries(createOptionsSerie(storeSettings.theme));
  }
);

// Price settings specifics.
const getPool = () => {
  switch (storeSettings.flavor) {
    case "lsd":
      return "0xF980B4A4194694913Af231De69AB4593f5E0fCDc";
    case "lrt":
      return "0xC03FEF1c425956A3Cd5762022E511e0d4148B3D6";
    default:
      return "";
  }
};

const getReferenceToken = () => {
  switch (storeSettings.flavor) {
    case "lsd":
      return "0x4591DBfF62656E7859Afe5e45f6f47D3669fBB28"; // mkUSD
    case "lrt":
      return "0x35282d87011f87508D457F08252Bc5bFa52E10A0"; // ULTRA
    default:
      return "";
  }
};

// Data
const getPriceSettings = () => {
  const end = Math.floor(new Date().getTime() / 1000);
  const interval = 14400;
  // Max is 300, but using less for thicker candles, also looks to be exactly 1 month.
  const start = end - interval * 200;

  const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const pool = getPool();
  const reference_token = getReferenceToken();

  return {
    pool,
    chain: "ethereum",
    main_token: usdc,
    reference_token,
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

// Refs
const data = useObservable(priceService.ohlc$, []);
const loading = computed(() => data.value.length === 0);
const tooltip = computed(() => {
  switch (storeSettings.flavor) {
    case "lsd":
      return "Price is in USDC from Curve mkUSD/USDC pool";
    case "lrt":
      return "Price is in USDC from Curve ULTRA/USDC pool";
    default:
      return "???";
  }
});

// Watches
watch(data, createSeries);
watch(theme, (newTheme) => {
  serie.applyOptions(createOptionsSerie(newTheme));
});

// Chart
function createOptionsChart(chartRef: HTMLElement, theme: string) {
  return createChartStyles(chartRef, theme as Theme, storeSettings.flavor, {
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
}

function createOptionsSerie(theme: Theme): CandlestickSeriesPartialOptions {
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

    lastValueVisible: true,
    priceLineVisible: false,
  };
}

function createSeries(newData: OHLC[]): void {
  if (!chart.value || !serie) {
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

  chart.value.timeScale().fitContent();
}

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
title: "{stable} price (last 30 days)"
</i18n>
