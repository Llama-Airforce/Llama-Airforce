<script setup lang="ts">
import createChartOptions from "@/Styles/ChartStylesLW";
import { CurvePriceService } from "@/Services";
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import { stableSymbol } from "@PM/Models/Flavor";

const { t } = useI18n();

// Refs
const theme = useTheme();
const { flavor } = storeToRefs(useSettingsStore());

// Price settings specifics.
const getPool = () => {
  switch (flavor.value) {
    case "lsd":
      return "0xF980B4A4194694913Af231De69AB4593f5E0fCDc";
    case "lrt":
      return "0xC03FEF1c425956A3Cd5762022E511e0d4148B3D6";
  }
};

const getReferenceToken = () => {
  switch (flavor.value) {
    case "lsd":
      return "0x4591DBfF62656E7859Afe5e45f6f47D3669fBB28"; // mkUSD
    case "lrt":
      return "0x35282d87011f87508D457F08252Bc5bFa52E10A0"; // ULTRA
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
  switch (flavor.value) {
    case "lsd":
      return "Price is in USDC from Curve mkUSD/USDC pool";
    case "lrt":
      return "Price is in USDC from Curve ULTRA/USDC pool";
    default:
      return "???";
  }
});

// Chart
const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions({
    localization: {
      priceFormatter: (y: number) => `$${round(y, 1, "dollar")}${unit(y)}`,
    },
  }),
  series: {
    type: "Candlestick",
    name: "price" as const,
    options: computed<CandlestickSeriesPartialOptions>(() => {
      const { colors } = theme.value;

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
    }),
  },
});

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.price) {
    return;
  }

  const newSerie = data.value
    .map((c) => ({
      time: c.time as UTCTimestamp,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    series.price.setData(newSerie);
  }

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    :title="t('title', { stable: stableSymbol(flavor) })"
    :loading="loading"
  >
    <template #actions>
      <Tooltip>
        <div>{{ tooltip }}</div>
      </Tooltip>
    </template>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<i18n lang="yaml" locale="en">
title: "{stable} price (last 30 days)"
</i18n>
