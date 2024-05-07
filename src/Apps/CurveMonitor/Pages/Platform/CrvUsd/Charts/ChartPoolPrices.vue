<template>
  <Card
    class="chart-container"
    :title="t('title')"
    :loading="loading"
  >
    <Legend
      :items="coins"
      :disabled="coinsDisabled"
      :clickable="true"
      :colors="theme.colorsArray"
      @click="onLegendClick"
    ></Legend>

    <div
      ref="chartRef"
      class="chart"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { useSettingsStore } from "@CM/Stores";
import createChartStyles from "@CM/Util/ChartStyles";
import CurveService, {
  type PoolPrice,
} from "@CM/Pages/Platform/CrvUsd/Services/CurveService";

const { t } = useI18n();

const curveService = new CurveService(getHost());

// Refs
let lineSeries: ISeriesApi<"Line">[] = [];

const { theme } = storeToRefs(useSettingsStore());

const { chart, chartRef } = useLightweightChart(
  theme,
  createOptionsChart,
  () => {
    addSeries();
  }
);

const coinsDisabled = ref<string[]>([]);

const whitelist = ["USDC", "USDT", "TUSD", "USDP"];
const coins = computed((): string[] =>
  Object.keys(prices.value[0]).filter(
    (key) => key !== "timestamp" && key !== "USD" && whitelist.includes(key)
  )
);

// Data
const {
  loading,
  data: prices,
  load,
} = usePromise(
  () => curveService.getPoolPrices().then((x) => x.prices),
  [{ timestamp: 0 }]
);

// Hooks
onMounted(load);

// Watches
watch(prices, (newPrices) => {
  addSeries();
  createSeries(newPrices);
});

watch(coinsDisabled, () => {
  addSeries();
  createSeries(prices.value);
});

watch(theme, () => {
  for (const [i, serie] of lineSeries.entries()) {
    serie.applyOptions(createOptionsSerie(i));
  }
});

// Chart
function createOptionsChart(chartRef: HTMLElement) {
  return createChartStyles(chartRef, theme.value, {
    rightPriceScale: {
      scaleMargins: {
        top: 0.1,
        bottom: 0.1,
      },
    },
    localization: {
      priceFormatter: formatter,
    },
  });
}

function createOptionsSerie(i: number): LineSeriesPartialOptions {
  return {
    priceFormat: {
      type: "price",
      precision: 6,
      minMove: 0.000001,
    },
    lineWidth: 2,
    lineType: LineType.WithSteps,
    color: theme.value.colorsArray[i],
    lastValueVisible: false,
    priceLineVisible: false,
  };
}

function addSeries(): void {
  if (!chart.value) {
    return;
  }

  // Clear old line series before adding new ones.
  for (const serie of lineSeries) {
    chart.value.removeSeries(serie);
  }

  lineSeries = [];
  for (let i = 0; i < coins.value.length; i++) {
    const lineSerie = chart.value.addLineSeries(createOptionsSerie(i));

    lineSeries.push(lineSerie);
  }
}

function createSeries(newPrices: PoolPrice[]): void {
  if (!chart.value || lineSeries.length < 0) {
    return;
  }

  for (const [i, coin] of coins.value.entries()) {
    // Don't render disabled coins. But keep the serie so colors don't get mixed up.
    if (coinsDisabled.value.includes(coin)) {
      lineSeries[i].setData([]);
      continue;
    }

    const newLineSerie: LineData[] = chain(newPrices)
      .map((x) => ({
        time: x.timestamp as UTCTimestamp,
        value: x[coin],
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
      .value();

    if (newLineSerie.length > 0) {
      lineSeries[i].setData(newLineSerie);
    }
  }

  chart.value.timeScale().fitContent();
}

const formatter = (y: number): string => {
  return `${round(y, 3, "dollar")}${unit(y, "dollar")}`;
};

// Events
const onLegendClick = (item: string) => {
  if (coinsDisabled.value.includes(item)) {
    const x = new Set(coinsDisabled.value);
    x.delete(item);
    coinsDisabled.value = Array.from(x);
  } else {
    coinsDisabled.value = Array.from(new Set([item, ...coinsDisabled.value]));
  }
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
    }

    > .legend {
      justify-content: center;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Stablecoin Prices of Pegkeepers
</i18n>
