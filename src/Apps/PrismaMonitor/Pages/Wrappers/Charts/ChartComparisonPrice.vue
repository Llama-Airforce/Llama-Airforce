<script setup lang="ts">
import { useSettingsStore, useSocketStore } from "@PM/Stores";
import createChartStyles from "@PM/Util/ChartStyles";
import { CurvePriceService, type OHLC } from "@/Services";
import { getPriceSettings } from "@PM/Pages/Wrappers/Settings";
import { type Contract } from "@PM/Services";

const { t } = useI18n();

// Legend
const { theme } = storeToRefs(useSettingsStore());

const { items } = useLegend(() => [
  {
    id: "cvxprisma",
    label: "cvxPRISMA",
    color: theme.value.colors.blue,
  },
  {
    id: "yprisma",
    label: "yPRISMA",
    color: theme.value.colors.yellow,
  },
]);

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

// Chart
const { chart, chartRef, series } = useLightweightChart({
  recreateChartTrigger: theme,
  createChartOptions: (chartRef) =>
    createChartStyles(chartRef, theme.value, {
      localization: {
        priceFormatter: (price: number) => formatterPrice(price),
      },
    }),
  series: [
    {
      type: "Line",
      name: "convex" as const,
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
    {
      type: "Line",
      name: "yearn" as const,
      options: computed(
        (): LineSeriesPartialOptions => ({
          priceFormat: {
            type: "price",
            precision: 6,
            minMove: 0.000001,
          },
          lineWidth: 2,
          lineType: LineType.WithSteps,
          color: theme.value.colors.yellow,
          lastValueVisible: false,
          priceLineVisible: false,
        })
      ),
    },
  ],
});

watch(dataConvex, (data) => {
  createSeries(data, "convex");
});
watch(dataYearn, (data) => {
  createSeries(data, "yearn");
});

function createSeries(newData: OHLC[], contract: Contract): void {
  if (!chart.value || !series.convex || !series.yearn) {
    return;
  }

  const newSerie: LineData[] = newData
    .map((x) => ({
      time: x.time as UTCTimestamp,
      value: x.close,
    }))
    .uniqWith((x, y) => x.time === y.time)
    .orderBy((c) => c.time, "asc");

  if (newSerie.length > 0) {
    if (contract === "convex") {
      series.convex.setData(newSerie);
    } else {
      series.yearn.setData(newSerie);
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

function formatterPrice(x: number): string {
  // Count number of leading zeroes after the decimal.
  const delta = max - min;
  const y = delta > 1 ? delta - Math.floor(delta) : delta;
  const m = -Math.floor(Math.log10(y) + 1) + 2;

  return `${round(x, m, "dollar")}${unit(x, "dollar")}`;
}
</script>

<template>
  <Card
    :title="t('title')"
    :loading="loading"
  >
    <template #actions>
      <div class="actions">
        <Legend :items></Legend>
      </div>
    </template>
    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<i18n lang="yaml" locale="en">
title: Price (peg)
</i18n>
