<template>
  <Card
    class="balances"
    :title="t('title')"
  >
    <Legend :items></Legend>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { createChart as createChartFunc } from "lightweight-charts";
import type { Balances } from "@CM/Services/MonitorLegacy";
import { useMonitorStore } from "@CM/Pages/Platform/MonitorLegacy/Store";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";

const { t } = useI18n();

let chart: IChartApi | undefined;
let lineSeries: ISeriesApi<"Line">[] = [];

// Refs
const store = useMonitorStore();
const { theme } = storeToRefs(useSettingsStore());

const chartRef = ref<HTMLElement | null>(null);

const balances = computed((): Balances[] => {
  return store.balances;
});

// Using balances directly instead of coins, because coins array info may come later.
const numCoins = computed((): number => {
  return store.balances[0]?.balances?.length ?? 0;
});

const { items } = useLegend(() =>
  store.coins
    .map((x) => x.name)
    .map((coin, i) => ({
      id: coin,
      label: coin,
      color: theme.value.colorsArray[i],
    }))
);

// Hooks
onMounted((): void => {
  if (!chartRef.value) return;

  chart = createChartFunc(chartRef.value, createOptionsChart(chartRef.value));

  addSeries();
  createSeries(balances.value);
});

// Watches
watch(balances, (newBalances) => {
  addSeries();
  createSeries(newBalances);
});

watch(theme.value, () => {
  if (chart && chartRef.value) {
    chart.applyOptions(createOptionsChart(chartRef.value));

    for (const [i, serie] of lineSeries.entries()) {
      serie.applyOptions(createOptionsSerie(i));
    }
  }
});

// Methods
const createOptionsChart = (chartRef: HTMLElement) => {
  return createChartStyles(chartRef, theme.value, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: (price: number) => formatterAbsolute(price),
    },
  });
};

const createOptionsSerie = (i: number): LineSeriesPartialOptions => {
  const { colorsArray } = theme.value;

  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: colorsArray[i],
    lastValueVisible: false,
    priceLineVisible: false,
  };
};

const addSeries = (): void => {
  if (!chart) {
    return;
  }

  // Clear old line series before adding new ones.
  for (const serie of lineSeries) {
    chart.removeSeries(serie);
  }

  lineSeries = [];
  for (let i = 0; i < numCoins.value; i++) {
    const lineSerie = chart.addLineSeries(createOptionsSerie(i));

    lineSeries.push(lineSerie);
  }
};

const createSeries = (newBalances: Balances[]): void => {
  if (!chart || lineSeries.length < 0) {
    return;
  }

  for (let i = 0; i < numCoins.value; i++) {
    const newLineSerie: LineData[] = chain(newBalances)
      .map((b) => ({
        time: b.timestamp as UTCTimestamp,
        value: b.balances[i],
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
      .value();

    if (newLineSerie.length > 0) {
      lineSeries[i].setData(newLineSerie);
    }
  }

  chart.timeScale().fitContent();
};

const formatterAbsolute = (y: number): string => {
  return `${round(y, 1, "dollar")}${unit(y, "dollar")}`;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.balances {
  :deep(.card-body) {
    flex-direction: column;
    justify-content: center;
    gap: 1rem;

    .chart {
      height: calc(100% - 3.125rem);
      z-index: 0;
    }

    > .legend {
      justify-content: center;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Balances
</i18n>
